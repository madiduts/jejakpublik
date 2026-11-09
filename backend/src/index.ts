import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import 'dotenv/config';
import { SkpdController } from './controllers/skpd.controller.js';
import skpdRoutes from './routes/skpd.routes.js';
import authRoutes from './routes/auth.routes.js';
import reportRoutes from './routes/report.routes.js';
import contentRoutes from './routes/content.routes.js';
import moderationRoutes from './routes/moderation.routes.js';

const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use('*', cors());

// Serve Static Uploads (bukti foto / dokumen pelaporan warga)
app.use('/uploads/*', serveStatic({ root: './' }));

// Base Route / Health Check & Sitemap Capability
app.get('/', SkpdController.getHealth);

// Modular MCR Routes (Sitemap Alur Lengkap)
// Jalur A: Portal Publik (Tanpa Akun)
app.route('/api/v1/content', contentRoutes);
app.route('/api/v1/skpd', skpdRoutes);
app.route('/api/v1/instansi', skpdRoutes); // Alias resmi sesuai sitemap

// Jalur B: Layanan Pelaporan (Perlu Akun & RBAC)
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/reports', reportRoutes);
app.route('/api/v1/moderation', moderationRoutes);

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port} (http://localhost:${port})`);

serve({
  fetch: app.fetch,
  port,
});
