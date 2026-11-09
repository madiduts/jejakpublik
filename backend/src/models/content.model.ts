export interface GlossaryTerm {
  slug: string;
  term: string;
  category: 'Anggaran & Akuntansi' | 'Integritas Data' | 'Kinerja & Evaluasi';
  definition: string;
  legal_reference?: string;
}

export interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
}

export interface GuideSection {
  id: string;
  step: number;
  title: string;
  summary: string;
  points: string[];
}

export class ContentModel {
  static getGlossary(): GlossaryTerm[] {
    return [
      {
        slug: 'belanja-daerah',
        term: 'Belanja Daerah',
        category: 'Anggaran & Akuntansi',
        definition: 'Semua kewajiban Pemerintah Daerah yang diakui sebagai pengurang nilai kekayaan bersih dalam periode tahun anggaran berkenaan.',
        legal_reference: 'Permendagri No. 77 Tahun 2020'
      },
      {
        slug: 'pendapatan-daerah',
        term: 'Pendapatan Daerah',
        category: 'Anggaran & Akuntansi',
        definition: 'Semua hak daerah yang diakui sebagai penambah nilai kekayaan bersih dalam periode tahun anggaran berkenaan (PAD, Pendapatan Transfer, Lain-lain Pendapatan Sah).',
        legal_reference: 'PP No. 12 Tahun 2019'
      },
      {
        slug: 'pembiayaan-daerah',
        term: 'Pembiayaan Daerah',
        category: 'Anggaran & Akuntansi',
        definition: 'Setiap penerimaan yang perlu dibayar kembali dan/atau pengeluaran yang akan diterima kembali pada tahun anggaran berkenaan maupun tahun anggaran berikutnya (Sisa Lebih Pembiayaan Anggaran/SiLPA, Pinjaman, Penyertaan Modal).',
        legal_reference: 'Permendagri No. 77 Tahun 2020'
      },
      {
        slug: 'data-state-normal',
        term: 'Status Data: NORMAL',
        category: 'Integritas Data',
        definition: 'Data yang terverifikasi konsisten antara dokumen perencanaan, anggaran perubahan, dan realisasi tanpa selisih aritmatika.',
        legal_reference: 'Standar Integritas Data JejakPublik'
      },
      {
        slug: 'data-state-dikoreksi',
        term: 'Status Data: DIKOREKSI',
        category: 'Integritas Data',
        definition: 'Data yang memiliki anomali penulisan atau salah ketik pada dokumen primer dan telah direkonsiliasi menggunakan metode pembuktian silang matematika.',
        legal_reference: 'Audit Trail LKIP DLH 2025 Tabel 3.33'
      },
      {
        slug: 'data-state-ditahan',
        term: 'Status Data: DITAHAN',
        category: 'Integritas Data',
        definition: 'Anggaran atau subkegiatan yang pelaksanaannya ditangguhkan, diblokir, atau dialihkan ke pos cadangan berdasarkan kebijakan refocusing.',
        legal_reference: 'Laporan Realisasi Semester II BPKD'
      },
      {
        slug: 'data-state-tidak-dilaporkan',
        term: 'Status Data: TIDAK DILAPORKAN',
        category: 'Integritas Data',
        definition: 'Kolom atau atribut yang memang tidak dilaporkan oleh instansi terkait. Dipertahankan sebagai nilai NULL/strip dan tidak dipaksa menjadi angka 0.',
        legal_reference: 'Prinsip Keterbukaan Informasi Publik'
      },
      {
        slug: 'efisiensi-semantik',
        term: 'Efisiensi Anggaran (Semantik)',
        category: 'Kinerja & Evaluasi',
        definition: 'Dalam konteks LKIP pemerintah, efisiensi didefinisikan secara harfiah sebagai selisih sisa anggaran yang tidak terserap saat target kinerja terpenuhi, bukan penghematan operasional murni. Penjumlahan lintas indikator dilarang karena satu program melayani beberapa indikator.',
        legal_reference: 'Catatan Kaki LKIP DLH Tabel 3.35'
      },
      {
        slug: 'persentase-serapan',
        term: 'Persentase Serapan',
        category: 'Anggaran & Akuntansi',
        definition: 'Rasio perbandingan realisasi belanja terhadap pagu anggaran perubahan resmi (Realisasi / Pagu APBD-P × 100%).',
        legal_reference: 'Dashboard BPKD DKI Jakarta'
      }
    ];
  }

  static getAbout(): {
    title: string;
    sections: AboutSection[];
  } {
    return {
      title: 'Tentang JejakPublik',
      sections: [
        {
          id: 'profil-tujuan',
          title: 'Profil & Tujuan Platform',
          subtitle: 'Mewujudkan transparansi anggaran daerah yang dapat dibaca dan diaudit seluruh lapisan masyarakat.',
          content: [
            'JejakPublik adalah inisiatif independen yang dibangun oleh Tim miamiu untuk kompetisi Web In Action (MIA 2026).',
            'Platform ini dirancang untuk menjembatani kesenjangan akses data anggaran publik dengan menyajikan data APBD DKI Jakarta TA 2025 secara transparan, terstruktur, dan dapat ditelusuri sumber primernya.'
          ]
        },
        {
          id: 'metodologi-rekonsiliasi',
          title: 'Metodologi Pengolahan & Rekonsiliasi',
          subtitle: 'Kaidah ekstraksi deterministik tanpa halusinasi numerik AI.',
          content: [
            'Setiap angka yang ditampilkan berasal langsung dari dokumen primer resmi Pemerintah Provinsi DKI Jakarta.',
            'Nominal anggaran diekstraksi secara manual dan deterministik melalui verifikasi matematika 3 pilar (Pendapatan, Belanja, Pembiayaan). AI digunakan hanya untuk analisis semantik dan bantuan pemindaian, bukan untuk menebak angka.',
            'Jika ditemukan anomali atau salah ketik pada dokumen cetak pemerintah (seperti pada Tabel 3.33 LKIP DLH), sistem melakukan rekonsiliasi berbasis pembuktian persentase dan mencatatnya dalam audit trail.'
          ]
        },
        {
          id: 'sumber-dokumen-primer',
          title: 'Sumber & Dokumen Primer',
          subtitle: 'Rujukan legalitas data publik.',
          content: [
            'Laporan Kinerja Instansi Pemerintah (LKIP) Dinas Lingkungan Hidup Provinsi DKI Jakarta TA 2025.',
            'Data Rekapitulasi Realisasi Belanja, Pendapatan, dan Pembiayaan 43 SKPD dari Dashboard Terbuka BPKD DKI Jakarta.',
            'Peraturan Daerah Provinsi DKI Jakarta tentang Perubahan APBD Tahun Anggaran 2025.'
          ]
        },
        {
          id: 'batasan-anti-goals',
          title: 'Batasan & Anti-Goals Platform',
          subtitle: 'Menegaskan posisi platform sebagai fasilitator akuntabilitas publik.',
          content: [
            'JejakPublik BUKAN lembaga penegak hukum, pemeriksa forensik (BPK/KPK), atau platform penuduh korupsi.',
            'Platform ini tidak menarik kesimpulan tendensius atau tuduhan penyelewengan. Sistem menyajikan fakta numerik, perbandingan target vs capaian, dan jejak anomali agar publik dan jurnalis data dapat melakukan telaah objektif.'
          ]
        }
      ]
    };
  }

  static getGuide(): {
    title: string;
    modules: GuideSection[];
  } {
    return {
      title: 'Panduan Penggunaan JejakPublik',
      modules: [
        {
          id: 'mulai-menggunakan',
          step: 1,
          title: 'Mulai Menggunakan JejakPublik',
          summary: 'Navigasi portal dua jalur: eksplorasi terbuka dan pelaporan partisipatif.',
          points: [
            'Jelajahi seluruh data anggaran 43 SKPD tanpa perlu membuat akun atau login.',
            'Gunakan fitur pencarian pada halaman Jelajahi Data untuk menyaring instansi berdasarkan nama, komisi DPRD, atau urusan asisten.',
            'Gunakan akun warga bila ingin mengajukan laporan temuan atau observasi lapangan.'
          ]
        },
        {
          id: 'memahami-status-data',
          step: 2,
          title: 'Memahami 4 Status Baku Data',
          summary: 'Klasifikasi visual integritas angka di setiap tabel.',
          points: [
            'NORMAL (Hijau/Abu netral): Angka terverifikasi cocok antara anggaran dan realisasi.',
            'DIKOREKSI (Kuning): Terdapat salah ketik pada dokumen fisik resmi yang telah dikoreksi dengan catatan audit trail.',
            'DITAHAN (Merah/Oranye): Alokasi anggaran ditangguhkan atau tidak dapat direalisasikan karena refocusing.',
            'TIDAK DILAPORKAN (Strip): Posisi anggaran memang tidak dilaporkan oleh instansi (bernilai NULL murni, bukan angka 0).'
          ]
        },
        {
          id: 'menelusuri-program-kegiatan',
          step: 3,
          title: 'Menelusuri Hirarki Program & Kegiatan',
          summary: 'Membedah anggaran dari tingkat makro hingga mikro pada pilot DLH.',
          points: [
            'Tingkat 1 - Program: 8 program strategis pembangunan lingkungan hidup.',
            'Tingkat 2 - Kegiatan: 15 kegiatan utama turunan dari masing-masing program.',
            'Tingkat 3 - Subkegiatan: 33 rincian belanja operasional dan belanja modal terperinci.'
          ]
        },
        {
          id: 'memahami-apbd-realisasi',
          step: 4,
          title: 'Memahami 3 Pilar APBD & Efisiensi Semantik',
          summary: 'Membaca korelasi antara pagu anggaran, serapan belanja, dan indikator output.',
          points: [
            'APBD terdiri dari 3 pilar: Pendapatan Daerah, Belanja Daerah, dan Pembiayaan Daerah.',
            'Serapan Belanja dihitung dari Realisasi dibagi Pagu APBD Perubahan (APBD-P).',
            'Efisiensi pada tabel kinerja adalah sisa anggaran tidak terserap, bukan berarti pemotongan biaya operasional.'
          ]
        }
      ]
    };
  }
}
