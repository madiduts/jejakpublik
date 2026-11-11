# Status parity (terakhir diukur 2026-11-11)

Pengukuran memakai `parity_diff.py` terhadap DOM yang diambil dari build terkini,
viewport 1440 px.

| Frame | Halaman | COCOK | Terbuka | Waiver | Exit |
|---|---|---|---|---|---|
| 203:2 | Beranda | 909 | 199 | 36 | 1 |
| 204:2 | Jelajahi Data | 983 | 149 | 77 | 1 |
| 219:2 | Panduan | 521 | 22 | 302 | 1 |
| 222:2 | Tentang | 433 | 23 | 13 | 1 |
| 235:2 | Instansi DLH | 1406 | 22 | 6 | 1 |
| 247:2 | Program B3 | 1772 | 27 | 11 | 1 |

## Kenapa semuanya merah sekarang

Setelah merge `9e215fc` (dan rangkaian sebelumnya), tim mengubah tata letak secara
sengaja:

- `69b64f8` — *eliminate rigid pixel heights and fixed widths*: tinggi dan lebar
  tetap diganti nilai cair demi zoom peramban. Ini menggeser hampir semua
  geometri yang diukur frame, sehingga selisih terbesar ada di jenis `layout`
  (194 dari 199 selisih di Beranda, 147 dari 149 di Jelajahi).
- `d6e3724` — penyesuaian Beranda/Jelajahi versi ponsel.
- `9e215fc` — grafik fiskal multi-tahun dan tab dokumen, menambah tinggi halaman.

Selisih jenis `data` di 235/247 berasal dari perubahan isi teks (nama instansi,
angka), bukan dari tata letak.

## Artinya

Frame 203/204/219/222/235/247 **masih menggambarkan desain sebelum perubahan
cair**. Laporan di folder ini adalah keadaan sebenarnya, bukan regresi dari satu
halaman tertentu.

Pilihan penyelesaian:

1. **Kembalikan kode ke frame** — batalkan tinggi/lebar tetap yang dilepas tim.
   Bertentangan dengan tujuan commit `69b64f8`.
2. **Baseline ulang frame** — gambar ulang frame sesuai tata letak cair sekarang,
   lalu ukur lagi. Frame menjadi cermin kode (seperti 164:2).
3. **Biarkan** — terima bahwa frame hanya acuan historis, dan hentikan pemakaian
   parity sebagai gerbang.

Belum dipilih; menunggu keputusan pemilik.
