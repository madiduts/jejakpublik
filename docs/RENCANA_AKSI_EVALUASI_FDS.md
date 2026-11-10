# Rencana Aksi Evaluasi FDS: JejakPublik (WIA - MIA 2026)

Dokumen ini membedah hasil evaluasi lembar penilaian kelayakan awal (*Feasibility & Design Stage* / FDS) oleh mentor penilai **Adi Prabowo**, memetakan status implementasi aktual pada sistem, serta menyusun panduan spesifikasi antarmuka (Figma), frontend, dan backend untuk tahap final *submission*.

---

## 1. Ringkasan Skor & Catatan Mentor (FDS)

| No | Aspek Penilaian | Skor | Catatan Mentor |
|---|---|:---:|---|
| **1** | **Relevansi Ide terhadap Tema & Subtema** | **4 / 5** | Sangat relevan dengan *Designing Digital Futures*, menjawab 4 subtema (Open Data, Public Tracking, Civic Reporting, Decision Support). |
| **2** | **Latar Belakang & Tujuan** | **4 / 5** | Masalah fragmentasi berkas, bias istilah, dan anomali data diuraikan jelas dan berbasis urgensi nyata. |
| **3** | **Keaslian & Kreativitas** | **4 / 5** | Konsep penanganan anomali (Data State Engine: Normal, Dikoreksi, Ditahan, Tidak Dilaporkan) menjadi nilai kebaruan utama dibanding dashboard birokrasi biasa. |
| **4** | **Kejelasan Struktur (Sitemap & Wireframe)** | **5 / 5** | Sitemap dua jalur (*dual-track*) dan wireframe dinilai sangat matang, rapi, dan logis. |
| **5** | **Kelengkapan Repositori & README.md** | **4 / 5** | Repositori publik aktif, namun perlu dokumentasi langkah instalasi, variabel lingkungan, dan arsitektur yang lebih komprehensif. |
| **6** | **Ketepatan Halaman Wajib FDS** | **5 / 5** | Memenuhi kewajiban tangkapan layar antarmuka landing page dan halaman jelajah data. |
| **7** | **Desain Visual & Tata Letak** | **5 / 5** | Desain antarmuka proporsional, harmonis, kontras tinggi, dan nyaman dibaca (gaya buku besar / *ledger*). |
| **8** | **Fungsionalitas, Navigasi & Responsivitas** | **4 / 5** | Interaktivitas berjalan baik, namun integrasi formulir pelaporan partisipatif dan live fetch API perlu disempurnakan. |
| **9** | **Potensi Dampak Website** | **5 / 5** | Berpotensi tinggi mempermudah audit publik independen dan membuka ruang dialog data transparan. |

---

## 2. Matriks Gap & Pemetaan Status 3 Saran Kunci

```
[Saran 1: Automasi Validasi] ───► Backend Poller 24h & Webhook (Selesai) ──► Parser PDF Langsung (Roadmap)
[Saran 2: Crowdsourcing Audit] ─► Backend Auth, CRUD, R2 (Selesai) ──────► Wireframe & Frontend Live (Aksi Ini)
[Saran 3: Grafik Multi-Tahun] ──► Mockup Figma Tren 2023-2025 (Aksi Ini) ──► Komponen Chart Frontend (Aksi Ini)
```

### A. Saran 1: Automasi Validasi Data
* **Kebutuhan Mentor:** Skrip/parser otomatis pemindai dokumen PDF anggaran resmi BPKD/LKIP agar rekonsiliasi angka tidak bertumpu pada input manual.
* **Status Terpasang:** 
  * `IngestionService` backend: Pemantau terjadwal 24 jam dengan deteksi perbedaan hash SHA-256 berkas sumber primer.
  * Receiver Webhook (`POST /api/v1/ingestion/webhook`): Endpoint terproteksi secret key untuk *push data* instan dari bot *scraper*.
* **Tindakan Lanjutan:** Siapkan modul *PDF tabular text parser* sebagai *worker* independen yang mengekstrak angka tabel dan memicu webhook backend.

### B. Saran 2: Partisipasi Publik (*Crowdsourcing Audit*)
* **Kebutuhan Mentor:** Fitur kolaboratif bagi warga dan jurnalis untuk melaporkan kejanggalan dokumen, observasi fisik lapangan, dan mengajukan permintaan klarifikasi (*request for clarification*).
* **Status Terpasang:** 
  * Backend API penuh: Otentikasi JWT + Google OAuth, CRUD pelaporan (`/api/v1/reports`), integrasi Cloudflare R2 untuk bukti gambar, format tiket `L-2026-XXXX`, serta alur verifikasi moderator (`/api/v1/moderation`).
* **Tindakan Lanjutan (Figma & Frontend):** 
  * Sambungkan antarmuka `/masuk`, `/lapor`, `/laporan-saya`, dan `/moderator` agar melakukan kueri langsung ke backend port 3000 (menggantikan *mock localStorage*).
  * Tambahkan indikator status audit visual pada kartu program.

### C. Saran 3: Visualisasi Grafik Interaktif Multi-Tahun
* **Kebutuhan Mentor:** Grafik tren belanja daerah lintas tahun anggaran pada halaman detail instansi agar pola fiskal terbaca sekilas (*at a glance*).
* **Status Terpasang:** Baru visualisasi rasio serapan satu tahun (TA 2025).
* **Tindakan Lanjutan (Figma & Frontend):** 
  * Tambahkan komponen grafik komparasi belanja 3 tahun (TA 2023, 2024, 2025) pada frame Detail Instansi di Figma dan implementasikan komponen SVG Chart di frontend.

---

## 3. Spesifikasi Desain Figma (Untuk Disesuaikan pada Kanvas)

### A. Halaman Detail Instansi (`03 Detail instansi gabungan` - Node `235:2`)
Tambahkan satu section baru di bawah ikhtisar serapan: **"Tren Alokasi & Realisasi Belanja Multi-Tahun"**.

* **Struktur Kartu:**
  * Judul: `Tren Belanja Dinas Lingkungan Hidup (2023–2025)`
  * Subjudul: `Perbandingan pagu anggaran penetapan, perubahan, dan realisasi belanja tiga tahun anggaran terakhir.`
  * Bentuk Visual: Diagram batang ganda (*grouped bar chart*) atau grafik garis ganda (*multi-line chart*).
  * Sumbu X: `TA 2023`, `TA 2024`, `TA 2025`
  * Sumbu Y: Skala nominal Rupiah (Triliun)
  * Legenda Warna Monokrom/Aksen:
    * Pagu Anggaran: Garis putus-putus / Batang abu-abu terang (`#CBD5E1`)
    * Realisasi Belanja: Garis tegas / Batang hijau hutan gelap (`#1B4332`)
  * Data Rujukan Display (DLH):
    * TA 2023: Anggaran Rp3,24 T | Realisasi Rp2,89 T (Serapan 89,20%)
    * TA 2024: Anggaran Rp3,52 T | Realisasi Rp3,18 T (Serapan 90,34%)
    * TA 2025: Anggaran Rp3,71 T | Realisasi Rp3,36 T (Serapan 90,41%)
  * Catatan Kaki: *"Sumber: Laporan Realisasi APBD BPKD DKI Jakarta & LKIP DLH TA 2023–2025."*

### B. Halaman Masuk / Registrasi (`10 Masuk` - Node `223:2`)
Tambahkan opsi masuk menggunakan akun Google:
* Letak: Di bawah tombol Masuk utama, dipisahkan garis pembatas pembagi (`atau`).
* Komponen: Tombol putih tepi abu-abu dengan logo resmi Google:
  * Teks: `Masuk dengan Akun Google`
  * Subketerangan: `Otorisasi aman tanpa verifikasi NIK atau dokumen identitas pribadi.`

### C. Komponen Tag Status Laporan pada Tabel Pelaporan Warga (`13 Laporan saya` & `14 Moderator`)
Sematkan 4 badge status pelaporan terstandarisasi:
1. `DRAF`: Latar abu-abu, teks abu-abu gelap (`#64748B`) — Belum dikirim ke tim.
2. `MENUNGGU VERIFIKASI`: Latar kuning muda, teks kuning kecokelatan (`#B45309`) — Masuk antrean moderator.
3. `TERVERIFIKASI`: Latar hijau pucat, teks hijau tua (`#15803D`) — Diverifikasi dan terbit ke audit trail publik.
4. `DITOLAK / DITERUSKAN`: Latar merah/biru netral — Dilengkapi alasan audit tertulis.

---

## 4. Rincian Teknis Pekerjaan Frontend

1. **Integrasi Google OAuth Client:**
   * Ambil `auth_url` dari endpoint `GET /api/v1/auth/google/url`.
   * Buat rute penampung token: `/auth/callback` di `App.tsx` untuk membaca parameter `?token=...` dari URL peramban, menyimpan token ke sesi, dan mengarahkan kembali ke halaman sebelumnya.
2. **Koneksi Formulir Laporan (`CorrectionForm.tsx` & `Report.tsx`):**
   * Gunakan `FormData` untuk mengirimkan unggahan file bukti ke `POST /api/v1/reports/upload`.
   * Kirim payload formulir ke `POST /api/v1/reports`.
   * Tampilkan nomor tiket `L-2026-XXXX` secara mencolok dengan opsi salin tautan pelacakan.
3. **Komponen Grafik Tren Multi-Tahun (`FiscalTrendChart.tsx`):**
   * Implementasikan komponen grafik berbasis SVG murni (tanpa dependensi berat) yang responsif dan mendukung tooltip hover nilai nominal Rupiah.

---

## 5. Rincian Teknis Pekerjaan Repositori & README.md

Mentor memberi skor 4/5 untuk kelengkapan README.md. Perlu dilengkapi:
1. **Lencana Status (Badges):** Node.js 22+, React 19, Hono, Neon Postgres, Cloudflare R2, Lisensi MIT.
2. **Panduan Quickstart:**
   ```bash
   # Clone & Masuk direktori
   git clone https://github.com/madiduts/jejakpublik.git
   cd jejakpublik
   
   # Setup Backend
   cd backend && npm install
   cp .env.example .env
   npm test
   npm run start
   
   # Setup Frontend
   cd ../frontend && npm install
   npm run dev
   ```
3. **Peta Modul Arsitektur:** Menampilkan bagan alur MCR dan dua jalur sitemap.
4. **Tautan Berkas Validasi:** Tautan langsung ke dokumen SOP data dan arsitektur backend di folder `docs/`.
