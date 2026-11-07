# SOP Ekstraksi & Kurasi Data Manual — JejakPublik

**Versi:** 1.0  
**Tujuan:** Panduan langkah demi langkah ekstraksi data primer (BPKD & LKIP DLH TA 2025) tanpa scraper otomatis.  
**Prinsip Utama:** Akurasi 100%, deterministik, tanpa pembiasan nilai (nol != null).

---

## 1. Sumber Data Primer

| Sumber | Tipe Berkas | Target Data | Tabel Kunci |
| :--- | :--- | :--- | :--- |
| **Dashboard BPKD DKI Jakarta** | Portal Web | Agregat 43 SKPD (3 Pilar: Belanja, Pendapatan, Pembiayaan) | Halaman Ringkasan APBD 2025 |
| **LKIP Dinas Lingkungan Hidup 2025** | Dokumen PDF Resmi | Alokasi & realisasi program, kegiatan, subkegiatan | Tabel 2.4, 3.33, 3.34, 3.35 |

---

## 2. Alur Kerja Ekstraksi Manual

```text
[Dokumen PDF / Web BPKD]
          │
          ▼ 1. Salin baris tabel
[Google Sheets / Excel Template]
          │
          ▼ 2. Standardisasi format & uji rekonsiliasi matematis
[Formula Audit: SUM(anak) == induk]
          │
          ▼ 3. Labeli Data State (Normal / Dikoreksi / Ditahan / Tidak Dilaporkan)
[Export JSON / CSV]
          │
          ▼ 4. Simpan ke direktori frontend
[frontend/src/data/*.json]
```

---

## 3. Langkah Operasional Detail

### Tahap 1: Salin ke Spreadsheet
1. Buka berkas PDF LKIP atau portal BPKD.
2. Salin tabel target langsung ke Google Sheets.
3. Bersihkan pemisah ribuan:
   - Pastikan tipe kolom angka murni (tanpa format teks mata uang seperti `Rp`).
   - Ubah format Indonesia (`1.000.000,00`) menjadi format angka baku integer/float (`1000000.00`).

### Tahap 2: Uji Validasi Matematis (Formula Check)
Sebelum diekspor ke JSON, jalankan 3 formula audit wajib di spreadsheet:

1. **Uji Agregasi 3 Pilar (BPKD):**
   ```text
   =SUM(Belanja_43_SKPD) == Total_Belanja_Provinsi (Rp85.979.175.838.982)
   ```
2. **Uji Agregat Hierarki (LKIP DLH):**
   ```text
   =SUM(Subkegiatan) == Plafon_Kegiatan
   =SUM(Kegiatan) == Plafon_Program
   ```
3. **Uji Persentase Serapan:**
   ```text
   Serapan = (Realisasi / Anggaran_Perubahan) * 100
   ```
   *Catatan:* Dokumen LKIP memotong desimal (floor), bukan pembulatan standar. 90,4055% dicetak sebagai 90,40% (bukan 90,41%).

### Tahap 3: Pemberian Label Status Angka (Data State Engine)
Tentukan status untuk setiap baris:

- **NORMAL:** Angka konsisten dan penjumlahan anak cocok dengan induk.
- **DIKOREKSI:** Terdapat salah cetak di dokumen resmi, tetapi ada pembanding sah di tabel lain.
  - *Kasus Program B3:* Tabel 2.4 mencetak Rp67,8 M (salah ketik). Gunakan angka Tabel 3.34 sebesar Rp3.684.567.176. Simpan nilai cetak asli di atribut `raw_sources`.
- **DITAHAN:** Hierarki timpang / tidak ada pembanding.
  - *Kasus Gaji ASN:* Set nilai `amount: null`, status `DITAHAN`. Dilarang mengubah ke 0.
- **TIDAK_DILAPORKAN:** Instansi tidak memiliki alokasi pada pilar terkait (misal pembiayaan). Set `amount: null`, status `TIDAK_DILAPORKAN`.

---

## 4. Format Target JSON (`frontend/src/data/`)

Contoh skema objek per item program / instansi:

```json
{
  "kode": "3.27.01",
  "nama": "PROGRAM PENGENDALIAN BAHAN BERBAHAYA DAN BERACUN (B3) DAN LIMBAH B3",
  "pagu_penetapan": 3800000000,
  "pagu_perubahan": 3684567176,
  "realisasi": 2853052415,
  "persentase_serapan": 77.43,
  "state": "DIKOREKSI",
  "meta_audit": {
    "tabel_sumber": "Tabel 2.4 Halaman 26",
    "nilai_tercetak": 67876101084,
    "tabel_pembanding": "Tabel 3.34 Halaman 96",
    "catatan": "Nilai dicocokkan dengan total BPKD dan Tabel 3.34"
  }
}
```

---

## 5. Checklist Verifikasi Akhir

- [ ] Tidak ada angka kosong yang diubah paksa menjadi `0` atau `Rp0`.
- [ ] Kolom pembiayaan bernilai null tampil sebagai `"Tidak dilaporkan"`.
- [ ] Angka subkegiatan yang ditahan tidak memengaruhi persentase program induk.
- [ ] Seluruh nomor tabel dokumen sumber tercatat di metadata.
- [ ] Jalankan `npx tsc --noEmit` di direktori `frontend` untuk memastikan tipe data JSON valid.
