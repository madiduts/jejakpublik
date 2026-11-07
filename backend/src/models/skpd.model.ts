import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

export interface SkpdQueryParams {
  q?: string;
  komisi?: string;
  page: number;
  limit: number;
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
      if (fs.existsSync(alokasiPath)) {
        return JSON.parse(fs.readFileSync(alokasiPath, 'utf-8'));
      }
    } catch (err) {
      console.warn('SkpdModel: Gagal membaca rincian DLH:', err);
    }
    return null;
  }
}

export const skpdModel = new SkpdModel();
