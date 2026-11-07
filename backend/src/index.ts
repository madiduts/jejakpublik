import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import 'dotenv/config';
import { SkpdController } from './controllers/skpd.controller.js';
import skpdRoutes from './routes/skpd.routes.js';

const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use('*', cors());

// Base Route / Health Check
app.get('/', SkpdController.getHealth);

// MCR Routes
app.route('/api/v1/skpd', skpdRoutes);

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port} (http://localhost:${port})`);

serve({
  fetch: app.fetch,
  port,
});
