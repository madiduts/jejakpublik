import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lokasi berkas data frontend terverifikasi
const DATA_DIR = path.resolve(__dirname, '../../../frontend/src/data');

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

export function loadAndTransformSkpd(): SkpdRecord[] {
  const filePath = path.join(DATA_DIR, 'bpkd-skpd-2025.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Berkas tidak ditemukan: ${filePath}`);
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const rows: Record<string, string>[] = raw.data || [];

  return rows.map((r) => {
    const nama = r.NAMA_SKPD.trim();
    const id = slugify(nama);
    const hasDeepDive = id.includes('lingkungan-hidup');

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
      has_deep_dive: hasDeepDive,
    };
  });
}

// Uji coba langsung via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Memulai ekstraksi dan transformasi dataset SKPD...');
  const results = loadAndTransformSkpd();
  console.log(`Berhasil mentransformasi ${results.length} SKPD.`);

  const dlh = results.find((s) => s.has_deep_dive);
  console.log('\nSampel Instansi Lapis Dalam (DLH):', dlh);

  const totalBelanja = results.reduce((acc, curr) => acc + curr.belanja_anggaran, 0);
  console.log(`\nTotal Belanja 43 SKPD: Rp${totalBelanja.toLocaleString('id-ID')}`);
}
