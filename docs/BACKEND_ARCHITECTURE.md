# Dokumen Perancangan Arsitektur Backend — JejakPublik (MIA 2026)

**Versi:** 1.0 (Draft Arsitektur Awal)  
**Target Rilis:** Modul Pelaporan Warga & Moderasi Demo (Final Submission 11 Nov 2026)  
**Basis Teknologi:** Hono (TypeScript) + Zod + PostgreSQL (Neon Serverless / Supabase)  
**Dokumen Terkait:** `docs/PRD.md`, `AGENTS.md`

---

## 1. Ringkasan Eksekutif & Batasan Ruang Lingkup

Backend JejakPublik dirancang dengan prinsip **Stateless, Lightweight, & Graceful Degradation**.

Frontend (`/`) dan eksplorasi data anggaran (`/instansi/lingkungan-hidup`) tetap mengandalkan data statis terverifikasi (JSON lokal) demi kecepatan rendering instan dan keandalan penuh. Backend secara spesifik bertugas menangani kebutuhan dinamis:

1. **Modul Pelaporan Warga (Citizen Crowdsourced Audit & Reporting):** Menerima laporan observasi lapangan warga, temuan salah ketik/anomali dokumen resmi, serta berkas bukti foto/dokumen pendukung.
2. **Modul Moderasi & Verifikasi (Moderator Review Engine):** Mengelola alur kurasi laporan (Pending &rarr; Terverifikasi &rarr; Ditolak/Ditindaklanjuti) dengan jejak audit (*audit trail*).
3. **Graceful Fallback Mode:** Jika basis data cloud sedang *cold-start*, tertidur (*paused*), atau mengalami kegagalan koneksi, backend tetap merespons status ramah dengan instruksi penanganan tanpa memicu *fatal error* di sisi frontend.

---

## 2. Arsitektur Komponen & Aliran Data (Data Flow)

```text
[ Warga / Publik (Frontend React) ]
               │
               ▼  HTTPS (POST /api/reports, multipart/json)
      [ Cloudflare Edge / CDN ]
               │
               ▼
   [ Hono Backend Service (Node.js / Edge) ]
   ├── Global Middlewares:
   │   ├── CORS Handler (Domain Allowlist)
   │   ├── Request Logger & Correlation ID
   │   ├── Rate Limiting (Anti-Spam Form)
   │   └── Security Headers (HSTS, CSP, X-Content-Type)
   │
   ├── Routing Layer (/api/v1):
   │   ├── /health              -> Pengecekan konektivitas & status DB
   │   ├── /reports             -> Submit laporan & query laporan publik
   │   ├── /auth                -> Login & refresh session moderator
   │   └── /moderation/reports  -> Tinjauan, persetujuan, & mutasi status
   │
   ├── Business Logic & Validation (Zod Schemas):
   │   ├── ReportSubmissionSchema (Sanitasi input teks & validasi link/file)
   │   └── StatusMutationSchema (Validasi transisi status laporan)
   │
   └── Data Access Layer (Database Pooler):
               │
       ┌───────┴────────────────────────┐
       ▼                                ▼
[ Neon PostgreSQL Pooler ]    [ Object Storage (R2 / S3) ]
(Tabel relasional & jejak)     (Bukti foto/dokumen PDF warga)
```

---

## 3. Skema Basis Data Relasional (Database Schema)

### 3.1. Tabel `moderators`
Menyimpan kredensial dan hak akses tim verifikator.

```sql
CREATE TABLE moderators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'reviewer', -- 'admin' | 'reviewer'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.2. Tabel `citizen_reports`
Menyimpan laporan warga mengenai keabsahan anggaran atau temuan lapangan.

```sql
CREATE TABLE citizen_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL, -- Contoh: JP-2025-0012
    reporter_name VARCHAR(100) DEFAULT 'Anonim',
    reporter_email VARCHAR(120),
    reporter_phone VARCHAR(25),
    skpd_id VARCHAR(50) NOT NULL,              -- slug atau ID SKPD (contoh: 'dinas-lingkungan-hidup')
    program_id VARCHAR(50),                    -- opsional, jika menarget program spesifik
    subkegiatan_id VARCHAR(50),                -- opsional, jika menarget subkegiatan
    report_type VARCHAR(30) NOT NULL,          -- 'anomali_angka' | 'observasi_lapangan' | 'salah_ketik'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls JSONB DEFAULT '[]'::jsonb,   -- array URL berkas bukti di object storage
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending' | 'verified' | 'rejected' | 'forwarded'
    is_public BOOLEAN NOT NULL DEFAULT false,  -- apakah ditampilkan di galeri laporan publik
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON citizen_reports(status);
CREATE INDEX idx_reports_skpd ON citizen_reports(skpd_id);
```

### 3.3. Tabel `report_audit_trails`
Merekam riwayat mutasi status dan catatan internal moderator.

```sql
CREATE TABLE report_audit_trails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES citizen_reports(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES moderators(id) ON DELETE SET NULL,
    previous_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    internal_notes TEXT,
    public_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_report_id ON report_audit_trails(report_id);
```

---

## 4. Spesifikasi Kontrak Endpoint REST API

### 4.1. Umum & Health Check
* `GET /api/v1/health`
  * **Fungsi:** Menguji ketersediaan layanan dan latensi koneksi basis data.
  * **Response (200 OK):**
    ```json
    {
      "status": "ok",
      "timestamp": "2026-11-05T18:00:00Z",
      "database": {
        "connected": true,
        "latency_ms": 32
      }
    }
    ```
  * **Fallback Response (200 OK - Graceful Status):**
    ```json
    {
      "status": "degraded",
      "timestamp": "2026-11-05T18:00:00Z",
      "database": {
        "connected": false,
        "message": "Database is sleeping or unreachable. Read-only fallback active."
      }
    }
    ```

### 4.2. Pelaporan Warga (Publik)
* `POST /api/v1/reports`
  * **Fungsi:** Menerima laporan baru dari warga.
  * **Rate Limit:** 5 request / 15 menit per IP.
  * **Payload:**
    ```json
    {
      "reporter_name": "Warga Peduli",
      "reporter_email": "warga@example.com",
      "skpd_id": "dinas-lingkungan-hidup",
      "program_id": "program-pengelolaan-sampah",
      "report_type": "anomali_angka",
      "title": "Ketidakcocokan Nilai Realisasi di Tabel 2.4",
      "description": "Pada halaman 45 dokumen LKIP, angka penjumlahan subkegiatan berbeda dengan agregat kegiatan.",
      "evidence_urls": ["https://storage.jejakpublik.id/evidence/laporan-123.jpg"]
    }
    ```
  * **Response (201 Created):**
    ```json
    {
      "status": "success",
      "ticket_number": "JP-2025-0042",
      "message": "Laporan berhasil dicatat dan masuk antrean moderasi."
    }
    ```

* `GET /api/v1/reports/public`
  * **Fungsi:** Mengambil daftar laporan warga yang telah berstatus `verified` dan diizinkan tampil (`is_public = true`).

* `GET /api/v1/reports/:ticketNumber`
  * **Fungsi:** Mengecek status progres peninjauan laporan berdasarkan nomor tiket.

### 4.3. Area Moderasi (Terproteksi)
* `POST /api/v1/auth/login`
  * **Fungsi:** Autentikasi moderator (menghasilkan JWT access token & HTTP-only refresh cookie).
* `GET /api/v1/moderation/reports`
  * **Fungsi:** Menampilkan antrean seluruh laporan (filter: `status`, `skpd_id`, `report_type`).
* `PATCH /api/v1/moderation/reports/:id/status`
  * **Fungsi:** Mengubah status laporan dan menyimpan catatan ke `report_audit_trails`.

---

## 5. Struktur Direktori Proyek Backend (`backend/src/`)

```text
backend/src/
├── config/
│   ├── env.ts              # Parsing & validasi variabel lingkungan (.env)
│   └── database.ts         # Pool koneksi Postgres (pg / postgres-js / drizzle)
├── db/
│   ├── migrations/         # Skrip migrasi SQL
│   └── schema.ts           # Definisi skema tabel & relasi
├── middlewares/
│   ├── auth.middleware.ts  # Verifikasi JWT bearer token
│   ├── cors.middleware.ts  # Aturan origin CORS frontend
│   ├── error.middleware.ts # Penanganan exception tersentralisasi
│   └── rate-limiter.ts     # Pembatas kuota request anti-spam
├── routes/
│   ├── auth.routes.ts      # Endpoint otentikasi moderator
│   ├── health.routes.ts    # Endpoint health check & koneksi DB
│   ├── moderation.routes.ts# Endpoint khusus reviewer
│   └── reports.routes.ts   # Endpoint pelaporan publik
├── schemas/
│   └── report.schema.ts    # Validasi request payload menggunakan Zod
├── services/
│   ├── audit.service.ts    # Pencatatan riwayat audit trail
│   ├── auth.service.ts     # Logika hashing password & token
│   └── report.service.ts   # CRUD & transaksi laporan warga
└── index.ts                # Inisialisasi Hono app & HTTP server
```

---

## 6. Strategi Keamanan & Resiliensi

1. **Anti-Spam & Payload Defense:**
   * Validasi tipe data ketat pada setiap request menggunakan pustaka Zod.
   * Sanitasi string untuk mencegah injeksi HTML, XSS, dan SQL Injection.
   * Pembatasan ukuran request body (maksimum 1 MB untuk JSON, berkas langsung diunggah via Pre-Signed URL ke Object Storage).
2. **Kerahasiaan Data Pengadu:**
   * Informasi kontak pelapor (`reporter_email`, `reporter_phone`) bersifat privat dan tidak pernah diekspos pada endpoint publik.
3. **Graceful Fallback saat Cold-Start:**
   * Koneksi database dilengkapi *timeout handler* (maksimum 3000 ms).
   * Jika database sedang tertidur (fitur sleep pada Neon/Supabase gratis), API mengembalikan respons terstruktur tanpa menghentikan proses Node.js.
