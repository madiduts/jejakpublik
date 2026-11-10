# Frame yang sudah digantikan

## 223:2 — 10 Masuk

Halaman `/masuk` semula dibangun dari frame **223:2** (commit `4897643`). Pada
2026-11-10 pemilik meminta halaman itu mengikuti frame **163:2 — 14 Masuk** dan
menambahkan opsi masuk dengan Google, sehingga seluruh anotasi `data-node-id`
223:* hilang dari kode.

Berkas di folder ini adalah bukti pengukuran terakhir untuk 223:2 dan **tidak
lagi menggambarkan kode**. Jangan dipakai untuk menyatakan status parity.

### Status parity 163:2

Belum terukur oleh `parity_diff.py`: sesi ini tidak punya akses Figma MCP
(`dump-frame.js` butuh `use_figma`), jadi `parity/163-2.figma.json` belum ada.

Verifikasi sementara memakai selisih piksel terhadap PNG ekspor frame
(`parity/ref-163-2.png`, 1440x1159):

- geometri kotak (kepala, panel foto, kolom formulir, input, tombol, kaki)
  berada dalam ±2 px dari posisi yang dibaca dari PNG;
- 6,01% piksel berbeda >40 pada seluruh halaman; 4,24% pada area di atas blok
  Google. Selisih yang tersisa terkonsentrasi pada rasterisasi teks, bukan
  posisi.

Untuk mengukuhkan: sambungkan ulang Figma MCP, jalankan `dump-frame.js` dengan
`ROOT_ID = "163:2"`, lalu `parity_diff.py` seperti frame lain.
