import type { Context } from 'hono';
import { IngestionService } from '../services/ingestion.service.js';
import { ingestionPayloadSchema } from '../schemas/ingestion.schema.js';
import { AppError } from '../utils/errors.js';
import { successResponse } from '../utils/responses.js';

export class IngestionController {
  private static verifySecret(c: Context): void {
    const expectedSecret = process.env.WEBHOOK_INGESTION_SECRET || 'jejakpublik-ingestion-secret-key-2026';
    const providedSecret = c.req.header('X-Webhook-Secret') || c.req.query('secret');

    if (!providedSecret || providedSecret !== expectedSecret) {
      throw new AppError('UNAUTHORIZED' as any, 'Otorisasi ditolak. Header X-Webhook-Secret tidak valid.', 401);
    }
  }

  /**
   * Status sinkronisasi & checksum dari kedua sumber data
   */
  static async getStatus(c: Context) {
    const statuses = IngestionService.getStatuses();
    return c.json(
      successResponse({
        sources: statuses,
        scheduler_interval: '24 jam'
      })
    );
  }

  /**
   * Trigger sinkronisasi data manual (Pull 2 sumber: BPKD & DLH)
   */
  static async triggerSync(c: Context) {
    IngestionController.verifySecret(c);
    const results = await IngestionService.syncAllSources();

    return c.json(
      successResponse(results, 'Pengecekan dan sinkronisasi 2 sumber data selesai dijalankan.')
    );
  }

  /**
   * Receiver Webhook Eksternal (Push payload dari scraper/bot luar)
   */
  static async handleWebhook(c: Context) {
    IngestionController.verifySecret(c);
    const body = await c.req.json();
    const validated = ingestionPayloadSchema.parse(body);

    const result = await IngestionService.ingestPayload(validated);

    return c.json(
      successResponse(result, `Data pembaruan dari ${result.source} berhasil diterima dan disinkronkan.`),
      200
    );
  }
}
