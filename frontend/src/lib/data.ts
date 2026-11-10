import skpdRaw from '../data/bpkd-skpd-2025.json';
import realisasiRaw from '../data/dlh-realisasi-anggaran-2025.json';
import unitRaw from '../data/dlh-unit-kerja-2025.json';
import indikatorRaw from '../data/dlh-efisiensi-indikator-2025.json';

export const slugify = (s: string): string =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const num = (v: unknown): number => {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

interface SkpdRow {
  I_IDINDUK: string; NAMA_SKPD: string; C_KOMISI: string; C_ASISTEN: string;
  PENDAPATAN_ANGGARAN: string | null; PENDAPATAN_REALISASI: string | null;
  BELANJA_ANGGARAN: string | null; BELANJA_REALISASI: string | null;
  PEMBIAYAAN_ANGGARAN: string | null; PEMBIAYAAN_REALISASI: string | null;
}

export interface Instansi {
  id: string; nama: string; slug: string; komisi: string; asisten: string;
  pendapatan: number; pendapatanRealisasi: number;
  belanja: number; belanjaRealisasi: number;
  pembiayaan: number | null; pembiayaanRealisasi: number | null;
  detailed: boolean;
}

const DETAILED = 'DINAS LINGKUNGAN HIDUP';

export const instansiList: Instansi[] = (skpdRaw as { data: SkpdRow[] }).data.map((r) => ({
  id: r.I_IDINDUK,
  nama: r.NAMA_SKPD.replace(/\s+/g, ' ').trim(),
  slug: slugify(r.NAMA_SKPD),
  komisi: r.C_KOMISI,
  asisten: r.C_ASISTEN,
  pendapatan: num(r.PENDAPATAN_ANGGARAN),
  pendapatanRealisasi: num(r.PENDAPATAN_REALISASI),
  belanja: num(r.BELANJA_ANGGARAN),
  belanjaRealisasi: num(r.BELANJA_REALISASI),
  pembiayaan: r.PEMBIAYAAN_ANGGARAN === null ? null : num(r.PEMBIAYAAN_ANGGARAN),
  pembiayaanRealisasi: r.PEMBIAYAAN_REALISASI === null ? null : num(r.PEMBIAYAAN_REALISASI),
  detailed: r.NAMA_SKPD.replace(/\s+/g, ' ').trim().toUpperCase() === DETAILED,
}));

export const totals = {
  instansi: instansiList.length,
  belanja: instansiList.reduce((a, b) => a + b.belanja, 0),
  belanjaRealisasi: instansiList.reduce((a, b) => a + b.belanjaRealisasi, 0),
  pendapatan: instansiList.reduce((a, b) => a + b.pendapatan, 0),
  pendapatanRealisasi: instansiList.reduce((a, b) => a + b.pendapatanRealisasi, 0),
};

export const getInstansi = (slug: string): Instansi | undefined =>
  instansiList.find((i) => i.slug === slug);

interface RawSub { sub_kegiatan: string; apbdp: number | null; realisasi: number | null; pct: string | null }
interface RawKeg { kegiatan: string; apbdp: number | null; realisasi: number | null; pct: string | null; sub_kegiatan: RawSub[] }
interface RawProg { program: string; apbdp: number | null; realisasi: number | null; pct: string | null; kegiatan: RawKeg[] }

export interface SubKeg { nama: string; apbdp: number | null; realisasi: number | null; pct: string | null }
export interface Keg { nama: string; apbdp: number | null; realisasi: number | null; pct: string | null; subs: SubKeg[] }
export interface Program {
  slug: string; nama: string; apbdp: number | null; realisasi: number | null; pct: string | null; kegs: Keg[];
}

const realisasi = realisasiRaw as { sumber: string; catatan_konflik: string[]; program: RawProg[] };

export const dlhSource = realisasi.sumber;
export const dlhConflicts = realisasi.catatan_konflik;

export const programList: Program[] = realisasi.program.map((p) => ({
  slug: slugify(p.program),
  nama: p.program,
  apbdp: p.apbdp,
  realisasi: p.realisasi,
  pct: p.pct,
  kegs: p.kegiatan.map((k) => ({
    nama: k.kegiatan, apbdp: k.apbdp, realisasi: k.realisasi, pct: k.pct,
    subs: k.sub_kegiatan.map((s) => ({ nama: s.sub_kegiatan, apbdp: s.apbdp, realisasi: s.realisasi, pct: s.pct })),
  })),
}));

export const getProgram = (slug: string): Program | undefined => programList.find((p) => p.slug === slug);

export const programTotals = {
  apbdp: programList.reduce((a, b) => a + (b.apbdp ?? 0), 0),
  realisasi: programList.reduce((a, b) => a + (b.realisasi ?? 0), 0),
  kegiatan: programList.reduce((a, b) => a + b.kegs.length, 0),
  subKegiatan: programList.reduce((a, b) => a + b.kegs.reduce((c, d) => c + d.subs.length, 0), 0),
};

export interface UnitKerja { nama: string; penetapan: number; perubahan: number; realisasi: number; pct: number }
type RawUnit = { unit: string; penetapan: number; perubahan: number; realisasi: number; pct: number };
export const unitKerja: UnitKerja[] = (unitRaw as { unit: RawUnit[] }).unit.map((u) => ({
  nama: u.unit, penetapan: u.penetapan, perubahan: u.perubahan, realisasi: u.realisasi, pct: u.pct,
}));
export const unitTotal = (unitRaw as { jumlah: { penetapan: number; perubahan: number; realisasi: number; pct: number } }).jumlah;

export interface Indikator {
  sasaran: string; indikator: string; target: string; realisasiKinerja: string; capaian: string;
  program: string; anggaran: number; realisasi: number; capaianAnggaran: string;
  efisiensi: number; pctEfisiensi: string;
}
export const indikator: Indikator[] = (indikatorRaw as { baris: Array<Record<string, string | number>> }).baris.map((r) => ({
  sasaran: String(r.sasaran), indikator: String(r.indikator), target: String(r.target_kinerja),
  realisasiKinerja: String(r.realisasi_kinerja), capaian: String(r.capaian_kinerja), program: String(r.program),
  anggaran: Number(r.anggaran_perubahan), realisasi: Number(r.realisasi_anggaran),
  capaianAnggaran: String(r.capaian_anggaran), efisiensi: Number(r.jumlah_efisiensi), pctEfisiensi: String(r.pct_efisiensi),
}));

export interface Correction {
  id: string; programSlug: string; title: string; state: 'dikoreksi' | 'ditahan';
  printed: { label: string; value: number };
  verified: { label: string; value: number };
  comparator?: { label: string; value: number };
  formula?: { a: number; b: number; result: number };
  note: string; doc: string;
}

const b3 = programList.find((p) => p.nama.includes('BAHAN BERBAHAYA'));

export const corrections: Correction[] = [
  {
    id: 'b3-pagu',
    programSlug: b3?.slug ?? '',
    title: 'Mengapa angka program ini dikoreksi',
    state: 'dikoreksi',
    printed: { label: 'Tabel 2.4, halaman 26', value: 67876101084 },
    verified: { label: 'Tabel 3.34, halaman 96', value: 3684567176 },
    comparator: { label: 'Dashboard Keuangan BPKD, total', value: 3719846734770 },
    formula: { a: 67876101084, b: 64191533908, result: 3684567176 },
    note: 'Nilai 67.876.101.084 pada Tabel 2.4 adalah salinan dari program sebelumnya. Setelah dikurangkan dari total, sisanya 3.684.567.176 - sama dengan Tabel 3.34 dan cocok dengan total BPKD.',
    doc: 'LKIP Dinas Lingkungan Hidup Jakarta 2025',
  },
  {
    id: 'adm-keuangan',
    programSlug: programList[0]?.slug ?? '',
    title: 'Sub kegiatan tidak berjumlah sama dengan induknya',
    state: 'ditahan',
    printed: { label: 'Jumlah sub kegiatan', value: 245364844643 },
    verified: { label: 'Angka induk kegiatan', value: 245226684643 },
    formula: { a: 245364844643, b: 245226684643, result: 138160000 },
    note: 'Selisih 138.160.000 tidak dapat dijelaskan dari dokumen yang ada. Kami tidak menyembunyikannya dengan menyamakan angka; nilainya ditahan sampai dokumen pendukung ditemukan.',
    doc: 'LKIP Dinas Lingkungan Hidup Jakarta 2025, Tabel 3.33',
  },
];

export const getCorrection = (id: string): Correction | undefined => corrections.find((c) => c.id === id);

const humanize = (s: string): string => {
  const t = s.replace(/^PROGRAM\s+/i, '').toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const programBars = programList
  .filter((p) => p.apbdp !== null)
  .map((p) => ({ label: humanize(p.nama), value: p.apbdp ?? 0, slug: p.slug, pct: p.pct }))
  .sort((a, b) => b.value - a.value);
