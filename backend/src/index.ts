import { serve } from '@hono/node-server';
import 'dotenv/config';
import { app } from './app.js';
import { IngestionService } from './services/ingestion.service.js';

const port = Number(process.env.PORT) || 3000;
console.log(`JejakPublik Backend MCR Server running on port ${port} (http://localhost:${port})`);

// Aktifkan penjadwal otomatis 24 jam untuk sinkronisasi 2 sumber data jika dikonfigurasi
if (process.env.ENABLE_AUTO_SYNC !== 'false') {
  const syncHours = Number(process.env.SYNC_INTERVAL_HOURS) || 24;
  IngestionService.initScheduler(syncHours);
}

serve({
  fetch: app.fetch,
  port
});
