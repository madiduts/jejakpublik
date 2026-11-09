import { Hono } from 'hono';
import { ReportController } from '../controllers/report.controller.js';
import { requireAuth, requireModerator, optionalAuth } from '../middlewares/auth.middleware.js';

const reportRoutes = new Hono();

// 1. Publik / Terbuka
reportRoutes.get('/public', ReportController.getPublicReports);
reportRoutes.get('/track/:ticket', ReportController.trackByTicket);
reportRoutes.post('/upload', optionalAuth, ReportController.uploadEvidence);
reportRoutes.post('/', optionalAuth, ReportController.createReport);

// 2. Terproteksi Pengguna (Warga Terdaftar)
reportRoutes.get('/my-reports', requireAuth, ReportController.getMyReports);

// 3. Terproteksi Moderator (Tim Auditor / Verifikator)
reportRoutes.get('/', requireAuth, requireModerator, ReportController.getAllReports);
reportRoutes.patch('/:id/status', requireAuth, requireModerator, ReportController.updateReportStatus);

export default reportRoutes;
