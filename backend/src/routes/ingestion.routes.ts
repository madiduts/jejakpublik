import { Hono } from 'hono';
import { IngestionController } from '../controllers/ingestion.controller.js';

const ingestionRoutes = new Hono();

// Status publik sinkronisasi data
ingestionRoutes.get('/status', IngestionController.getStatus);

// Manual trigger penarikan 24 jam (terproteksi X-Webhook-Secret)
ingestionRoutes.post('/sync', IngestionController.triggerSync);

// Webhook receiver (terproteksi X-Webhook-Secret)
ingestionRoutes.post('/webhook', IngestionController.handleWebhook);

export default ingestionRoutes;
