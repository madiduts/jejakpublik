import { Hono } from 'hono';
import { ModerationController } from '../controllers/moderation.controller.js';
import { requireAuth, requireModerator } from '../middlewares/auth.middleware.js';

const moderationRoutes = new Hono();

// Seluruh rute moderasi dilindungi hak akses moderator
moderationRoutes.use('*', requireAuth, requireModerator);

// 1. Antrean Laporan Masuk
moderationRoutes.get('/queue', ModerationController.getQueue);

// 2. Pemeriksaan Laporan dan Bukti
moderationRoutes.get('/reports/:id', ModerationController.getReportDetail);

// 3. Tanggapan dan Keputusan
moderationRoutes.post('/reports/:id/decision', ModerationController.submitDecision);

// 4. Statistik Moderasi
moderationRoutes.get('/stats', ModerationController.getStats);

export default moderationRoutes;
