import { z } from 'zod';

export const reportTypeSchema = z.enum([
  'anomali_angka',
  'observasi_lapangan',
  'salah_ketik',
  'koreksi',
  'sanggahan',
  'sumber'
]);
export type ReportType = z.infer<typeof reportTypeSchema>;

export const reportStatusSchema = z.enum([
  'draft',
  'pending',
  'verified',
  'rejected',
  'forwarded',
  'baru',
  'diperiksa',
  'diterima',
  'ditolak'
]);
export type ReportStatus = z.infer<typeof reportStatusSchema>;

export const createReportSchema = z.object({
  title: z.string().trim().min(3, 'Judul laporan minimal 3 karakter.').max(200),
  description: z.string().trim().min(10, 'Deskripsi temuan minimal 10 karakter.').max(5000),
  skpd_id: z.string().trim().min(1, 'Instansi SKPD terkait wajib dipilih.'),
  program_id: z.string().trim().optional(),
  report_type: reportTypeSchema,
  reporter_name: z.string().trim().max(100).optional(),
  reporter_email: z.string().trim().email('Format email tidak valid.').optional().or(z.literal('')),
  reporter_phone: z.string().trim().max(25).optional(),
  evidence_urls: z.array(z.string().trim()).optional().default([]),
  is_draft: z.boolean().optional().default(false)
});
export type CreateReportInput = z.infer<typeof createReportSchema>;

export const updateReportSchema = z.object({
  title: z.string().trim().min(5, 'Judul laporan minimal 5 karakter.').max(200).optional(),
  description: z.string().trim().min(15, 'Deskripsi temuan minimal 15 karakter.').max(5000).optional(),
  report_type: reportTypeSchema.optional(),
  evidence_urls: z.array(z.string().trim()).optional(),
  is_draft: z.boolean().optional()
});
export type UpdateReportInput = z.infer<typeof updateReportSchema>;

export const moderationDecisionSchema = z.object({
  status: z.enum(['verified', 'rejected', 'forwarded', 'diterima', 'ditolak', 'diperiksa']),
  audit_notes: z.string().trim().min(3, 'Catatan audit wajib diisi.'),
  is_public: z.boolean().optional()
});
export type ModerationDecisionInput = z.infer<typeof moderationDecisionSchema>;

export const ticketParamSchema = z.object({
  ticket: z.string().trim().min(1, 'Nomor tiket wajib dicantumkan.')
});

export const idParamSchema = z.object({
  id: z.string().trim().min(1, 'ID wajib disertakan.')
});

export interface AuditTrailItem {
  timestamp: string;
  action: string;
  note: string;
  actor: string;
}

export interface CitizenReport {
  id: string;
  ticket_number: string;
  user_id: string | null;
  reporter_name: string;
  reporter_email: string;
  reporter_phone?: string;
  skpd_id: string;
  program_id?: string;
  report_type: ReportType;
  title: string;
  description: string;
  evidence_urls: string[];
  status: ReportStatus;
  is_public: boolean;
  audit_notes?: string;
  audit_trail: AuditTrailItem[];
  created_at: string;
  updated_at: string;
}
