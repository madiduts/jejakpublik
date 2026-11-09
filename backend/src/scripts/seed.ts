import 'dotenv/config';
import crypto from 'node:crypto';
import { sql } from '../db/neon.js';
import { hashPassword } from '../models/user.model.js';

async function seed() {
  if (!sql) {
    console.error('Database connection not configured in .env (DATABASE_URL missing).');
    process.exit(1);
  }

  console.log('--- Menjalankan Database Seeder dari Environment Variables ---');

  const wargaName = process.env.DEMO_WARGA_NAME || 'Warga Peduli Jakarta';
  const wargaEmail = (process.env.DEMO_WARGA_EMAIL || '').trim().toLowerCase();
  const wargaPassword = process.env.DEMO_WARGA_PASSWORD;

  const modName = process.env.DEMO_MODERATOR_NAME || 'Tim Auditor JejakPublik';
  const modEmail = (process.env.DEMO_MODERATOR_EMAIL || '').trim().toLowerCase();
  const modPassword = process.env.DEMO_MODERATOR_PASSWORD;

  if (wargaEmail && wargaPassword) {
    const wargaHash = hashPassword(wargaPassword);
    await (sql as any).query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'warga', NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         updated_at = NOW()`,
      [wargaName, wargaEmail, wargaHash]
    );
    console.log(`✓ Akun warga disinkronkan ke DB: ${wargaEmail}`);
  }

  if (modEmail && modPassword) {
    const modHash = hashPassword(modPassword);
    await (sql as any).query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'moderator', NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         updated_at = NOW()`,
      [modName, modEmail, modHash]
    );
    console.log(`✓ Akun auditor disinkronkan ke DB: ${modEmail}`);
  }

  // Seed sample verified report jika belum ada
  const sampleTicket = 'JP-2025-01A8';
  const existingReport = await (sql as any).query(
    'SELECT id FROM citizen_reports WHERE ticket_number = $1 LIMIT 1',
    [sampleTicket]
  );

  if (!existingReport || existingReport.length === 0) {
    const userRow = await (sql as any).query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [wargaEmail]
    );
    const userId = userRow && userRow.length > 0 ? userRow[0].id : null;

    await (sql as any).query(
      `INSERT INTO citizen_reports 
        (id, ticket_number, user_id, reporter_name, reporter_email, reporter_phone, 
         skpd_id, program_id, report_type, title, description, evidence_urls, status, is_public, audit_notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15, NOW(), NOW())`,
      [
        crypto.randomUUID(),
        sampleTicket,
        userId,
        wargaName,
        wargaEmail,
        '081234567890',
        'dinas-lingkungan-hidup',
        '3.27.08',
        'anomali_angka',
        'Ketidaksesuaian Angka Belanja Program Pengelolaan B3 & Limbah B3',
        'Terdapat anomali penulisan realisasi belanja Program Pengelolaan B3 antara dokumen paparan BPKD dan tabel LKIP DLH TA 2025. Perlu rekonsiliasi angka resmi.',
        JSON.stringify(['/uploads/sample-evidence-dlh-b3.png']),
        'verified',
        true,
        'Diverifikasi oleh Tim Auditor. Data dikoreksi mengikuti audit trail LKIP Tabel 3.33 dan ditandai status DIKOREKSI.'
      ]
    );
    console.log(`✓ Sampel laporan terverifikasi disinkronkan: ${sampleTicket}`);
  }

  console.log('✓ Seeding database dari environment variables selesai!');
}

seed().catch(console.error);
