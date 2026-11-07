import type { Context } from 'hono';
import { isDbConfigured, sql } from '../db/neon.js';
import { skpdModel } from '../models/skpd.model.js';

export class SkpdController {
  public static async getHealth(c: Context) {
    let dbStatus = 'disconnected';
    let dbLatencyMs: number | null = null;

    if (isDbConfigured && sql) {
      try {
        const start = Date.now();
        await sql`SELECT 1 as ping`;
        dbLatencyMs = Date.now() - start;
        dbStatus = 'connected';
      } catch (err) {
        dbStatus = `error: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    return c.json({
      status: 'ok',
      name: 'JejakPublik Backend API',
      architecture: 'Model-Controller-Route (MCR)',
      neon: {
        configured: isDbConfigured,
        status: dbStatus,
        latency_ms: dbLatencyMs,
        branch: process.env.NEON_BRANCH || null,
        function_host_suffix: process.env.NEON_FUNCTION_HOST_SUFFIX || null,
        realtime_configured: Boolean(process.env.NEON_REALTIME_URL),
      },
      cachedSkpdCount: skpdModel.count(),
      message: 'Backend Hono aktif dan terhubung ke ekosistem Neon.',
    });
  }

  public static async getAll(c: Context) {
    const q = c.req.query('q');
    const komisi = c.req.query('komisi');
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;

    const { total, data } = skpdModel.findMany({ q, komisi, page, limit });

    return c.json({
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        snapshot_date: '2026-10-21',
        source: 'Dashboard BPKD DKI Jakarta 2025',
      },
      data,
    });
  }

  public static async getById(c: Context) {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Parameter ID wajib disertakan' }, 400);
    }

    const skpd = skpdModel.findById(id);

    if (!skpd) {
      return c.json({ error: 'Instansi tidak ditemukan' }, 404);
    }

    if (skpd.has_deep_dive) {
      const deepDive = skpdModel.getDeepDiveDetails();
      return c.json({
        meta: {
          type: 'deep_dive',
          legal_basis: 'LKIP Dinas Lingkungan Hidup TA 2025',
        },
        instansi: skpd,
        pilot_details: deepDive,
      });
    }

    return c.json({
      meta: {
        type: 'summary_only',
        note: 'Rincian kegiatan hanya tersedia pada tingkat SKPD',
      },
      instansi: skpd,
    });
  }
}
