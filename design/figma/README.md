# Layar akun untuk Figma

Dua layar yang belum ada di berkas Figma, diekspor sebagai SVG siap impor.

| Berkas | Ukuran frame | Isi |
|---|---|---|
| `daftar.svg` | 1440 × 1188 | Daftar: email, kata sandi, ulangi kata sandi, Buat akun, Daftar dengan Google |
| `lupa-kata-sandi.svg` | 1440 × 1159 | Lupa kata sandi: email, Kirim tautan, tautan kembali |

Keduanya memakai kerangka frame **163:2 — 14 Masuk** (halaman `Eksplorasi · Semua layar foto`):
kepala 94 px dengan tautan Jelajahi Data / Panduan / Glosarium / Tentang dan pil "Lapor",
panel foto 520 px, kolom formulir 561 px di x 584, kaki gelap ringkas, plus 55 px ruang putih
di bawah seperti frame aslinya.

## Cara memasukkan ke Figma

1. Buka berkas JejakPublik, pilih halaman **Eksplorasi · Semua layar foto**.
2. Tarik `daftar.svg` dan `lupa-kata-sandi.svg` ke kanvas, di sebelah kanan frame `14 Masuk`.
3. Figma membuat satu bingkai per berkas berisi lapisan teks dan bentuk yang bisa disunting.
   Ganti nama bingkainya menjadi **22 Daftar** dan **23 Lupa kata sandi**.
4. Periksa font: teks memakai **Source Sans Pro** (600 untuk judul, 400 untuk isi). Bila belum
   aktif di akunmu, aktifkan dari daftar Google Fonts Figma.

## Yang perlu diketahui

- Impor SVG menghasilkan lapisan biasa, **bukan auto-layout**. Untuk menjadikannya komponen
  dengan auto-layout, susun ulang setelah impor.
- Teks dipecah per baris sesuai lebar kolom di aplikasi. Jika kamu mengubah ukuran bingkai,
  baris tidak akan mengalir ulang dengan sendirinya.
- Foto panel adalah gambar tertanam (JPEG 520 × 720) dari `frontend/public/img/login-520.webp`.
- Berkas ini hasil ekspor dari halaman aplikasi yang sedang berjalan, jadi posisinya sama dengan
  yang terlihat di `http://localhost:4173/daftar` dan `/lupa-kata-sandi`.
