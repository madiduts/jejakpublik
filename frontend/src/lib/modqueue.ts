import { listReports, Report } from './reports';

export interface ModQueueItem {
  id: string;
  title: string;
  context: string;
  date: string;
  status: 'Baru' | 'Perlu informasi' | 'Siap terbit' | 'Terbit' | 'Ditolak';
  category: 'perlu_periksa' | 'terbit' | 'ditolak' | 'perlu_info';
}

/** Contoh antrean bawaan agar ruang moderator tidak kosong saat demo. */
export const DEFAULT_MOD_QUEUE: ModQueueItem[] = [
  {
    id: 'L-2026-0031',
    title: 'Koreksi nominal B3',
    context: 'Koreksi informasi · Program Pengendalian B3',
    date: '8 Nov 2026',
    status: 'Baru',
    category: 'perlu_periksa'
  },
  {
    id: 'L-2026-0030',
    title: 'Angka realisasi Bina Marga',
    context: 'Koreksi informasi · Halaman instansi',
    date: '7 Nov 2026',
    status: 'Baru',
    category: 'perlu_periksa'
  },
  {
    id: 'L-2026-0027',
    title: 'Trotoar Jalan Sabang rusak',
    context: 'Observasi lapangan · Jakarta Pusat',
    date: '2 Nov 2026',
    status: 'Perlu informasi',
    category: 'perlu_info'
  },
  {
    id: 'L-2026-0024',
    title: 'Istilah efisiensi',
    context: 'Koreksi informasi · Glosarium',
    date: '29 Okt 2026',
    status: 'Siap terbit',
    category: 'perlu_periksa'
  },
  {
    id: 'L-2026-0018',
    title: 'Sisa anggaran operasional DLH',
    context: 'Koreksi informasi · Rekapitulasi belanja',
    date: '25 Okt 2026',
    status: 'Terbit',
    category: 'terbit'
  },
  {
    id: 'L-2026-0012',
    title: 'Klaim pemborosan dana fiktif',
    context: 'Observasi lapangan · Penafsiran keliru',
    date: '18 Okt 2026',
    status: 'Ditolak',
    category: 'ditolak'
  }
];

/** Laporan dari pelapor dipetakan ke bentuk antrean yang sama. */
const toModQueueItems = (reports: Report[]): ModQueueItem[] =>
  reports.map((r) => {
    let status: ModQueueItem['status'] = 'Baru';
    let category: ModQueueItem['category'] = 'perlu_periksa';

    if (r.status === 'diperiksa') {
      status = 'Perlu informasi';
      category = 'perlu_info';
    } else if (r.status === 'diterima') {
      status = 'Terbit';
      category = 'terbit';
    } else if (r.status === 'ditolak') {
      status = 'Ditolak';
      category = 'ditolak';
    }

    return {
      id: r.id,
      title: r.title || r.target,
      context: `${r.kind === 'koreksi' ? 'Koreksi informasi' : 'Observasi lapangan'} · ${r.instansi}`,
      date: new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status,
      category
    };
  });

/** Antrean penuh: laporan pelapor dulu, contoh bawaan hanya bila tiketnya belum ada. */
export const buildQueue = (reports: Report[]): ModQueueItem[] => {
  const dariPelapor = toModQueueItems(reports);
  const sudahAda = new Set(dariPelapor.map((i) => i.id));
  return [...dariPelapor, ...DEFAULT_MOD_QUEUE.filter((i) => !sudahAda.has(i.id))];
};

/** Jumlah yang sama dengan tab "Perlu diperiksa" di antrean moderator. */
export const countPerluPeriksa = (): number =>
  buildQueue(listReports()).filter((i) => i.category === 'perlu_periksa').length;
