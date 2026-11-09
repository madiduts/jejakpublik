import type { Context } from 'hono';
import { ReportModel } from '../models/report.model.js';
import {
  createReportSchema,
  updateReportSchema,
  moderationDecisionSchema,
  type ReportType,
  type ReportStatus
} from '../schemas/report.schema.js';
import { StorageService } from '../services/storage.service.js';
import { AppError } from '../utils/errors.js';
import { successResponse } from '../utils/responses.js';

export class ReportController {
  /**
   * Upload berkas bukti gambar / foto dokumen lapangan (Cloudflare R2 / Local fallback)
   */
  static async uploadEvidence(c: Context) {
    try {
      const body = await c.req.parseBody();
      const file = body['file'] || body['image'];

      if (!file || !(file instanceof File)) {
        return c.json(
          {
            success: false,
            error: 'Berkas tidak ditemukan. Unggah file gambar melalui form field "file" atau "image".'
          },
          400
        );
      }

      // Validasi MIME type
      const allowedMime = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
      if (!allowedMime.includes(file.type)) {
        return c.json(
          {
            success: false,
            error: 'Format berkas tidak diizinkan. Gunakan PNG, JPEG, WEBP, atau PDF.'
          },
          400
        );
      }

      // Batas ukuran 10MB
      if (file.size > 10 * 1024 * 1024) {
        return c.json(
          {
            success: false,
            error: 'Ukuran berkas melebihi batas maksimum 10MB.'
          },
          400
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await StorageService.uploadEvidence(buffer, file.name, file.type);

      return c.json(
        {
          success: true,
          message: 'Bukti dokumen/foto berhasil diunggah.',
          data: {
            filename: uploadResult.filename,
            fileUrl: uploadResult.url,
            size: uploadResult.size,
            mimeType: uploadResult.mimeType,
            provider: uploadResult.provider
          }
        },
        201
      );
    } catch (err: any) {
      return c.json(
        {
          success: false,
          error: err.message || 'Gagal memproses unggahan bukti gambar.'
        },
        500
      );
    }
  }

  /**
   * Buat laporan warga partisipatif
   */
  static async createReport(c: Context) {
    const body = await c.req.json();
    const currentUser = c.get('user');
    const validated = createReportSchema.parse(body);

    const report = await ReportModel.create({
      user_id: currentUser ? currentUser.id : null,
      reporter_name: currentUser ? currentUser.name : (validated.reporter_name || 'Warga Anonim'),
      reporter_email: currentUser ? currentUser.email : (validated.reporter_email || ''),
      reporter_phone: validated.reporter_phone || '',
      skpd_id: validated.skpd_id,
      program_id: validated.program_id,
      report_type: validated.report_type,
      title: validated.title,
      description: validated.description,
      evidence_urls: validated.evidence_urls,
      is_draft: validated.is_draft
    });

    return c.json(
      {
        success: true,
        message: validated.is_draft
          ? 'Draf laporan berhasil disimpan.'
          : 'Laporan warga berhasil diajukan dan sedang menunggu verifikasi tim.',
        data: {
          ticket_number: report.ticket_number,
          report_id: report.id,
          status: report.status,
          created_at: report.created_at
        }
      },
      201
    );
  }

  /**
   * Detail laporan berdasarkan ID
   */
  static async getReportById(c: Context) {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ success: false, error: 'ID laporan wajib disertakan.' }, 400);
    }

    const report = await ReportModel.findById(id);
    if (!report) {
      return c.json({ success: false, error: 'Laporan tidak ditemukan.' }, 404);
    }

    return c.json({ success: true, data: report });
  }

  /**
   * Pembaruan laporan (Khusus pelapor pemilik akun)
   */
  static async updateReport(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID laporan wajib disertakan.' }, 400);
      }
      const user = c.get('user');
      const body = await c.req.json();

      const updated = await ReportModel.updateReport({
        id,
        user_id: user.id,
        title: body.title,
        description: body.description,
        report_type: body.report_type,
        evidence_urls: body.evidence_urls,
        is_draft: body.is_draft
      });

      return c.json({
        success: true,
        message: 'Laporan berhasil diperbarui.',
        data: updated
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message || 'Gagal memperbarui laporan.' }, 400);
    }
  }

  /**
   * Hapus laporan (Khusus pelapor pemilik draf atau moderator)
   */
  static async deleteReport(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID laporan wajib disertakan.' }, 400);
      }
      const user = c.get('user');
      const isModerator = user.role === 'moderator';

      await ReportModel.deleteReport(id, user.id, isModerator);
      return c.json({ success: true, message: 'Laporan berhasil dihapus.' });
    } catch (err: any) {
      return c.json({ success: false, error: err.message || 'Gagal menghapus laporan.' }, 400);
    }
  }

  /**
   * Lacak status tiket laporan (Akses terbuka tanpa wajib login)
   */
  static async trackByTicket(c: Context) {
    const ticket = c.req.param('ticket');
    if (!ticket) {
      return c.json(
        {
          success: false,
          error: 'Nomor tiket wajib dicantumkan.'
        },
        400
      );
    }

    const report = await ReportModel.findByTicket(ticket);
    if (!report) {
      return c.json(
        {
          success: false,
          error: `Tiket pelaporan "${ticket}" tidak ditemukan dalam sistem.`
        },
        404
      );
    }

    return c.json({
      success: true,
      data: report
    });
  }

  /**
   * Daftar laporan publik terverifikasi (Showcase partisipasi publik)
   */
  static async getPublicReports(c: Context) {
    const limit = Number(c.req.query('limit')) || 20;
    const reports = await ReportModel.findPublicReports(limit);

    return c.json({
      success: true,
      total: reports.length,
      data: reports
    });
  }

  /**
   * Riwayat laporan milik pengguna yang sedang login
   */
  static async getMyReports(c: Context) {
    const user = c.get('user');
    const reports = await ReportModel.findByUserId(user.id);

    return c.json({
      success: true,
      total: reports.length,
      data: reports
    });
  }

  /**
   * Daftar seluruh laporan untuk Dashboard Moderator
   */
  static async getAllReports(c: Context) {
    const status = c.req.query('status');
    const skpd_id = c.req.query('skpd_id');

    const reports = await ReportModel.findAll({ status, skpd_id });

    return c.json({
      success: true,
      total: reports.length,
      data: reports
    });
  }

  /**
   * Verifikasi / Update status laporan oleh Tim Auditor & Moderator
   */
  static async updateReportStatus(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json(
          {
            success: false,
            error: 'ID laporan wajib disertakan.'
          },
          400
        );
      }
      const body = await c.req.json();
      const currentUser = c.get('user');

      const { status, audit_notes, is_public } = body;

      const validStatuses: ReportStatus[] = ['pending', 'verified', 'rejected', 'forwarded'];
      if (!status || !validStatuses.includes(status)) {
        return c.json(
          {
            success: false,
            error: 'Status tidak valid. Harus pending, verified, rejected, atau forwarded.'
          },
          400
        );
      }

      if (!audit_notes || typeof audit_notes !== 'string' || audit_notes.trim().length < 5) {
        return c.json(
          {
            success: false,
            error: 'Catatan audit wajib diisi minimal 5 karakter untuk jejak akuntabilitas.'
          },
          400
        );
      }

      const updated = await ReportModel.updateStatus({
        id,
        status,
        audit_notes: audit_notes.trim(),
        actor: currentUser ? currentUser.name : 'Tim Auditor JejakPublik',
        is_public
      });

      return c.json({
        success: true,
        message: `Status laporan berhasil diperbarui menjadi ${status}.`,
        data: updated
      });
    } catch (err: any) {
      return c.json(
        {
          success: false,
          error: err.message || 'Gagal memperbarui status laporan.'
        },
        500
      );
    }
  }
}
