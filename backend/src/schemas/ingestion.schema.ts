import { z } from 'zod';

export const ingestionPayloadSchema = z.object({
  source: z.string().trim().min(1, 'Sumber data wajib diisi.'),
  batch_id: z.string().trim().optional(),
  timestamp: z.string().datetime().optional(),
  records: z.array(
    z.object({
      id: z.string().trim().min(1),
      id_induk: z.string().trim().optional().default(''),
      nama: z.string().trim().min(1),
      komisi: z.string().trim().optional().default(''),
      asisten: z.string().trim().optional().default(''),
      pendapatan_anggaran: z.number().nullable().optional(),
      pendapatan_realisasi: z.number().nullable().optional(),
      belanja_anggaran: z.number(),
      belanja_realisasi: z.number(),
      pembiayaan_anggaran: z.number().nullable().optional(),
      pembiayaan_realisasi: z.number().nullable().optional(),
      has_deep_dive: z.boolean().optional().default(false)
    })
  ).min(1, 'Daftar record minimal berisi 1 data.')
});

export type IngestionPayload = z.infer<typeof ingestionPayloadSchema>;

export interface SyncStatus {
  source: string;
  last_checked: string;
  last_updated: string | null;
  status: 'idle' | 'running' | 'success' | 'failed' | 'unchanged';
  sha256: string | null;
  records_processed: number;
  message?: string;
}
