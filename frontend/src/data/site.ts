import type { LucideIcon } from 'lucide-react';

export interface NavItem { label: string; to: string }

export const NAV: NavItem[] = [
  { label: 'Beranda', to: '/' },
  { label: 'Jelajahi Data', to: '/jelajahi' },
  { label: 'Panduan', to: '/panduan' },
  { label: 'Istilah', to: '/istilah' },
  { label: 'Tentang', to: '/tentang' },
];

export interface Term { term: string; short: string; long: string; source: string }

export const TERMS: Term[] = [
  { term: 'APBD', short: 'Anggaran Pendapatan dan Belanja Daerah', long: 'Rencana keuangan tahunan pemerintah daerah yang disetujui bersama DPRD. Terdiri dari pendapatan, belanja, dan pembiayaan.', source: 'UU 23/2014, Pasal 1' },
  { term: 'APBD-P', short: 'APBD Perubahan', long: 'Revisi APBD di tengah tahun karena perubahan asumsi atau kebutuhan. Angka APBD-P yang kami tampilkan adalah angka terbit, bukan angka penetapan awal.', source: 'Permendagri 77/2020' },
  { term: 'Realisasi', short: 'Angka yang benar-benar dibelanjakan', long: 'Jumlah yang sudah dikeluarkan sampai tanggal pelaporan. Selisih terhadap anggaran bukan berarti uang hilang; sisa anggaran dapat menjadi bukti efisiensi atau tanda program lambat.', source: 'LKIP, Tabel 3.34' },
  { term: 'Serapan', short: 'Persentase realisasi terhadap anggaran', long: 'Realisasi dibagi anggaran, dikali seratus. Hanya dihitung untuk angka yang statusnya normal atau dikoreksi. Angka bertanda ditahan tidak pernah masuk penyebut.', source: 'Metodologi JejakPublik' },
  { term: 'SKPD', short: 'Satuan Kerja Perangkat Daerah', long: 'Unit kerja pemerintah daerah, misalnya dinas atau badan. Di Jakarta ada 43 SKPD yang kami tampilkan pada lapisan pertama.', source: 'Dashboard BPKD Jakarta' },
  { term: 'Sub kegiatan', short: 'Rincian terkecil dari kegiatan', long: 'Pecahan kegiatan yang punya kode, uraian, dan pagu sendiri. Pada dinas percontohan kami tampilkan sampai tingkat ini.', source: 'LKIP Dinas Lingkungan Hidup 2025' },
  { term: 'Nilai ditahan', short: 'Angka yang tidak kami hitung', long: 'Jika sebuah angka tidak bisa dipastikan dari dokumen, kami tampilkan kosong dan memberi alasan. Angka itu tidak dijumlahkan ke total mana pun. Ini berbeda dari menganggapnya nol.', source: 'Metodologi JejakPublik' },
  { term: 'Nilai dikoreksi', short: 'Angka resmi yang salah cetak', long: 'Jika dua tabel resmi memuat angka berbeda untuk baris yang sama, kami memakai angka yang cocok dengan rekonsiliasi total, lalu membuka dua angka itu beserta cara memeriksanya.', source: 'LKIP, Tabel 2.4 dan 3.34' },
  { term: 'Rekonsiliasi', short: 'Cara memastikan angka benar', long: 'Menjumlah ulang seluruh baris lalu membandingkannya dengan total yang tercetak. Jika total tercapai hanya dengan satu nilai, nilai itulah yang dipakai.', source: 'Metodologi JejakPublik' },
  { term: 'Efisiensi', short: 'Sisa anggaran yang tidak terserap', long: 'Dalam konteks dokumen ini, efisiensi berarti sisa anggaran, bukan penghematan. Satu program dapat muncul di beberapa indikator, sehingga penjumlahan lintas indikator tidak sah.', source: 'LKIP, catatan istilah' },
];

export interface Article {
  slug: string;
  title: string;
  desc: string;
  category: string;
  reading: string;
  body: string;
}

/** Enam entri panduan pada frame 06 Panduan indeks (219:2). */
export const ARTICLES: Article[] = [
  {
    slug: 'mengenal-jejakpublik',
    title: 'Mengenal JejakPublik',
    desc: 'Apa yang bisa dan tidak bisa dilakukan portal ini',
    category: 'Mulai di sini',
    reading: '3 menit',
    body: `## Portal ini untuk apa
JejakPublik membantu warga menelusuri anggaran daerah: berapa yang direncanakan, berapa yang sudah dibelanjakan, dan hasil apa yang dilaporkan.

## Yang bisa dilakukan
Membaca ringkasan 43 perangkat daerah, menelusuri satu dinas sampai sub kegiatan, membandingkan angka yang saling bertentangan, dan mengirim laporan bila menemukan kekeliruan.

## Yang tidak bisa dilakukan
Kami bukan kanal pengaduan resmi, bukan penilai korupsi, dan tidak menyajikan data waktu nyata. Seluruh angka berasal dari dokumen yang sudah terbit.`,
  },
  {
    slug: 'cara-mencari-data',
    title: 'Cara mencari data',
    desc: 'Dari total provinsi sampai satu sub kegiatan',
    category: 'Mulai di sini',
    reading: '4 menit',
    body: `## Tiga lapis pencarian
Mulai dari beranda untuk total provinsi, lanjut ke daftar 43 instansi, lalu masuk ke satu instansi untuk melihat program dan sub kegiatan.

## Memakai pencarian
Kotak cari menerima nama instansi, nama program, atau kata kunci. Hasil dapat disaring per komisi dan diurutkan menurut anggaran atau serapan.

## Kapan berhenti
Berhenti saat kamu menemukan baris yang ingin diperiksa, lalu buka dokumen sumbernya lewat tautan yang tersedia.`,
  },
  {
    slug: 'memahami-apbd',
    title: 'Memahami APBD dan realisasi',
    desc: 'Penetapan, perubahan, realisasi, dan serapan',
    category: 'Memahami anggaran',
    reading: '5 menit',
    body: `## Empat angka yang sering tertukar
Penetapan adalah anggaran awal, perubahan adalah revisinya, realisasi adalah uang yang benar-benar keluar, dan serapan adalah persentase realisasi terhadap anggaran.

## Kenapa angkanya berbeda
Revisi terjadi ketika asumsi berubah di tengah tahun. Selisih antara anggaran dan realisasi bukan otomatis kesalahan; bisa berarti program berjalan lambat atau memang tidak seluruh anggaran diperlukan.

## Yang kami tampilkan
Kami selalu menampilkan angka perubahan, karena itulah pagu yang berlaku saat laporan disusun.`,
  },
  {
    slug: 'memahami-status-data',
    title: 'Memahami status data',
    desc: 'Normal, dikoreksi, ditahan, tidak dilaporkan',
    category: 'Memahami integritas data',
    reading: '4 menit',
    body: `## Empat status
Normal berarti angka cocok dengan dokumen sumber. Dikoreksi berarti dokumen memuat dua nilai dan kami memilih yang lolos rekonsiliasi. Ditahan berarti nilai tidak dapat dipastikan sehingga tidak dihitung. Tidak dilaporkan berarti instansi memang tidak memuat baris itu.

## Kenapa ada yang ditahan
Menganggap angka yang tidak diketahui sebagai nol akan membuat total terlihat lebih kecil daripada kenyataan. Itu kesalahan yang lebih berbahaya daripada tidak menampilkan apa pun.

## Cara memeriksa
Setiap status disertai nama tabel dan halaman dokumen sumber, sehingga kamu bisa mencocokkannya sendiri.`,
  },
  {
    slug: 'menelusuri-program',
    title: 'Menelusuri program dan kegiatan',
    desc: 'Hubungan program, kegiatan, subkegiatan, unit kerja',
    category: 'Memahami kinerja',
    reading: '4 menit',
    body: `## Empat tingkat
Program menaungi kegiatan, kegiatan menaungi sub kegiatan, dan sub kegiatan dikerjakan oleh unit kerja. Jumlah anak harus sama dengan induknya, kecuali ada catatan selisih.

## Kenapa urutannya penting
Angka induk yang tidak sama dengan jumlah anaknya adalah tanda pertama bahwa dokumen perlu diperiksa lebih teliti.

## Yang kami buka
Bila selisih ditemukan, kami menampilkan kedua angka beserta hitungannya, bukan hanya angka yang kami pilih.`,
  },
  {
    slug: 'membaca-indikator',
    title: 'Membaca indikator kinerja',
    desc: 'Target, capaian, dan arti efisiensi dalam LKIP',
    category: 'Memahami kinerja',
    reading: '3 menit',
    body: `## Tiga kolom
Target adalah yang dijanjikan, realisasi adalah yang dilaporkan tercapai, dan capaian adalah persentasenya.

## Arti efisiensi
Dalam dokumen ini, efisiensi berarti sisa anggaran yang tidak terserap, bukan penghematan. Satu program dapat muncul di beberapa indikator, sehingga penjumlahan lintas indikator tidak sah.

## Cara membaca yang aman
Bandingkan indikator dengan programnya, bukan dengan total provinsi.`,
  },
];

/** Kategori pada kartu kanan frame 219:101. */
export const CATEGORIES = [
  'Mulai di sini',
  'Memahami anggaran',
  'Membaca angka',
  'Memahami integritas data',
  'Memahami kinerja',
  'Bantuan',
];

export interface Credit { name: string; license: string; url: string }

export const CREDITS: Credit[] = [
  { name: 'Foto Gunung Kartanegara', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/' },
  { name: 'Foto Danau Siombak', license: 'CC BY 3.0', url: 'https://commons.wikimedia.org/' },
  { name: 'Ikon Lucide', license: 'ISC', url: 'https://lucide.dev' },
];

export type { LucideIcon };
