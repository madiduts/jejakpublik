import { Hono } from 'hono';
import { ReportController } from '../controllers/report.controller.js';
import { requireAuth, requireModerator, optionalAuth } from '../middlewares/auth.middleware.js';

const reportRoutes = new Hono();

// 1. Publik / Terbuka
reportRoutes.get('/public', ReportController.getPublicReports);
reportRoutes.get('/track/:ticket', ReportController.trackByTicket);
reportRoutes.post('/upload', optionalAuth, ReportController.uploadEvidence);
reportRoutes.post('/', optionalAuth, ReportController.createReport);

// 2. Terproteksi Pengguna (Warga Terdaftar) — CRUD Pelaporan
reportRoutes.get('/my-reports', requireAuth, ReportController.getMyReports);
reportRoutes.get('/:id', requireAuth, ReportController.getReportById);
reportRoutes.put('/:id', requireAuth, ReportController.updateReport);
reportRoutes.delete('/:id', requireAuth, ReportController.deleteReport);

// 3. Terproteksi Moderator (Tim Auditor / Verifikator)
reportRoutes.get('/', requireAuth, requireModerator, ReportController.getAllReports);
reportRoutes.patch('/:id/status', requireAuth, requireModerator, ReportController.updateReportStatus);

export default reportRoutes;
