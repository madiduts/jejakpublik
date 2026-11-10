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

export interface Article { slug: string; title: string; desc: string; reading: string; body: string }

export const ARTICLES: Article[] = [
  {
    slug: 'membaca-anggaran',
    title: 'Cara membaca anggaran tanpa latar belakang akuntansi',
    desc: 'Tiga pertanyaan yang cukup untuk mulai memahami satu halaman anggaran.',
    reading: '4 menit',
    body: `## Mulai dari tiga pertanyaan
Setiap angka anggaran menjawab satu dari tiga pertanyaan. Berapa yang direncanakan, berapa yang sudah dibelanjakan, dan hasil apa yang didapat.

## Angka rencana dan angka nyata
Anggaran adalah rencana. Realisasi adalah kenyataan. Selisih antara keduanya bukan otomatis kesalahan; bisa berarti program berjalan lambat, atau memang tidak seluruh anggaran diperlukan.

## Kenapa persentase saja tidak cukup
Persentase 100% tidak selalu berarti berhasil. Program yang anggarannya kecil bisa mencapai 100% dengan mudah. Karena itu kami selalu menampilkan nilai rupiah di samping persentase.`,
  },
  {
    slug: 'data-ditahan',
    title: 'Kenapa ada angka yang kami tahan',
    desc: 'Aturan yang membuat total kami bisa dipertanggungjawabkan.',
    reading: '3 menit',
    body: `## Prinsipnya sederhana
Kalau sebuah angka tidak bisa dipastikan dari dua dokumen resmi, kami tidak mengarang. Angka itu kami tahan.

## Apa artinya di layar
Nilai ditampilkan sebagai tanda pisah dengan alasan di bawahnya. Angka itu tidak masuk ke penjumlahan mana pun, dan penyebut persentase tidak memuatnya.

## Kenapa tidak dianggap nol
Menganggap angka yang tidak diketahui sebagai nol akan membuat total terlihat lebih kecil daripada kenyataan. Itu kesalahan yang lebih berbahaya daripada tidak menampilkan apa pun.`,
  },
  {
    slug: 'koreksi-dan-sanggahan',
    title: 'Bagaimana koreksi diperiksa sebelum ditayangkan',
    desc: 'Alur dari laporan warga sampai perubahan angka.',
    reading: '5 menit',
    body: `## Warga melapor
Kamu memilih angka yang menurutmu salah, menuliskan alasan, dan menyertakan rujukan dokumen bila ada.

## Moderator memeriksa
Setiap laporan masuk antrean. Moderator membandingkannya dengan dokumen sumber. Laporan yang kuat menjadi usulan koreksi; yang lemah ditolak dengan alasan.

## Perubahan tercatat
Angka tidak berubah diam-diam. Setiap perubahan menyimpan jejak: siapa yang mengusulkan, dokumen apa yang dipakai, dan kapan disetujui.`,
  },
];

export interface Credit { name: string; license: string; url: string }

export const CREDITS: Credit[] = [
  { name: 'Foto Gunung Kartanegara', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/' },
  { name: 'Foto Danau Siombak', license: 'CC BY 3.0', url: 'https://commons.wikimedia.org/' },
  { name: 'Ikon Lucide', license: 'ISC', url: 'https://lucide.dev' },
];

export type { LucideIcon };
