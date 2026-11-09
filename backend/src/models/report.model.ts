import crypto from 'node:crypto';
import { query } from '../db/neon.js';
import type { ReportType, ReportStatus, CitizenReport, AuditTrailItem } from '../schemas/report.schema.js';

// In-memory cache fallback jika PostgreSQL offline / demo testing
const inMemoryReports: Map<string, CitizenReport> = new Map();

// Helper untuk format nomor tiket resmi Figma: L-2026-XXXX (misal: L-2026-0031 atau L-2026-A1B2)
function generateTicketNumber(): string {
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `L-2026-${rand}`;
}

export class ReportModel {
  static async create(params: {
    user_id?: string | null;
    reporter_name: string;
    reporter_email: string;
    reporter_phone?: string;
    skpd_id: string;
    program_id?: string;
    report_type: ReportType;
    title: string;
    description: string;
    evidence_urls?: string[];
    is_draft?: boolean;
  }): Promise<CitizenReport> {
    const id = crypto.randomUUID();
    const ticket_number = generateTicketNumber();
    const now = new Date().toISOString();
    const status: ReportStatus = params.is_draft ? 'draft' : 'pending';

    const report: CitizenReport = {
      id,
      ticket_number,
      user_id: params.user_id || null,
      reporter_name: params.reporter_name.trim() || 'Warga Anonim',
      reporter_email: params.reporter_email.trim(),
      reporter_phone: params.reporter_phone?.trim(),
      skpd_id: params.skpd_id,
      program_id: params.program_id,
      report_type: params.report_type,
      title: params.title.trim(),
      description: params.description.trim(),
      evidence_urls: params.evidence_urls || [],
      status,
      is_public: false,
      audit_notes: undefined,
      audit_trail: [
        {
          timestamp: now,
          action: params.is_draft ? 'DRAFT_CREATED' : 'SUBMITTED',
          note: params.is_draft ? 'Draf laporan disimpan.' : 'Laporan baru diterima oleh sistem.',
          actor: params.reporter_name || 'Warga'
        }
      ],
      created_at: now,
      updated_at: now
    };

    // 1. Simpan ke Neon PostgreSQL
    try {
      await query(
        `INSERT INTO citizen_reports 
          (id, ticket_number, user_id, reporter_name, reporter_email, reporter_phone, 
           skpd_id, program_id, report_type, title, description, evidence_urls, status, is_public, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, $16)`,
        [
          report.id,
          report.ticket_number,
          report.user_id,
          report.reporter_name,
          report.reporter_email,
          report.reporter_phone,
          report.skpd_id,
          report.program_id,
          report.report_type,
          report.title,
          report.description,
          JSON.stringify(report.evidence_urls),
          report.status,
          report.is_public,
          now,
          now
        ]
      );
    } catch {
      // Fallback
    }

    // 2. Cache di memory
    inMemoryReports.set(report.id, report);

    return report;
  }

  static async findByTicket(ticketNumber: string): Promise<CitizenReport | null> {
    const cleanTicket = ticketNumber.trim().toUpperCase();

    // 1. Coba Neon DB
    try {
      const res = await query<any>(
        'SELECT * FROM citizen_reports WHERE UPPER(ticket_number) = $1 LIMIT 1',
        [cleanTicket]
      );
      if (res.rows && res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: r.id,
          ticket_number: r.ticket_number,
          user_id: r.user_id,
          reporter_name: r.reporter_name,
          reporter_email: r.reporter_email,
          reporter_phone: r.reporter_phone,
          skpd_id: r.skpd_id,
          program_id: r.program_id,
          report_type: r.report_type,
          title: r.title,
          description: r.description,
          evidence_urls: Array.isArray(r.evidence_urls) ? r.evidence_urls : JSON.parse(r.evidence_urls || '[]'),
          status: r.status,
          is_public: Boolean(r.is_public),
          audit_notes: r.audit_notes,
          audit_trail: [
            {
              timestamp: r.created_at,
              action: 'SUBMITTED',
              note: 'Laporan diterima sistem.',
              actor: r.reporter_name
            }
          ],
          created_at: r.created_at,
          updated_at: r.updated_at
        };
      }
    } catch {
      // Fallback
    }

    // 2. Memory cache
    for (const r of inMemoryReports.values()) {
      if (r.ticket_number.toUpperCase() === cleanTicket) {
        return r;
      }
    }

    return null;
  }

  static async findById(id: string): Promise<CitizenReport | null> {
    for (const r of inMemoryReports.values()) {
      if (r.id === id) return r;
    }
    return null;
  }

  static async findPublicReports(limit: number = 20): Promise<CitizenReport[]> {
    const results = Array.from(inMemoryReports.values())
      .filter((r) => r.is_public || r.status === 'verified')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    return results;
  }

  static async findByUserId(userId: string): Promise<CitizenReport[]> {
    const results = Array.from(inMemoryReports.values())
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return results;
  }

  static async findAll(filters?: { status?: string; skpd_id?: string }): Promise<CitizenReport[]> {
    let list = Array.from(inMemoryReports.values());
    if (filters?.status) {
      list = list.filter((r) => r.status === filters.status);
    }
    if (filters?.skpd_id) {
      list = list.filter((r) => r.skpd_id === filters.skpd_id);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async updateReport(params: {
    id: string;
    user_id: string;
    title?: string;
    description?: string;
    report_type?: ReportType;
    evidence_urls?: string[];
    is_draft?: boolean;
  }): Promise<CitizenReport> {
    const report = await this.findById(params.id);
    if (!report) {
      throw new Error(`Laporan dengan ID ${params.id} tidak ditemukan.`);
    }

    if (report.user_id && report.user_id !== params.user_id) {
      throw new Error('Anda tidak memiliki izin untuk mengubah laporan ini.');
    }

    if (report.status === 'verified') {
      throw new Error('Laporan yang sudah diverifikasi tidak dapat diubah.');
    }

    const now = new Date().toISOString();
    if (params.title) report.title = params.title.trim();
    if (params.description) report.description = params.description.trim();
    if (params.report_type) report.report_type = params.report_type;
    if (params.evidence_urls) report.evidence_urls = params.evidence_urls;
    if (typeof params.is_draft === 'boolean') {
      report.status = params.is_draft ? 'draft' : 'pending';
    }
    report.updated_at = now;

    try {
      await query(
        `UPDATE citizen_reports 
         SET title = $1, description = $2, report_type = $3, evidence_urls = $4::jsonb, status = $5, updated_at = $6
         WHERE id = $7`,
        [
          report.title,
          report.description,
          report.report_type,
          JSON.stringify(report.evidence_urls),
          report.status,
          now,
          report.id
        ]
      );
    } catch {
      // Fallback
    }

    inMemoryReports.set(report.id, report);
    return report;
  }

  static async deleteReport(id: string, userId: string, isModerator: boolean = false): Promise<boolean> {
    const report = await this.findById(id);
    if (!report) {
      throw new Error(`Laporan dengan ID ${id} tidak ditemukan.`);
    }

    if (!isModerator && report.user_id !== userId) {
      throw new Error('Anda tidak memiliki otoritas untuk menghapus laporan ini.');
    }

    try {
      await query('DELETE FROM citizen_reports WHERE id = $1', [id]);
    } catch {
      // Fallback
    }

    inMemoryReports.delete(id);
    return true;
  }

  static async updateStatus(params: {
    id: string;
    status: ReportStatus;
    audit_notes: string;
    actor: string;
    is_public?: boolean;
  }): Promise<CitizenReport> {
    const report = await this.findById(params.id);
    if (!report) {
      throw new Error(`Laporan dengan ID ${params.id} tidak ditemukan.`);
    }

    const now = new Date().toISOString();
    report.status = params.status;
    report.audit_notes = params.audit_notes;
    report.updated_at = now;
    if (typeof params.is_public === 'boolean') {
      report.is_public = params.is_public;
    } else if (params.status === 'verified') {
      report.is_public = true; // Auto-publikasikan jika diverifikasi
    }

    report.audit_trail.push({
      timestamp: now,
      action: params.status.toUpperCase(),
      note: params.audit_notes,
      actor: params.actor
    });

    // Update di DB jika aktif
    try {
      await query(
        `UPDATE citizen_reports 
         SET status = $1, audit_notes = $2, is_public = $3, updated_at = $4
         WHERE id = $5`,
        [report.status, report.audit_notes, report.is_public, now, report.id]
      );
    } catch {
      // Fallback
    }

    inMemoryReports.set(report.id, report);
    return report;
  }
}
