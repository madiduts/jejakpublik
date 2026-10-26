/**
 * Kontrak Data Resmi JejakPublik (WIA 2026)
 * Semua agent wajib mematuhi tipe data ini tanpa melonggarkan tipe null menjadi number fallback.
 */

export type DataNumberState = "normal" | "dikoreksi" | "ditahan";

export interface AuditRecord {
  title: string;
  sourceDoc: string;
  sourceTable: string;
  printedValue: string;
  verifiedValue: string;
  verificationSource: string;
  reconciliationMethod: string;
}

export interface DataNumberValue {
  value: number | null; // NULL WAJIB DIPERTAHANKAN jika berstatus ditahan
  state: DataNumberState;
  audit?: AuditRecord;
}

export interface SkpdRecord {
  idInduk: string;
  namaSkpd: string;
  komisiDprd: string;
  asistenSekda: string;
  pendapatanAnggaran: number | null;
  pendapatanRealisasi: number | null;
  belanjaAnggaran: number;
  belanjaRealisasi: number;
  pembiayaanAnggaran: number | null; // null jika instansi tidak memiliki pos pembiayaan
  pembiayaanRealisasi: number | null;
  hasDetailedData: boolean; // true HANYA untuk Dinas Lingkungan Hidup
}

export interface SubKegiatanContract {
  kode: string;
  nama: string;
  apbdp: number | null; // null jika berstatus 'ditahan'
  realisasi: number | null; // null jika berstatus 'ditahan'
  pctSerapan: string | null;
  state: DataNumberState;
  heldReason?: string;
}

export interface KegiatanContract {
  kode: string;
  nama: string;
  apbdp: number;
  realisasi: number;
  pctSerapan: string;
  subKegiatan: SubKegiatanContract[];
}

export interface ProgramContract {
  nama: string;
  apbdp: number;
  realisasi: number;
  pctSerapan: string;
  state: DataNumberState;
  kegiatan: KegiatanContract[];
  audit?: AuditRecord;
}

export interface IndikatorKinerjaContract {
  sasaranStrategis: string;
  indikatorKinerja: string;
  targetKinerja: string;
  realisasiKinerja: string;
  capaianKinerjaPct: string;
  programPendukung: string;
  anggaranPerubahan: number;
  realisasiAnggaran: number;
  capaianAnggaranPct: string;
  sisaAnggaranEfisiensi: number; // Sisa anggaran yang tidak terserap
  pctEfisiensi: string;
}

export interface UnitKerjaContract {
  namaUnit: string;
  apbdPenetapan: number;
  apbdPerubahan: number;
  realisasiBelanja: number;
  pctSerapan: number;
}
