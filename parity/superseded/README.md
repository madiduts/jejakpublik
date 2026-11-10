# Frame yang sudah digantikan

## 223:2 — 10 Masuk

Halaman `/masuk` semula dibangun dari frame **223:2** (commit `4897643`), lalu
diganti mengikuti frame **163:2 — 14 Masuk** pada commit `bf5ec83` karena pemilik
meminta desain yang lebih baru dan menambahkan opsi masuk dengan Google.

Berkas 223-2.* di folder ini adalah bukti pengukuran terakhir untuk frame itu dan
**tidak lagi menggambarkan kode**.

## Status 163:2

Aplikasi sudah disamakan dengan token frame 163:2 (kepala 94, badan 760, kolom
561, input 48 radius 6, tombol radius 999, kaki 178). Bukti yang dipakai:

- kotak unsur utama (kepala, panel foto, judul, deskripsi, kedua input, baris
  tautan, tombol, kaki, merk) berada dalam **±1,8 px** dari posisi di frame;
- selisih piksel terhadap PNG ekspor frame (`ref-163-2.png`): **1,8%** piksel
  berbeda >40 (sebelumnya 6,01% saat angkanya masih ditebak dari PNG);
- sisa selisih terkonsentrasi pada blok Google yang tidak ada di frame dan pada
  rasterisasi teks.

Dump mesin (`parity_diff.py`) belum tersimpan sebagai berkas karena sesi ini
tidak menuliskan keluaran `use_figma` ke disk; bila diperlukan, jalankan
`dump-frame.js` dengan `ROOT_ID = "163:2"` lalu simpan hasilnya sebagai
`parity/163-2.figma.json`.
