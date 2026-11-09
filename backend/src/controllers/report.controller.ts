import type { Context } from 'hono';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ReportModel, type ReportType, type ReportStatus } from '../models/report.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

// Pastikan folder uploads ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class ReportController {
  /**
   * Upload berkas bukti gambar / foto dokumen lapangan
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

      const ext = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.png');
      const filename = `evidence-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;

      return c.json(
        {
          success: true,
          message: 'Bukti dokumen/foto berhasil diunggah.',
          data: {
            filename,
            fileUrl,
            size: file.size,
            mimeType: file.type
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
    try {
      const body = await c.req.json();
      const currentUser = c.get('user');

      const {
        title,
        description,
        skpd_id,
        program_id,
        report_type,
        reporter_name,
        reporter_email,
        reporter_phone,
        evidence_urls
      } = body;

      if (!title || typeof title !== 'string' || title.trim().length < 5) {
        return c.json(
          {
            success: false,
            error: 'Judul laporan wajib diisi minimal 5 karakter.'
          },
          400
        );
      }

      if (!description || typeof description !== 'string' || description.trim().length < 15) {
        return c.json(
          {
            success: false,
            error: 'Deskripsi temuan wajib diisi minimal 15 karakter secara rinci.'
          },
          400
        );
      }

      if (!skpd_id || typeof skpd_id !== 'string') {
        return c.json(
          {
            success: false,
            error: 'Instansi SKPD terkait wajib dipilih.'
          },
          400
        );
      }

      const validTypes: ReportType[] = ['anomali_angka', 'observasi_lapangan', 'salah_ketik'];
      if (!report_type || !validTypes.includes(report_type)) {
        return c.json(
          {
            success: false,
            error: 'Jenis laporan harus salah satu dari: anomali_angka, observasi_lapangan, atau salah_ketik.'
          },
          400
        );
      }

      const report = await ReportModel.create({
        user_id: currentUser ? currentUser.id : null,
        reporter_name: currentUser ? currentUser.name : (reporter_name || 'Warga Anonim'),
        reporter_email: currentUser ? currentUser.email : (reporter_email || ''),
        reporter_phone: reporter_phone || '',
        skpd_id,
        program_id,
        report_type,
        title,
        description,
        evidence_urls: Array.isArray(evidence_urls) ? evidence_urls : []
      });

      return c.json(
        {
          success: true,
          message: 'Laporan warga berhasil diajukan dan sedang menunggu verifikasi tim.',
          data: {
            ticket_number: report.ticket_number,
            report_id: report.id,
            status: report.status,
            created_at: report.created_at
          }
        },
        201
      );
    } catch (err: any) {
      return c.json(
        {
          success: false,
          error: err.message || 'Gagal mengajukan laporan partisipatif.'
        },
        500
      );
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
