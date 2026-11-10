# JejakPublik

[![Node.js Version](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Hono Framework](https://img.shields.io/badge/Hono-4.7-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL%20Serverless-00E599?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2%20Object%20Storage-F38020?logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Test Suite](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen?logo=vitest&logoColor=white)](https://github.com/madiduts/jejakpublik)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Menelusuri penggunaan uang publik, dari pagu anggaran sampai realisasi.**  
> Platform independen akuntabilitas publik yang memverifikasi integritas anggaran daerah, menandai anomali angka dokumen resmi dengan *Data State Engine*, dan menghubungkan alokasi belanja pemerintah dengan capaian kinerja fisik riil.

Karya Tim **miamiu** untuk cabang **Web In Action (WIA) — Multimedia In Action (MIA) 2026**.  
Tema Utama: *Designing Digital Futures – Powering Public Transparency*

---

## 🌟 Fitur Utama & Inovasi Unggulan

1. **Model Akses Dua Jalur (*Dual-Track Architecture*):**
   * **Jalur A (Portal Publik):** Akses terbuka 100% tanpa login untuk membaca seluruh katalog 43 SKPD, filter 3 pilar fiskal (Belanja, Pendapatan, Pembiayaan), modul panduan, dan glosarium interaktif A–Z.
   * **Jalur B (Pelaporan Partisipatif):** Kanal audit warga (*Citizen Audit*) terotentikasi aman via JWT & Google OAuth tanpa pengumpulan NIK/KTP, unggah bukti dokumen/foto lapangan ke Cloudflare R2, penerbitan nomor tiket resmi `L-2026-XXXX`, serta antrean verifikasi moderator.
2. **Data State Engine (Integritas Angka Fiskal):**
   * `NORMAL`: Angka konsisten antara dokumen perencanaan dan realisasi pertanggungjawaban BPKD.
   * `DIKOREKSI`: Salah cetak dokumen primer direkonsiliasi dengan uji matematika resmi (misal: koreksi salah ketik realisasi Sudin LH Kep. Seribu pada Tabel 3.33 dan Program B3 pada Tabel 2.4 LKIP).
   * `DITAHAN`: Angka alokasi belanja yang ditangguhkan atau belum memiliki pembanding kedua.
   * `TIDAK DILAPORKAN`: Atribut yang memang tidak dilaporkan oleh dinas terkait (bernilai `NULL` murni, bukan Rp0).
3. **Eksplorasi Granular Lapis Dalam (*Deep Dive Pilot*):**
   * Menembus Dinas Lingkungan Hidup (DLH) DKI Jakarta TA 2025 hingga 8 Program, 15 Kegiatan, 33 Subkegiatan, 12 Indikator Kinerja Sasaran (LKIP Tabel 3.35), dan 10 Unit Kerja Pelaksana (Tabel 3.33).
4. **Pipa Ingesti Data Otomatis (*Automated 24h Sync & Webhook*):**
   * Penjadwal otomatis latar belakang yang memeriksa hash SHA-256 dari sumber data resmi setiap 24 jam.
   * Endpoint Webhook terproteksi secret key untuk *push data* instan dari bot *scraper*.
5. **Analisis Tren Belanja Multi-Tahun:**
   * Visualisasi komparatif belanja daerah lintas tahun anggaran (TA 2023 s.d. 2025).

---

## 🏗️ Peta Arsitektur Sistem

```text
[ Browser / Client (React 19 + Vite) ]
       │
       ▼ (REST API / JSON / Multipart)
[ Backend Gateway (Hono Framework - Node.js) ]
  ├── Middlewares: CORS, Logger, JWT Auth, Centralized Error Handler
  ├── Schemas: Zod Validation (Auth, Report, SKPD, Ingestion)
  ├── Controllers: Request Validation & Response Serialization
  └── Models: Pure Data Access Layer
       │
       ├──► [ Database: Neon Serverless PostgreSQL ] (Data Relasional)
       ├──► [ Storage: Cloudflare R2 Object Storage ] (Bukti Laporan Foto/PDF)
       └──► [ Ingestion Service ] (Polling 24 Jam & Webhook Ingestion)
```

---

## 📁 Struktur Direktori Repositori

```text
jejakpublik/
├── frontend/                     # Antarmuka Pengguna (Client)
│   ├── src/
│   │   ├── components/           # Komponen UI atomik & modular (layout, tabel, detail)
│   │   ├── pages/                # Halaman rute (Home, Explore, InstansiDetail, Report, dll.)
│   │   ├── data/                 # Berkas data statis terverifikasi (JSON BPKD & LKIP)
│   │   ├── lib/                  # Sesi, helper format angka, frame IDs
│   │   └── styles/               # CSS modular & styling slicing Figma
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Layanan API & Basis Data (Server)
│   ├── src/
│   │   ├── app.ts                # Inisialisasi Hono app & route mounting
│   │   ├── index.ts              # Entrypoint server HTTP port 3000
│   │   ├── schemas/              # Kontrak validasi input Zod
│   │   ├── controllers/          # Handler logika aplikasi
│   │   ├── models/               # Model data & query PostgreSQL
│   │   ├── routes/               # Routing endpoint API
│   │   ├── services/             # Integrasi Cloudflare R2 & Ingestion Engine
│   │   ├── middlewares/          # Auth JWT guard & error handler
│   │   └── utils/                # Standard response, pagination, errors
│   ├── tests/                    # Test suite verifikasi end-to-end
│   ├── uploads/                  # Penyimpanan berkas bukti fallback lokal
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                         # Dokumentasi Arsitektur & Prosedur Operasional
│   ├── BACKEND_ARCHITECTURE.md   # Spesifikasi arsitektur backend MCR
│   ├── SOP_EKSTRAKSI_DATA.md     # Standar ekstraksi angka manual tanpa AI scraper
│   ├── RENCANA_AKSI_EVALUASI_FDS.md # Analisis evaluasi FDS & respon rekomendasi mentor
│   └── PANDUAN_AI_AGENT_GOOGLE_DOCS.md # Standar penyuntingan naskah Google Docs
└── README.md                     # Berkas dokumentasi utama ini
```

---

## 🚀 Panduan Memulai Cepat (*Quickstart*)

### Prasyarat Lingkungan
* **Node.js:** Versi 20 LTS atau 22+
* **npm:** Versi 9+ atau 10+
* **Git:** Versi 2.30+

### 1. Kloning Repositori
```bash
git clone https://github.com/madiduts/jejakpublik.git
cd jejakpublik
```

### 2. Menjalankan Backend API
```bash
# Masuk direktori backend
cd backend

# Instalasi dependensi
npm install

# Buat konfigurasi lingkungan (.env)
cp .env.example .env

# Jalankan pengujian otomatis (100% pass)
npm test

# Jalankan server pengembangan
npm run dev

# Atau jalankan build produksi
npm run build && npm start
```
> Server backend akan aktif di: `http://localhost:3000`  
> Health check endpoint: `GET http://localhost:3000/`

### 3. Menjalankan Frontend Client
```bash
# Buka terminal baru dan masuk direktori frontend
cd frontend

# Instalasi dependensi
npm install

# Jalankan server pengembangan Vite
npm run dev
```
> Aplikasi antarmuka akan aktif di: `http://localhost:5173`

---

## 📡 Dokumentasi Endpoint REST API

| Method | Endpoint | Deskripsi | Akses |
|:---:|---|---|:---:|
| `GET` | `/` | Health check server, latency basis data, dan konfigurasi | Publik |
| `GET` | `/api/v1/skpd` | Katalog 43 SKPD dengan filter 3 pilar fiskal dan paginasi | Publik |
| `GET` | `/api/v1/skpd/:id` | Detail SKPD dan rincian Lapis Dalam pilot DLH | Publik |
| `GET` | `/api/v1/skpd/summary/apbd-2025` | Agregat total belanja, pendapatan, dan serapan 2025 | Publik |
| `GET` | `/api/v1/content/glossary` | Glosarium istilah perbendaharaan dan akuntansi daerah | Publik |
| `GET` | `/api/v1/content/about` | Metodologi, batasan/anti-goals, dan rujukan dokumen | Publik |
| `POST` | `/api/v1/auth/register` | Pendaftaran akun warga | Publik |
| `POST` | `/api/v1/auth/login` | Otentikasi pengguna & penerbitan token JWT | Publik |
| `POST` | `/api/v1/auth/forgot-password` | Pengajuan token pemulihan kata sandi (berlaku 1 jam) | Publik |
| `POST` | `/api/v1/auth/reset-password` | Pembaruan kata sandi menggunakan token valid | Publik |
| `GET` | `/api/v1/auth/google/url` | Mendapatkan URL otorisasi resmi Google OAuth 2.0 | Publik |
| `GET` | `/api/v1/auth/me` | Profil pengguna yang sedang terotentikasi | Warga / Moderator |
| `POST` | `/api/v1/reports/upload` | Unggah bukti berkas/foto ke Cloudflare R2 | Warga / Publik |
| `POST` | `/api/v1/reports` | Pengajuan laporan temuan/koreksi warga (tiket `L-2026-XXXX`) | Warga / Publik |
| `GET` | `/api/v1/reports/track/:ticket` | Pelacakan status laporan terbuka via nomor tiket | Publik |
| `GET` | `/api/v1/reports/my-reports` | Riwayat laporan milik akun pelapor | Warga |
| `GET` | `/api/v1/moderation/queue` | Antrean pemeriksaan laporan masuk (*pending*) | Moderator |
| `POST` | `/api/v1/moderation/reports/:id/decision` | Penetapan keputusan audit dan penerbitan catatan | Moderator |
| `GET` | `/api/v1/ingestion/status` | Status sinkronisasi 2 sumber data & checksum SHA-256 | Publik |
| `POST` | `/api/v1/ingestion/sync` | Pemicu manual sinkronisasi data primer | Secret Key |
| `POST` | `/api/v1/ingestion/webhook` | Webhook receiver payload data update dari luar | Secret Key |

---

## 👥 Tim Pengembang (miamiu)

* **Muhammad Zayyan Rizka** — *Ketua Tim, Data & Knowledge Lead, Quality Gate*
* **Mahdi Imantaka Sutejo** — *Lead Frontend & Financial Data Engine*
* **Liaurentino** — *UI/UX Designer & Fullstack Developer*

*Universitas Pembangunan Nasional Veteran Jakarta (UPNVJ)*

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

