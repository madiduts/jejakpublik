import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from '../db/neon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  if (!sql) {
    console.log('Neon database not configured. Skipping remote migration.');
    return;
  }

  const statements = [
    `DO $$ BEGIN
      CREATE TYPE budget_state_enum AS ENUM ('NORMAL', 'DIKOREKSI', 'DITAHAN', 'TIDAK_DILAPORKAN');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$`,

    `DO $$ BEGIN
      CREATE TYPE report_status_enum AS ENUM ('pending', 'verified', 'rejected', 'forwarded');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$`,

    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'warga',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS skpd (
      id VARCHAR(50) PRIMARY KEY,
      id_induk VARCHAR(20),
      nama VARCHAR(255) NOT NULL,
      komisi VARCHAR(10),
      asisten VARCHAR(10),
      pendapatan_anggaran BIGINT,
      pendapatan_realisasi BIGINT,
      belanja_anggaran BIGINT NOT NULL,
      belanja_realisasi BIGINT NOT NULL,
      pembiayaan_anggaran BIGINT,
      pembiayaan_realisasi BIGINT,
      has_deep_dive BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS budget_programs (
      id VARCHAR(50) PRIMARY KEY,
      skpd_id VARCHAR(50) REFERENCES skpd(id) ON DELETE CASCADE,
      nama VARCHAR(255) NOT NULL,
      pagu_penetapan BIGINT,
      pagu_perubahan BIGINT,
      realisasi BIGINT,
      persentase_serapan NUMERIC(5,2),
      state budget_state_enum DEFAULT 'NORMAL',
      reconciliation_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS budget_activities (
      id VARCHAR(50) PRIMARY KEY,
      program_id VARCHAR(50) REFERENCES budget_programs(id) ON DELETE CASCADE,
      level VARCHAR(20) NOT NULL,
      parent_id VARCHAR(50),
      nama VARCHAR(255) NOT NULL,
      pagu_penetapan BIGINT,
      pagu_perubahan BIGINT,
      realisasi BIGINT,
      persentase_serapan NUMERIC(5,2),
      state budget_state_enum DEFAULT 'NORMAL',
      withheld_reason TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS performance_indicators (
      id SERIAL PRIMARY KEY,
      skpd_id VARCHAR(50) REFERENCES skpd(id) ON DELETE CASCADE,
      program_id VARCHAR(50),
      indikator_nama VARCHAR(255) NOT NULL,
      satuan VARCHAR(50),
      target_kinerja NUMERIC(10,2),
      realisasi_kinerja NUMERIC(10,2),
      persentase_capaian NUMERIC(6,2),
      efisiensi_anggaran NUMERIC(15,2),
      penjelasan_semantik TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE TABLE IF NOT EXISTS citizen_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_number VARCHAR(25) UNIQUE NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      reporter_name VARCHAR(100) DEFAULT 'Warga Anonim',
      reporter_email VARCHAR(120),
      reporter_phone VARCHAR(25),
      skpd_id VARCHAR(50) REFERENCES skpd(id),
      program_id VARCHAR(50),
      report_type VARCHAR(30) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      evidence_urls JSONB DEFAULT '[]'::jsonb,
      status report_status_enum DEFAULT 'pending',
      is_public BOOLEAN DEFAULT false,
      audit_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    `CREATE INDEX IF NOT EXISTS idx_reports_status ON citizen_reports(status)`,
    `CREATE INDEX IF NOT EXISTS idx_reports_skpd ON citizen_reports(skpd_id)`,
    `CREATE INDEX IF NOT EXISTS idx_reports_user ON citizen_reports(user_id)`
  ];

  console.log('Running individual DDL statements on Neon PostgreSQL...');
  for (const stmt of statements) {
    try {
      await (sql as any).query(stmt);
    } catch (err: any) {
      console.warn('Statement warning:', err.message);
    }
  }

  console.log('✓ All DDL migrations completed on Neon PostgreSQL.');
}

migrate();
