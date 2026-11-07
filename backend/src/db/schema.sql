-- Skema Database PostgreSQL (Neon / Supabase) — JejakPublik
-- Versi: 1.0.0

-- 1. ENUM DEFINITIONS
DO $$ BEGIN
    CREATE TYPE budget_state_enum AS ENUM ('NORMAL', 'DIKOREKSI', 'DITAHAN', 'TIDAK_DILAPORKAN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status_enum AS ENUM ('pending', 'verified', 'rejected', 'forwarded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABEL SKPD (Lapis Luas: 43 Instansi Daerah)
CREATE TABLE IF NOT EXISTS skpd (
    id VARCHAR(50) PRIMARY KEY,                 -- slug: e.g. 'dinas-lingkungan-hidup'
    id_induk VARCHAR(20),                       -- BPKD IDINDUK
    nama VARCHAR(255) NOT NULL,
    komisi VARCHAR(10),
    asisten VARCHAR(10),
    pendapatan_anggaran BIGINT,
    pendapatan_realisasi BIGINT,
    belanja_anggaran BIGINT NOT NULL,
    belanja_realisasi BIGINT NOT NULL,
    pembiayaan_anggaran BIGINT,                 -- NULL bila tidak dilaporkan (BUKAN 0)
    pembiayaan_realisasi BIGINT,                -- NULL bila tidak dilaporkan (BUKAN 0)
    has_deep_dive BOOLEAN DEFAULT false,        -- true khusus Dinas Lingkungan Hidup
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PROGRAM ANGGARAN (Lapis Dalam: Pilot DLH)
CREATE TABLE IF NOT EXISTS budget_programs (
    id VARCHAR(50) PRIMARY KEY,                 -- kode program: e.g. '3.27.01'
    skpd_id VARCHAR(50) REFERENCES skpd(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    pagu_penetapan BIGINT,
    pagu_perubahan BIGINT,
    realisasi BIGINT,
    persentase_serapan NUMERIC(5,2),
    state budget_state_enum DEFAULT 'NORMAL',
    reconciliation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL KEGIATAN & SUBKEGIATAN
CREATE TABLE IF NOT EXISTS budget_activities (
    id VARCHAR(50) PRIMARY KEY,                 -- kode kegiatan
    program_id VARCHAR(50) REFERENCES budget_programs(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL,                 -- 'kegiatan' | 'subkegiatan'
    parent_id VARCHAR(50),
    nama VARCHAR(255) NOT NULL,
    pagu_penetapan BIGINT,
    pagu_perubahan BIGINT,
    realisasi BIGINT,
    persentase_serapan NUMERIC(5,2),
    state budget_state_enum DEFAULT 'NORMAL',
    withheld_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL INDIKATOR KINERJA (LKIP Tabel 3.35)
CREATE TABLE IF NOT EXISTS performance_indicators (
    id SERIAL PRIMARY KEY,
    skpd_id VARCHAR(50) REFERENCES skpd(id) ON DELETE CASCADE,
    program_id VARCHAR(50),
    indikator_nama VARCHAR(255) NOT NULL,
    satuan VARCHAR(50),
    target_kinerja NUMERIC(10,2),
    realisasi_kinerja NUMERIC(10,2),
    persentase_capaian NUMERIC(6,2),
    efisiensi_anggaran NUMERIC(15,2),           -- sisa anggaran tidak terserap
    penjelasan_semantik TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL PELAPORAN WARGA (Citizen Audit)
CREATE TABLE IF NOT EXISTS citizen_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(25) UNIQUE NOT NULL,
    reporter_name VARCHAR(100) DEFAULT 'Anonim',
    reporter_email VARCHAR(120),
    reporter_phone VARCHAR(25),
    skpd_id VARCHAR(50) REFERENCES skpd(id),
    program_id VARCHAR(50),
    report_type VARCHAR(30) NOT NULL,          -- 'anomali_angka' | 'observasi_lapangan' | 'salah_ketik'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    status report_status_enum DEFAULT 'pending',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON citizen_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_skpd ON citizen_reports(skpd_id);
