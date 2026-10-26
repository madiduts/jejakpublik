# AGENTS.md — Single Source of Truth: JejakPublik (WIA - MIA 2026)

Dokumen ini adalah instruksi operasional mutlak untuk SEMUA AI Coding Agent (Antigravity, Cursor, Claude Code, GitHub Copilot, Windsurf).
Baca dan patuhi seluruh aturan, kontrak tipe data, dan batasan di bawah ini SEBELUM menulis atau memodifikasi kode apa pun.

---

## 1. Executable Commands (Jalankan untuk Verifikasi)

Gunakan `npm` sebagai satu-satunya package manager (DILARANG mencampur dengan `yarn` atau `pnpm`).

- **Install dependencies:** `npm install`
- **Start dev server:** `npm run dev`
- **Typecheck (WAJIB lolos sebelum selesai tugas):** `npx tsc --noEmit`
- **Lint check:** `npm run lint`
- **Run unit tests (Data Engine):** `npm run test`
- **Production build check:** `npm run build`

> **Aturan Verifikasi Agent:** Setiap kali selesai membuat atau mengubah komponen/fungsi, kamu WAJIB menjalankan `npx tsc --noEmit` untuk memastikan tidak ada pelanggaran kontrak tipe data (khususnya penanganan nilai `null` pada Data State Engine).

---

## 2. Konteks Proyek & Scope MVP

**JejakPublik** adalah platform web transparansi dan akuntabilitas anggaran publik independen Provinsi DKI Jakarta (Tahun Anggaran 2025 — laporan historis selesai) oleh Tim **miamiu** untuk kompetisi Web In Action (MIA 2026).

### Cakupan Data Dua Lapis (Two-Tier Architecture)

1. **Lapis Luas (43 SKPD):** Ringkasan 3 pilar APBD (Pendapatan, Belanja, Pembiayaan) untuk 43 SKPD DKI Jakarta dari Dashboard BPKD. Wajib diberi penanda kedalaman data bahwa rincian hanya tersedia di tingkat SKPD.
2. **Lapis Dalam (Pilot Mendalam — Dinas Lingkungan Hidup / DLH 2025):** Menembus 8 Program, 15 Kegiatan, 33 Subkegiatan, 12 Indikator Kinerja (LKIP Tabel 3.35), dan 10 Unit Kerja.

---

## 3. Tech Stack Mutlak (Berdasarkan ADR-001)

- **Core:** React 19 + TypeScript (Strict Mode) + Vite
- **Routing:** React Router v6
- **Styling:** Modular CSS / Design Tokens (Tailwind-compatible, wajib aksesibel & responsif mobile/tablet/desktop)
- **Icons:** `lucide-react`
- **Data Layer (Anggaran & Kinerja):** Bundled Static JSON lokal di `src/data/*.json`
- **Backend Layer (Khusus Pelaporan Warga & Moderasi Demo):** Supabase (PostgreSQL & Auth) dengan graceful fallback jika project Supabase dalam kondisi _sleep/paused_.

---

## 4. Peta Arsitektur Direktori (`src/`)

Jangan membuat struktur folder baru di luar kesepakatan ini agar tidak terjadi _merge conflict_ antar-anggota tim:

```text
src/
├── components/
│   ├── common/          # UI atomik (Badge, Modal, Tooltip, Callout, Skeleton)
│   ├── budget/          # Komponen tabel anggaran, DataStateValue, SourceCitation
│   ├── performance/     # Tabel 12 indikator kinerja & Callout semantik "Efisiensi"
│   └── reporting/       # Form laporan warga (simulasi) & dashboard moderator
├── data/                # Berkas JSON statis terverifikasi (READ-ONLY untuk UI)
├── engine/              # Pure functions: kalkulasi anggaran, validasi state, persentase
├── hooks/               # Custom React hooks (termasuk Supabase fetch + fallback)
├── pages/               # Halaman utama sesuai route (Beranda, DaftarSKPD, DetailDLH, Lapor, Moderasi)
├── types/               # Kontrak TypeScript (data-contracts.ts)
└── lib/                 # Inisialisasi Supabase client & formatter mata uang/angka
```
