import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { errorHandler } from './middlewares/error.middleware.js';
import { SkpdController } from './controllers/skpd.controller.js';
import skpdRoutes from './routes/skpd.routes.js';
import authRoutes from './routes/auth.routes.js';
import reportRoutes from './routes/report.routes.js';
import contentRoutes from './routes/content.routes.js';
import moderationRoutes from './routes/moderation.routes.js';
import ingestionRoutes from './routes/ingestion.routes.js';
import storageRoutes from './routes/storage.routes.js';

export const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
);

// Centralized Error Handling
app.onError(errorHandler);

// Serve Static Uploads (bukti foto / dokumen pelaporan warga)
app.use('/uploads/*', serveStatic({ root: './' }));

// Base Route / Health Check & Architecture Overview
app.get('/', SkpdController.getHealth);

// Modular Routes
// Jalur A: Portal Publik (Tanpa Akun)
app.route('/api/v1/content', contentRoutes);
app.route('/api/v1/skpd', skpdRoutes);
app.route('/api/v1/instansi', skpdRoutes); // Alias resmi sesuai sitemap

// Jalur B: Layanan Pelaporan (Perlu Akun & RBAC)
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/reports', reportRoutes);
app.route('/api/v1/storage', storageRoutes);
app.route('/api/v1/moderation', moderationRoutes);

// Jalur C: Ingestion & Automated Webhook/Sync Pipeline
app.route('/api/v1/ingestion', ingestionRoutes);
