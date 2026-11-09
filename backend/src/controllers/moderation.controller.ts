import type { Context } from 'hono';
import { ReportModel } from '../models/report.model.js';
import { moderationDecisionSchema } from '../schemas/report.schema.js';
import { AppError } from '../utils/errors.js';
import { successResponse } from '../utils/responses.js';

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
      throw new AppError('BAD_REQUEST' as any, 'ID laporan wajib disertakan.', 400);
    }

    const report = await ReportModel.findById(id);
    if (!report) {
      throw new AppError('NOT_FOUND' as any, 'Laporan tidak ditemukan.', 404);
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
    const id = c.req.param('id');
    if (!id) {
      throw new AppError('BAD_REQUEST' as any, 'ID laporan wajib disertakan.', 400);
    }

    const body = await c.req.json();
    const currentUser = c.get('user');
    const validated = moderationDecisionSchema.parse(body);

    const updated = await ReportModel.updateStatus({
      id,
      status: validated.status,
      audit_notes: validated.audit_notes,
      actor: currentUser ? currentUser.name : 'Tim Auditor JejakPublik',
      is_public: typeof validated.is_public === 'boolean' ? validated.is_public : validated.status === 'verified'
    });

    return c.json({
      success: true,
      stage: 'Tanggapan dan Keputusan Selesai',
      message: `Laporan berhasil diproses dengan status: ${validated.status}`,
      data: updated
    });
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
