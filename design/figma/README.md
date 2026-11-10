# Layar akun di Figma

Dua layar akun sudah dibuat langsung di berkas Figma (bukan impor SVG lagi).

| Frame | Node | Ukuran | Isi |
|---|---|---|---|
| **22 Daftar** | `319:2` | 1440 × 1146 | Email, kata sandi, ulangi kata sandi, tombol Buat akun, catatan |
| **23 Lupa kata sandi** | `320:2` | 1440 × 1127 | Email, tombol Kirim tautan, tautan kembali, catatan |

Keduanya berada di halaman **Eksplorasi · Semua layar foto**, di kanan frame
`14 Masuk` (`163:2`), dan memakai token yang sama dengan frame itu:

| Unsur | Nilai |
|---|---|
| Kepala | tinggi 94, padding 26/48, merk 23 SemiBold, tautan 15 Regular, pil Lapor radius 999 |
| Panel foto | 520 × 760, padding 40, gambar + lapis `#10151A` 0,58, paragraf 16/24,8 selebar 271 |
| Kolom formulir | mulai x 584, lebar 560, padding panel 56/64 |
| Judul | 34 SemiBold, line-height 36,04, letter-spacing −0,9, lebar 314 |
| Label | 12 SemiBold, huruf besar, letter-spacing 0,9 |
| Input | tinggi 48, radius 6, garis `#C5D3D9`, teks 16 |
| Tombol utama | radius 999, padding 15/26, isi `#005EA2`, teks 15 SemiBold |
| Kaki | margin 72, isi `#10151A`, padding 44/48/32/48, merk 72 SemiBold |

Struktur memakai auto-layout, jadi teks mengalir ulang bila lebarnya diubah.
Foto panel memakai `imageHash` yang sama dengan frame 163:2.

Berkas SVG ekspor yang sempat dipakai sebelum MCP tersambung sudah dihapus agar
tidak ada dua sumber kebenaran.
