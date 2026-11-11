# Audit dan Sinkronisasi Proposal JejakPublik

Dokumen pencatatan audit komparasi, sinkronisasi teknis, dan perbaikan naskah proposal Google Docs terhadap basis kode implementasi JejakPublik (WIA - MIA 2026).

---

## 1. Tindakan Perbaikan Naskah Proposal Google Docs

1. **Sinkronisasi Rute Sitemap:**
   * Memperbarui diagram sitemap monokrom pada Subbab 3.2 agar label rute URL selaras dengan `App.tsx` (`/jelajahi`, `/istilah`, `/laporan-saya`).
2. **Eliminasi Duplikasi Teks:**
   * Menghapus baris caption ganda *Gambar 3.1* yang tertinggal di bawah Tabel 3.1 SWOT.
3. **Format Visual Persona Pengguna:**
   * Mentransformasi profil naratif Rani Putri menjadi kartu persona monokrom proporsional (450 pt) berstandar APA 7th.
4. **Penyelarasan Saran Multi-Tahun:**
   * Menyelaraskan redaksi Saran 4.2 poin 3 sebagai target transformasi data komparatif tiga tahun anggaran menjadi grafik dinamis interaktif pada web.
5. **Koreksi Bibliografi Akademik:**
   * Memperbaiki daftar penulis Hamzah dkk. (2024) pada jurnal *Assyarikah* menjadi 5 penulis resmi.
6. **Higienitas Pemisah Halaman:**
   * Menghapus 50+ baris enter kosong bertumpuk sebelum Lampiran dan Daftar Pustaka dengan perintah `insertPageBreak`.

---

## 2. Matriks Komparasi Proposal vs Kode Riil

| Aspek | Naskah Proposal | Kode Riil Web | Status |
| :--- | :--- | :--- | :--- |
| **Katalog SKPD** | 43 SKPD APBD 2025 | 43 SKPD JSON BPKD | Sinkron |
| **Lapis Dalam DLH** | 8 Program, 15 Kegiatan, 33 Subkegiatan | 8 Program, 15 Kegiatan, 33 Subkegiatan LKIP | Sinkron |
| **Indikator Kinerja** | 12 Indikator Kinerja Sasaran | 12 Baris LKIP Tabel 3.35 | Sinkron |
| **Unit Kerja Pelaksana** | 10 Unit Kerja | 10 Unit Kerja LKIP Tabel 3.33 | Sinkron |
| **Data State Engine** | Normal, Dikoreksi, Ditahan, Tidak Dilaporkan | Type safe handler + null state | Sinkron |
| **Kasus Koreksi B3** | Selisih Rp67,87 Miliar | Formula rekonsiliasi data | Sinkron |
| **Kasus Selisih Ditahan** | Selisih Rp138,16 Juta | Pengecualian dari rumus persentase | Sinkron |
| **Rute Navigasi** | `/jelajahi`, `/istilah`, `/lapor`, `/laporan-saya` | Rute terpasang di `App.tsx` | Sinkron |
| **Tren Belanja Multi-Tahun** | Tabel 3.5 rekapitulasi data TA 2023–2025 | Komponen `MultiYearTrendChart` terpasang di `InstansiDetail.tsx` (TA 2023–2025) | Sinkron |
| **Backend & Storage** | Hono MCR, Neon Postgres, Cloudflare R2 | Backend terpasang + test passing | Sinkron |

---

## 3. Rujukan Akademik Terverifikasi

1. **Hamzah dkk. (2024):** *Assyarikah: Journal of Islamic Economic Business*, 5(2), 199–221. Survei 400 responden, $R^2 = 0,391$, koefisien regresi 0,625.
2. **Widodo (2025/2026):** *Jurnal Budget: Isu dan Masalah Keuangan Negara*, Setjen DPR RI, 10(1), 1–21.
3. **Open Budget Survey 2023 (IBP):** Skor transparansi Indonesia 70, partisipasi publik 26.
