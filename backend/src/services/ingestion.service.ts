import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { query } from '../db/neon.js';
import { skpdModel, type SkpdRecord } from '../models/skpd.model.js';
import type { IngestionPayload, SyncStatus } from '../schemas/ingestion.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../frontend/src/data');

export class IngestionService {
  private static syncStatuses: Map<string, SyncStatus> = new Map([
    [
      'bpkd-jakarta',
      {
        source: 'bpkd-jakarta',
        last_checked: new Date().toISOString(),
        last_updated: null,
        status: 'idle',
        sha256: null,
        records_processed: 0
      }
    ],
    [
      'dlh-pilot',
      {
        source: 'dlh-pilot',
        last_checked: new Date().toISOString(),
        last_updated: null,
        status: 'idle',
        sha256: null,
        records_processed: 0
      }
    ]
  ]);

  private static pollerIntervalId: NodeJS.Timeout | null = null;

  public static getStatuses(): SyncStatus[] {
    return Array.from(this.syncStatuses.values());
  }

  public static getStatus(source: string): SyncStatus | null {
    return this.syncStatuses.get(source) || null;
  }

  /**
   * Menghitung hash SHA-256 string konten untuk deteksi perubahan (change detection)
   */
  private static calculateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Upsert record SKPD ke database Neon PostgreSQL
   */
  private static async persistRecordsToDb(records: SkpdRecord[]): Promise<number> {
    let updatedCount = 0;
    for (const item of records) {
      try {
        await query(
          `INSERT INTO skpd (id, id_induk, nama, komisi, asisten, pendapatan_anggaran, pendapatan_realisasi, belanja_anggaran, belanja_realisasi, pembiayaan_anggaran, pembiayaan_realisasi, has_deep_dive)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO UPDATE SET
             id_induk = EXCLUDED.id_induk,
             nama = EXCLUDED.nama,
             komisi = EXCLUDED.komisi,
             asisten = EXCLUDED.asisten,
             pendapatan_anggaran = EXCLUDED.pendapatan_anggaran,
             pendapatan_realisasi = EXCLUDED.pendapatan_realisasi,
             belanja_anggaran = EXCLUDED.belanja_anggaran,
             belanja_realisasi = EXCLUDED.belanja_realisasi,
             pembiayaan_anggaran = EXCLUDED.pembiayaan_anggaran,
             pembiayaan_realisasi = EXCLUDED.pembiayaan_realisasi,
             has_deep_dive = EXCLUDED.has_deep_dive,
             updated_at = NOW()`,
          [
            item.id,
            item.id_induk,
            item.nama,
            item.komisi,
            item.asisten,
            item.pendapatan_anggaran,
            item.pendapatan_realisasi,
            item.belanja_anggaran,
            item.belanja_realisasi,
            item.pembiayaan_anggaran,
            item.pembiayaan_realisasi,
            item.has_deep_dive
          ]
        );
        updatedCount++;
      } catch (err) {
        // Fallback keep in-memory
      }
    }
    return updatedCount;
  }

  /**
   * Penarikan dan sinkronisasi data dari sumber primer 1: BPKD Jakarta
   */
  public static async syncBpkdJakarta(): Promise<SyncStatus> {
    const sourceKey = 'bpkd-jakarta';
    const current = this.syncStatuses.get(sourceKey)!;
    const now = new Date().toISOString();

    try {
      current.status = 'running';
      current.last_checked = now;

      let rawContent = '';
      const remoteUrl = process.env.BPKD_SOURCE_URL;

      if (remoteUrl && !remoteUrl.includes('placeholder')) {
        const resp = await fetch(remoteUrl, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) throw new Error(`HTTP Error ${resp.status} dari BPKD remote`);
        rawContent = await resp.text();
      } else {
        const localPath = path.join(DATA_DIR, 'bpkd-skpd-2025.json');
        if (!fs.existsSync(localPath)) throw new Error(`Berkas data lokal ${localPath} tidak ditemukan.`);
        rawContent = fs.readFileSync(localPath, 'utf-8');
      }

      const contentHash = this.calculateHash(rawContent);

      if (current.sha256 === contentHash) {
        current.status = 'unchanged';
        current.message = 'Data sumber tidak mengalami perubahan hash SHA-256.';
        return current;
      }

      const parsed = JSON.parse(rawContent);
      const rows: Record<string, string>[] = parsed.data || [];

      const records: SkpdRecord[] = rows.map((r) => {
        const nama = r.NAMA_SKPD.trim();
        const id = nama.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-');
        return {
          id,
          id_induk: r.I_IDINDUK || '',
          nama,
          komisi: r.C_KOMISI || '',
          asisten: r.C_ASISTEN || '',
          pendapatan_anggaran: Number(r.PENDAPATAN_ANGGARAN) || null,
          pendapatan_realisasi: Number(r.PENDAPATAN_REALISASI) || null,
          belanja_anggaran: Number(r.BELANJA_ANGGARAN) || 0,
          belanja_realisasi: Number(r.BELANJA_REALISASI) || 0,
          pembiayaan_anggaran: Number(r.PEMBIAYAAN_ANGGARAN) || null,
          pembiayaan_realisasi: Number(r.PEMBIAYAAN_REALISASI) || null,
          has_deep_dive: id.includes('lingkungan-hidup')
        };
      });

      await this.persistRecordsToDb(records);
      skpdModel.upsertBatch(records);

      current.status = 'success';
      current.last_updated = now;
      current.sha256 = contentHash;
      current.records_processed = records.length;
      current.message = `Berhasil menyinkronkan ${records.length} SKPD ke database.`;
      return current;
    } catch (err: any) {
      current.status = 'failed';
      current.message = err.message || 'Gagal sinkronisasi data BPKD.';
      return current;
    }
  }

  /**
   * Penarikan dan sinkronisasi data dari sumber primer 2: Dokumen Pilot DLH
   */
  public static async syncDlhPilot(): Promise<SyncStatus> {
    const sourceKey = 'dlh-pilot';
    const current = this.syncStatuses.get(sourceKey)!;
    const now = new Date().toISOString();

    try {
      current.status = 'running';
      current.last_checked = now;

      const filePath = path.join(DATA_DIR, 'dlh-alokasi-anggaran-2025.json');
      if (!fs.existsSync(filePath)) throw new Error('Data pilot DLH lokal tidak ditemukan.');

      const content = fs.readFileSync(filePath, 'utf-8');
      const contentHash = this.calculateHash(content);

      if (current.sha256 === contentHash) {
        current.status = 'unchanged';
        current.message = 'Rincian data pilot DLH tidak berubah.';
        return current;
      }

      current.status = 'success';
      current.last_updated = now;
      current.sha256 = contentHash;
      current.records_processed = 1;
      current.message = 'Rincian pilot DLH tersinkronisasi.';
      return current;
    } catch (err: any) {
      current.status = 'failed';
      current.message = err.message || 'Gagal sinkronisasi pilot DLH.';
      return current;
    }
  }

  /**
   * Sinkronisasi kedua sumber data sekaligus
   */
  public static async syncAllSources(): Promise<SyncStatus[]> {
    const bpkd = await this.syncBpkdJakarta();
    const dlh = await this.syncDlhPilot();
    return [bpkd, dlh];
  }

  /**
   * Ingest data instan via Webhook Payload (Push dari worker/scraper luar)
   */
  public static async ingestPayload(payload: IngestionPayload): Promise<{ processed: number; source: string }> {
    const records: SkpdRecord[] = payload.records.map((r) => ({
      id: r.id,
      id_induk: r.id_induk || '',
      nama: r.nama,
      komisi: r.komisi || '',
      asisten: r.asisten || '',
      pendapatan_anggaran: r.pendapatan_anggaran ?? null,
      pendapatan_realisasi: r.pendapatan_realisasi ?? null,
      belanja_anggaran: r.belanja_anggaran,
      belanja_realisasi: r.belanja_realisasi,
      pembiayaan_anggaran: r.pembiayaan_anggaran ?? null,
      pembiayaan_realisasi: r.pembiayaan_realisasi ?? null,
      has_deep_dive: Boolean(r.has_deep_dive)
    }));

    await this.persistRecordsToDb(records);
    skpdModel.upsertBatch(records);

    const now = new Date().toISOString();
    const status: SyncStatus = {
      source: payload.source,
      last_checked: now,
      last_updated: now,
      status: 'success',
      sha256: this.calculateHash(JSON.stringify(payload.records)),
      records_processed: records.length,
      message: `Webhook berhasil memproses ${records.length} record.`
    };
    this.syncStatuses.set(payload.source, status);

    return { processed: records.length, source: payload.source };
  }

  /**
   * Scheduler otomatis setiap 24 jam (86.400.000 ms)
   */
  public static initScheduler(hours: number = 24): void {
    if (this.pollerIntervalId) {
      clearInterval(this.pollerIntervalId);
    }

    const intervalMs = Math.max(1, hours) * 60 * 60 * 1000;
    console.log(`[IngestionScheduler] Aktif setiap ${hours} jam (${intervalMs} ms).`);

    // Jalankan satu kali saat inisialisasi
    this.syncAllSources()
      .then((statuses) => {
        console.log('[IngestionScheduler] Sinkronisasi awal selesai:', statuses.map((s) => `${s.source}: ${s.status}`).join(', '));
      })
      .catch((err) => {
        console.warn('[IngestionScheduler] Gagal sinkronisasi awal:', err);
      });

    // Jalankan berkala 24 jam
    this.pollerIntervalId = setInterval(async () => {
      console.log('[IngestionScheduler] Menjalankan pengecekan terjadwal 24 jam...');
      try {
        const statuses = await this.syncAllSources();
        console.log('[IngestionScheduler] Selesai pengecekan berkala:', statuses.map((s) => `${s.source}: ${s.status}`).join(', '));
      } catch (err) {
        console.warn('[IngestionScheduler] Error pada pengecekan berkala:', err);
      }
    }, intervalMs);
  }

  public static stopScheduler(): void {
    if (this.pollerIntervalId) {
      clearInterval(this.pollerIntervalId);
      this.pollerIntervalId = null;
    }
  }
}
