import type { Context } from 'hono';
import { ReportModel, type ReportStatus } from '../models/report.model.js';

export class ModerationController {
  /**
   * Antrean laporan yang belum diperiksa (status: pending)
   */
  static async getQueue(c: Context) {
    const reports = await ReportModel.findAll({ status: 'pending' });
    return c.json({
      success: true,
      stage: 'Antrean Pemeriksaan Laporan Masuk',
      total_pending: reports.length,
      data: reports
    });
  }

  /**
   * Pemeriksaan detail laporan dan bukti dokumen
   */
  static async getReportDetail(c: Context) {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'ID laporan wajib disertakan.' }, 400);
    }

    const report = await ReportModel.findById(id);
    if (!report) {
      return c.json({ success: false, error: 'Laporan tidak ditemukan.' }, 404);
    }

    return c.json({
      success: true,
      stage: 'Pemeriksaan Laporan dan Bukti Lapangan',
      data: report
    });
  }

  /**
   * Tanggapan dan keputusan verifikator
   */
  static async submitDecision(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID laporan wajib disertakan.' }, 400);
      }

      const body = await c.req.json();
      const currentUser = c.get('user');
      const { status, audit_notes, is_public } = body;

      const validStatuses: ReportStatus[] = ['verified', 'rejected', 'forwarded'];
      if (!status || !validStatuses.includes(status)) {
        return c.json(
          {
            success: false,
            error: 'Keputusan harus berupa: verified (diverifikasi), rejected (ditolak), atau forwarded (diteruskan).'
          },
          400
        );
      }

      if (!audit_notes || typeof audit_notes !== 'string' || audit_notes.trim().length < 5) {
        return c.json(
          {
            success: false,
            error: 'Catatan audit wajib dicantumkan minimal 5 karakter untuk jejak akuntabilitas keputusan.'
          },
          400
        );
      }

      const updated = await ReportModel.updateStatus({
        id,
        status,
        audit_notes: audit_notes.trim(),
        actor: currentUser ? currentUser.name : 'Tim Auditor JejakPublik',
        is_public: typeof is_public === 'boolean' ? is_public : status === 'verified'
      });

      return c.json({
        success: true,
        stage: 'Tanggapan dan Keputusan Selesai',
        message: `Laporan berhasil diproses dengan status: ${status}`,
        data: updated
      });
    } catch (err: any) {
      return c.json(
        {
          success: false,
          error: err.message || 'Gagal memproses keputusan moderasi.'
        },
        500
      );
    }
  }

  /**
   * Ringkasan statistik performa tim moderasi
   */
  static async getStats(c: Context) {
    const all = await ReportModel.findAll();
    const stats = {
      total: all.length,
      pending: all.filter((r) => r.status === 'pending').length,
      verified: all.filter((r) => r.status === 'verified').length,
      rejected: all.filter((r) => r.status === 'rejected').length,
      forwarded: all.filter((r) => r.status === 'forwarded').length
    };

    return c.json({
      success: true,
      stats
    });
  }
}
