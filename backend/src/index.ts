import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import 'dotenv/config';

const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use('*', cors());

// Base Route / Health Check
app.get('/', (c) => {
  const isDbConfigured = Boolean(
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('username:password')
  );

  return c.json({
    status: 'ok',
    name: 'JejakPublik Backend API',
    neonDbConfigured: isDbConfigured,
    message: 'Backend Hono aktif dan siap dikembangkan',
  });
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port} (http://localhost:${port})`);

serve({
  fetch: app.fetch,
  port,
});
