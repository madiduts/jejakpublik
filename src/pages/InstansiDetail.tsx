import React, { useState } from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ProgramHierarchy } from '../components/instansi/ProgramHierarchy';
import { IndikatorTab } from '../components/instansi/dlh/IndikatorTab';
import { UnitKerjaTab } from '../components/instansi/dlh/UnitKerjaTab';
import rawRealisasiData from '../data/dlh-realisasi-anggaran-2025.json';
import rawIndikatorData from '../data/dlh-efisiensi-indikator-2025.json';
import rawUnitKerjaData from '../data/dlh-unit-kerja-2025.json';
import { ProgramItem, DlhIndikatorItem, DlhUnitKerjaItem } from '../types';
import { formatRupiah, formatPersen } from '../utils/format';
import { Layers, Target, Building2, FileCheck } from 'lucide-react';

export const InstansiDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'program' | 'indikator' | 'unit'>('program');

  const programs = (rawRealisasiData as { program: ProgramItem[] }).program;
  const indikators = (rawIndikatorData as { baris: DlhIndikatorItem[] }).baris;
  const units = (rawUnitKerjaData as { unit: DlhUnitKerjaItem[] }).unit;

  // Overview numbers for DLH 2025
  const penetapanTotal = 3800927272668;
  const perubahanTotal = 3719846734770;
  const realisasiTotal = 3362947632852;
  const serapanPct = (realisasiTotal / perubahanTotal) * 100;

  return (
    <LayoutShell>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: 'Katalog SKPD', to: '/' },
            { label: 'Dinas Lingkungan Hidup' },
          ]}
        />

        {/* Page Header */}
        <div className="pagehead">
          <div>
            <h1>Dinas Lingkungan Hidup</h1>
            <div className="meta">
              Pemerintah Provinsi DKI Jakarta &middot; Dokumen Sumber: LKIP TA 2025 &middot; Diambil 21 Okt 2026
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-accent">
              <FileCheck size={14} /> LKIP & Dashboard BPKD Terverifikasi
            </span>
            <span className="badge">
              Tahun Anggaran 2025 (Tutup Buku)
            </span>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="stats">
          <div className="stat">
            <span className="lbl">ANGGARAN PENETAPAN (APBD)</span>
            <div className="val">{formatRupiah(penetapanTotal)}</div>
            <div className="sub">Pagu awal sebelum perubahan tahun berjalan</div>
          </div>

          <div className="stat" style={{ borderLeft: '4px solid var(--accent)' }}>
            <span className="lbl">ANGGARAN PERUBAHAN (APBD-P)</span>
            <div className="val big">{formatRupiah(perubahanTotal)}</div>
            <div className="sub" style={{ color: 'var(--accent)' }}>
              &darr; Turun Rp81,08 Miliar (Inpres 1/2025 Efisiensi Belanja)
            </div>
          </div>

          <div className="stat">
            <span className="lbl">REALISASI BELANJA</span>
            <div className="val">{formatRupiah(realisasiTotal)}</div>
            <div className="sub">Total belanja aktual yang dikeluarkan dinas</div>
          </div>

          <div className="stat">
            <span className="lbl">PERSENTASE TERSERAP</span>
            <div className="val" style={{ color: 'var(--success)' }}>
              {formatPersen(serapanPct)}
            </div>
            <div className="sub">Dihitung terhadap APBD-P (basis resmi LKIP)</div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'program' ? 'active' : ''}`}
            onClick={() => setActiveTab('program')}
          >
            <Layers size={16} />
            Program & Subkegiatan (8)
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'indikator' ? 'active' : ''}`}
            onClick={() => setActiveTab('indikator')}
          >
            <Target size={16} />
            Indikator Kinerja & Efisiensi (12)
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'unit' ? 'active' : ''}`}
            onClick={() => setActiveTab('unit')}
          >
            <Building2 size={16} />
            Alokasi Unit Kerja (10)
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'program' && <ProgramHierarchy programs={programs} />}
        {activeTab === 'indikator' && <IndikatorTab data={indikators} />}
        {activeTab === 'unit' && <UnitKerjaTab data={units} />}

        {/* Bottom Documentation / Audit box */}
        <div
          style={{
            marginTop: '36px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '20px',
            fontSize: '13px',
            color: 'var(--ink-soft)',
          }}
        >
          <h4 style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={18} color="var(--accent)" />
            Catatan Metodologi & Sumber Data Halaman Ini
          </h4>
          <p style={{ lineHeight: 1.6, marginBottom: '10px' }}>
            Seluruh angka pada halaman ini diambil dari dokumen fisik <strong>Laporan Kinerja Instansi Pemerintah (LKIP) Dinas Lingkungan Hidup Provinsi DKI Jakarta Tahun 2025</strong> (55 halaman), 
            serta diverifikasi silang terhadap sistem data keuangan elektronik <strong>Dashboard BPKD DKI Jakarta</strong>. 
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.7, color: 'var(--muted)' }}>
            <li>Tabel 2.4 Alokasi Anggaran 2025 (APBD & APBD-P)</li>
            <li>Tabel 3.33 Anggaran 2025 Berdasarkan Unit Kerja (10 unit pelaksana)</li>
            <li>Tabel 3.34 Realisasi Anggaran 2025 Berdasarkan Program, Kegiatan, dan Subkegiatan</li>
            <li>Tabel 3.35 Efisiensi Realisasi Anggaran Terhadap Pencapaian Indikator Kinerja</li>
          </ul>
        </div>
      </div>
    </LayoutShell>
  );
};
