# Panduan Operasional Agen AI: Standar Penyuntingan Tab Google Docs

Dokumen ini merupakan aturan operasional baku dan instruksi mutlak bagi setiap Agen AI yang bertugas membaca, menyunting, mengisi, atau merestrukturisasi dokumen naskah pada Google Docs. Agen AI wajib mematuhi seluruh parameter format di bawah ini. Penyimpangan atau improvisasi tanpa persetujuan eksplisit dianggap sebagai pelanggaran integritas data dan memicu penalti pembatalan tugas.

---

## 1. Prinsip Dasar dan Kebijakan Kepatuhan

1. **Integritas Dokumen Asal:** Agen AI dilarang mengubah gaya bawaan dokumen yang sudah terkonfigurasi pada template, kecuali diperintahkan secara tertulis.
2. **Isolasi Tab Kerja:** Setiap perintah penyuntingan wajib menyertakan identitas tab tujuan secara eksplisit. Agen AI dilarang menyentuh, membaca parsial, atau mengubah isi tab lain yang tidak ditugaskan.
3. **Kewajiban Pencadangan:** Sebelum menjalankan mutasi teks atau struktur melalui antarmuka pemrograman aplikasi, Agen AI wajib mengunduh struktur data dokumen penuh dalam format JSON ke direktori penyimpanan lokal sebagai titik pemulihan darurat.
4. **Sistem Penalti Agen AI:**
   * **Penalti Pelanggaran Format:** Setiap perubahan yang merusak ukuran font, mengubah warna teks tanpa instruksi, atau menyelipkan cetak tebal pada paragraf naskah biasa akan langsung ditolak dan dikembalikan ke titik cadangan terakhir.
   * **Penalti Pelanggaran Ruang Lingkup:** Menyunting bagian di luar bab yang ditugaskan akan membatalkan status keberhasilan tugas secara keseluruhan.

---

## 2. Standar Halaman Judul dan Sampul

1. **Judul Utama:**
   * Huruf kapital penuh, dicetak tebal, ukuran font 16 pt.
   * Perataan teks berada tepat di tengah halaman.
   * Spasi antarbaris bernilai 1.5 dengan jarak spasi vertikal atas dan bawah proporsional.
2. **Subjudul dan Identitas Tema:**
   * Ukuran font 12 pt, reguler atau miring sesuai instruksi template, perataan tengah.
3. **Susunan Identitas Penyusun:**
   * Nama lengkap anggota tim diikuti nama perguruan tinggi.
   * Format perataan tengah, ukuran font 12 pt reguler.
   * Dilarang menambahkan baris kosong berturut-turut melebihi ruang batas halaman sampul.

---

## 3. Standar Tata Letak dan Pembagian Halaman

1. **Batas Ruang Cetak:**
   * Lebar maksimum konten tabel dan elemen visual tidak boleh melebihi 468 pt agar tidak menabrak batas margin kertas standar.
2. **Pemisahan Halaman:**
   * Setiap permulaan bab baru, kata pengantar, daftar isi, lampiran, dan daftar pustaka wajib dipisahkan menggunakan pemisah halaman resmi melalui perintah pemisah halaman.
   * Dilarang keras memindahkan teks ke halaman baru dengan cara menekan tombol enter atau menyisipkan paragraf kosong berulang kali.
3. **Pembersihan Paragraf Kosong:**
   * Sisa paragraf kosong peninggalan template wajib dibersihkan tuntas agar naskah tidak renggang secara tidak wajar.

---

## 4. Standar Tipografi dan Gaya Tulisan

1. **Jenis Font:**
   * Wajib konsisten menggunakan jenis font yang telah ditetapkan pada template naskah, yaitu Plus Jakarta Sans atau Times New Roman. Dilarang mencampur jenis font yang berbeda dalam satu naskah kecuali pada elemen diagram gambar teknis.
2. **Hierarki Ukuran Font dan Gaya:**
   * **Judul Bab:** Ukuran 13 pt, huruf kapital, cetak tebal, perataan tengah.
   * **Subbab Tingkat 1:** Ukuran 11 pt, sistem penomoran angka desimal, cetak tebal, perataan kiri atau rata kanan-kiri.
   * **Subbab Tingkat 2:** Ukuran 11 pt, cetak tebal, perataan kiri.
   * **Paragraf Naskah Biasa:** Wajib ukuran 11 pt, reguler murni tanpa cetak tebal, perataan rata kanan-kiri, spasi baris 1.5, jarak spasi bawah paragraf berkisar antara 4 pt hingga 6 pt.
   * **Isi Teks di Dalam Tabel:** Ukuran 10 pt reguler, perataan kiri untuk deskripsi teks, perataan tengah untuk nomor dan kategori, perataan kanan untuk angka nominal.
   * **Judul Kolom Tabel:** Ukuran 10 pt, cetak tebal, perataan tengah.
   * **Keterangan Tabel dan Gambar:** Ukuran 10 pt, cetak miring, perataan tengah.

---

## 5. Standar Pembuatan dan Penataan Tabel

1. **Tabel Asli:**
   * Seluruh tabel harus dibuat sebagai tabel dokumen asli melalui fasilitas pembuatan tabel, bukan berupa teks yang dipisahkan spasi atau gambar tangkapan layar.
2. **Kaidah Pengisian Sel Melalui Program:**
   * Pengisian teks ke dalam sel tabel wajib dieksekusi berdasarkan urutan indeks awal secara menurun dari indeks terbesar ke indeks terkecil. Hal ini bertujuan agar penambahan teks di satu sel tidak menggeser posisi indeks sel lainnya dalam satu siklus mutasi.
3. **Proporsi Lebar Kolom:**
   * Setiap kolom wajib memiliki penetapan lebar tetap dengan total akumulasi tidak melebihi lebar bidang kerja naskah.
   * Baris pertama tabel difungsikan sebagai baris judul dengan cetak tebal dan perataan tengah.

---

## 6. Standar Penyajian Gambar, Bagan, dan Diagram

1. **Kaidah Monokrom Akademik:**
   * Seluruh bagan alur, diagram arsitektur, dan ilustrasi proses wajib disajikan dalam format hitam-putih murni 100 persen. Dilarang menyematkan warna warni, gradasi warna dekoratif, atau bayangan visual.
2. **Tipografi Diagram:**
   * Seluruh label teks di dalam bagan alur wajib menggunakan font Times New Roman cetak tebal dengan keterbacaan yang setara dan proporsional terhadap naskah.
   * Garis pembatas kotak dan panah penghubung wajib berwarna hitam tegas dengan ketebalan terstandarisasi.
3. **Alur Diagram:**
   * Diagram metodologi alur kerja wajib disusun linier dari awal hingga akhir tanpa menyematkan penomoran berulang di dalam kotak dan tanpa kotak percabangan keputusan jika alur kerja bersifat sekuensial.
   * Diagram wajib diapit oleh bentuk kapsul untuk penanda mulai dan selesai.
4. **Penempatan dan Keterangan:**
   * Setiap gambar diletakkan pada paragraf tersendiri dengan posisi rata tengah dan diberi judul keterangan resmi yang proporsional.

---

## 7. Standar Penulisan Daftar Pustaka

1. **Format Sitasi:**
   * Penulisan daftar pustaka wajib mematuhi standar American Psychological Association edisi ke-7.
2. **Penyusunan Entri:**
   * Entri disusun berurutan secara alfabetis dari huruf A sampai Z berdasarkan nama belakang penulis pertama atau nama institusi resmi.
   * Setiap entri wajib menggunakan paragraf gantung dengan jarak indentasi awal sebesar 36 pt dan baris pertama menjorok keluar minus 36 pt.
   * Judul buku, peraturan perundang-undangan, laporan resmi pemerintah, serta nama jurnal ilmiah dan nomor volume wajib dicetak miring.
3. **Kesesuaian dengan Batang Tubuh:**
   * Dilarang mencantumkan pustaka yang tidak memiliki rujukan sitasi aktif di dalam teks proposal.
   * Referensi jurnal diutamakan berasal dari jurnal terakreditasi nasional peringkat 1 hingga 3 dalam rentang 3 hingga 5 tahun terakhir, serta buku teks terbitan tahun 2020 ke atas.

---

## 8. Standar Bagian Lampiran

1. **Penyajian Data Lampiran:**
   * Tautan berkas repositori kode sumber, purwarupa desain antarmuka, direktori dokumen tim, dan layanan web yang dapat diuji wajib disajikan rapi dalam bentuk tabel berkolom terstruktur.
2. **Kolom Wajib Tabel Lampiran:**
   * Kolom nomor urut.
   * Kolom nama berkas atau artefak digital.
   * Kolom deskripsi fungsi atau cakupan berkas.
   * Kolom tautan alamat web atau penanda lingkungan eksekusi lokal.

---

## 9. Prosedur Mutasi dan Eksekusi Perintah

Setiap Agen AI yang hendak melakukan pembaruan dokumen pada Google Docs wajib menjalankan prosedur kerja berurutan:
1. **Langkah 1:** Identifikasi nomor tab dan pastikan koneksi token otorisasi akun pengguna aktif.
2. **Langkah 2:** Baca struktur dokumen dan simpan cadangan data terkini ke media lokal.
3. **Langkah 3:** Hitung rentang indeks karakter secara presisi sebelum melakukan penghapusan atau penyisipan teks.
4. **Langkah 4:** Jalankan perintah mutasi bertahap dengan jeda waktu pembatas laju kueri agar tidak melampaui kuota antarmuka Google Docs.
5. **Langkah 5:** Lakukan verifikasi pasca-eksekusi untuk memeriksa bahwa perataan teks, ukuran font, dan penomoran berada dalam kondisi sempurna tanpa mengubah struktur bab lain.
