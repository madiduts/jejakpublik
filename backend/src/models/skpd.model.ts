import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SkpdQueryParams } from '../schemas/skpd.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../frontend/src/data');

export interface SkpdRecord {
  id: string;
  id_induk: string;
  nama: string;
  komisi: string;
  asisten: string;
  pendapatan_anggaran: number | null;
  pendapatan_realisasi: number | null;
  belanja_anggaran: number;
  belanja_realisasi: number;
  pembiayaan_anggaran: number | null;
  pembiayaan_realisasi: number | null;
  has_deep_dive: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

function parseBigIntOrNull(val: unknown): number | null {
  if (val === null || val === undefined || val === '' || val === 'null') {
    return null;
  }
  const parsed = Number(val);
  return Number.isNaN(parsed) ? null : parsed;
}

class SkpdModel {
  private cache: SkpdRecord[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    try {
      const filePath = path.join(DATA_DIR, 'bpkd-skpd-2025.json');
      if (fs.existsSync(filePath)) {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const rows: Record<string, string>[] = raw.data || [];

        this.cache = rows.map((r) => {
          const nama = r.NAMA_SKPD.trim();
          const id = slugify(nama);
          return {
            id,
            id_induk: r.I_IDINDUK,
            nama,
            komisi: r.C_KOMISI,
            asisten: r.C_ASISTEN,
            pendapatan_anggaran: parseBigIntOrNull(r.PENDAPATAN_ANGGARAN),
            pendapatan_realisasi: parseBigIntOrNull(r.PENDAPATAN_REALISASI),
            belanja_anggaran: Number(r.BELANJA_ANGGARAN) || 0,
            belanja_realisasi: Number(r.BELANJA_REALISASI) || 0,
            pembiayaan_anggaran: parseBigIntOrNull(r.PEMBIAYAAN_ANGGARAN),
            pembiayaan_realisasi: parseBigIntOrNull(r.PEMBIAYAAN_REALISASI),
            has_deep_dive: id.includes('lingkungan-hidup'),
          };
        });
      }
    } catch (err) {
      console.warn('SkpdModel: Gagal memuat data sumber:', err);
    }
  }

  public count(): number {
    return this.cache.length;
  }

  public findMany(params: SkpdQueryParams): { total: number; data: SkpdRecord[] } {
    let result = this.cache;

    if (params.q) {
      const q = params.q.toLowerCase();
      result = result.filter((s) => s.nama.toLowerCase().includes(q));
    }

    if (params.komisi) {
      result = result.filter((s) => s.komisi === params.komisi);
    }

    const total = result.length;
    const startIndex = (params.page - 1) * params.limit;
    const paginated = result.slice(startIndex, startIndex + params.limit);

    return { total, data: paginated };
  }

  public findById(id: string): SkpdRecord | null {
    return this.cache.find((s) => s.id === id) || null;
  }

  public getDeepDiveDetails(): Record<string, unknown> | null {
    try {
      const alokasiPath = path.join(DATA_DIR, 'dlh-alokasi-anggaran-2025.json');
      const realisasiPath = path.join(DATA_DIR, 'dlh-realisasi-anggaran-2025.json');
      const efisiensiPath = path.join(DATA_DIR, 'dlh-efisiensi-indikator-2025.json');
      const unitKerjaPath = path.join(DATA_DIR, 'dlh-unit-kerja-2025.json');

      const alokasi = fs.existsSync(alokasiPath) ? JSON.parse(fs.readFileSync(alokasiPath, 'utf-8')) : null;
      const realisasi = fs.existsSync(realisasiPath) ? JSON.parse(fs.readFileSync(realisasiPath, 'utf-8')) : null;
      const efisiensi = fs.existsSync(efisiensiPath) ? JSON.parse(fs.readFileSync(efisiensiPath, 'utf-8')) : null;
      const unitKerja = fs.existsSync(unitKerjaPath) ? JSON.parse(fs.readFileSync(unitKerjaPath, 'utf-8')) : null;

      return {
        legal_basis: 'LKIP Dinas Lingkungan Hidup Provinsi DKI Jakarta TA 2025',
        sumber_dokumen: [
          'Tabel 2.4 Alokasi Anggaran Menurut Program dan Kegiatan',
          'Tabel 3.33 Anggaran Berdasarkan Unit Kerja',
          'Tabel 3.34 Realisasi Program dan Kegiatan',
          'Tabel 3.35 Efisiensi Realisasi Anggaran Terhadap Capaian Indikator Kinerja'
        ],
        audit_trail: [
          {
            tabel: 'Tabel 3.33',
            isu: 'Salah ketik nilai realisasi Sudin LH Kepulauan Seribu (tercetak 13.5294.891.173)',
            koreksi: '135.294.891.173',
            metode: 'Uji matematis persentase serapan 97,99% terhadap pagu perubahan Rp138.070.730.822',
            state: 'DIKOREKSI'
          },
          {
            tabel: 'Tabel 2.4 vs Realisasi',
            isu: 'Realisasi Program Pengendalian B3 selisih antara dokumen paparan awal dan buku besar',
            koreksi: 'Pagu Perubahan Rp3.684.567.176, Realisasi Rp2.853.052.415 (Serapan 77,43%)',
            metode: 'Rekonsiliasi angka resmi LKIP DLH Tabel 3.35',
            state: 'DIKOREKSI'
          }
        ],
        hirarki_anggaran: alokasi,
        realisasi_anggaran: realisasi,
        indikator_kinerja: efisiensi,
        unit_kerja: unitKerja
      };
    } catch (err) {
      console.warn('SkpdModel: Gagal membaca rincian DLH:', err);
    }
    return null;
  }

  public getSummary() {
    let totalBelanjaAnggaran = 0;
    let totalBelanjaRealisasi = 0;
    let totalPendapatanAnggaran = 0;
    let totalPendapatanRealisasi = 0;

    for (const item of this.cache) {
      totalBelanjaAnggaran += Number(item.belanja_anggaran || 0);
      totalBelanjaRealisasi += Number(item.belanja_realisasi || 0);
      totalPendapatanAnggaran += Number(item.pendapatan_anggaran || 0);
      totalPendapatanRealisasi += Number(item.pendapatan_realisasi || 0);
    }

    const persentaseSerapanBelanja =
      totalBelanjaAnggaran > 0
        ? Number(((totalBelanjaRealisasi / totalBelanjaAnggaran) * 100).toFixed(2))
        : 0;

    return {
      total_skpd: this.cache.length,
      belanja: {
        anggaran: totalBelanjaAnggaran,
        realisasi: totalBelanjaRealisasi,
        persentase_serapan: persentaseSerapanBelanja,
      },
      pendapatan: {
        anggaran: totalPendapatanAnggaran,
        realisasi: totalPendapatanRealisasi,
      },
    };
  }
}

export const skpdModel = new SkpdModel();
