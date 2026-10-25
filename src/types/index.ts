export type NumberState = 'normal' | 'dikoreksi' | 'ditahan';

export interface DataNumberValue {
  value: number | null;
  state: NumberState;
  sourceDoc?: string;
  sourceTable?: string;
  comparisonDoc?: string;
  comparisonTable?: string;
  originalValue?: number | string;
  reason?: string;
}

export interface SkpdItem {
  I_IDINDUK: string;
  NAMA_SKPD: string;
  C_KOMISI: string;
  C_ASISTEN: string;
  PENDAPATAN_ANGGARAN: string | null;
  PENDAPATAN_REALISASI: string | null;
  BELANJA_ANGGARAN: string | null;
  BELANJA_REALISASI: string | null;
  PEMBIAYAAN_ANGGARAN: string | null;
  PEMBIAYAAN_REALISASI: string | null;
}

export interface SubKegiatan {
  sub_kegiatan: string;
  apbdp: number | null;
  realisasi: number | null;
  pct: string | null;
  isHeld?: boolean;
  heldReason?: string;
}

export interface Kegiatan {
  kegiatan: string;
  apbdp: number;
  realisasi: number;
  pct: string;
  sub_kegiatan: SubKegiatan[];
}

export interface ProgramItem {
  program: string;
  apbdp: number;
  realisasi: number;
  pct: string;
  kegiatan: Kegiatan[];
  isCorrected?: boolean;
  originalApbdp?: number;
  correctionReason?: string;
}

export interface DlhIndikatorItem {
  sasaran: string;
  indikator: string;
  target_kinerja: string;
  realisasi_kinerja: string;
  capaian_kinerja: string;
  program: string;
  anggaran_perubahan: number;
  realisasi_anggaran: number;
  capaian_anggaran: string;
  jumlah_efisiensi: number;
  pct_efisiensi: string;
}

export interface DlhUnitKerjaItem {
  unit: string;
  penetapan: number;
  perubahan: number;
  realisasi: number;
  pct: number;
}
