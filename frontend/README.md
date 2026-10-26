# JejakPublik

> **Menelusuri penggunaan uang publik, dari anggaran sampai realisasi.**  
> Website independen akuntabilitas publik yang memverifikasi integritas anggaran daerah, menandai anomali angka dokumen resmi, dan menghubungkan belanja pemerintah dengan capaian kinerja riil.

Karya Tim **miamiu** untuk cabang **Web In Action (WIA) — Multimedia In Action (MIA) 2026**.  
Tema: *Designing Digital Futures – Powering Public Transparency*

---

## Tech Stack

- **Frontend Core:** React 19, TypeScript, Vite
- **Routing:** React Router v6
- **Styling:** Modular CSS & Design Tokens (Tailwind-compatible, high Lighthouse score)
- **Icons:** Lucide React
- **Data Engine:** Bundled verified static JSON (LKIP DLH 2025 & Dashboard BPKD DKI Jakarta)
- **Deployment Target:** Cloudflare Pages

---

## Cara Menjalankan Project (Local Development)

### Prasyarat
- Node.js versi 18+ (direkomendasikan Node.js 20 LTS atau 24)
- npm versi 9+

### Langkah Menjalankan
```bash
# 1. Clone repositori
git clone https://github.com/<akun-tim>/jejakpublik.git
cd jejakpublik/web

# 2. Instalasi dependencies
npm install

# 3. Jalankan server lokal
npm run dev
```
Buka peramban pada alamat `http://localhost:5173`.

### Build untuk Produksi
```bash
cd web
npm run build
npm run preview
```

---

## Progres Saat Ini (First Draft — 1 November 2026)

- [x] **Beranda & Ringkasan Provinsi (F-01, F-02):** Agregasi 3 pilar APBD DKI Jakarta 2025 (Pendapatan, Belanja, Pembiayaan), label eksplisit instansi tanpa pembiayaan, dan filter katalog 43 SKPD.
- [x] **Penelusuran Mendalam Dinas Lingkungan Hidup (F-03, F-04):** Rincian hierarkis 8 Program, 15 Kegiatan, dan 33 Subkegiatan berdasarkan LKIP 2025.
- [x] **Integritas Angka / Data State Engine (F-08, F-09):** 
  - Penandaan status *Normal*, *Dikoreksi*, dan *Ditahan*.
  - Riwayat koreksi rekonsiliasi Program B3 (Tabel 2.4 vs Tabel 3.34 & BPKD).
  - Penahanan angka subkegiatan Gaji ASN (tanpa mengubah ke 0, tanpa merusak persentase).
- [x] **Indikator Kinerja & Unit Kerja (F-05, F-06):** 12 indikator kinerja DLH dengan pelurusan semantik istilah "Efisiensi", serta alokasi 10 unit kerja.
- [x] **Penjelasan Istilah & Glosarium (F-07):** Pagu penetapan, perubahan, realisasi, dan rasio serapan.
- [x] **Halaman Tentang & Keterbatasan (F-17):** Batasan tanggung jawab, transparansi metodologi sumber, dan profil pengembang.
- [ ] *Tahap Berikutnya (Final Submission 11 Nov):* Modul interaktif pelaporan warga & peninjauan moderator.

---

## Tim Pengembang (miamiu)

1. **Muhammad Zayyan Rizka** — Data & Knowledge Lead, Quality Gate
2. **Mahdi Imantaka Sutejo** — Lead Frontend & Financial Data Engine
3. **Liaurentino** — UI/UX Designer & Frontend Developer
