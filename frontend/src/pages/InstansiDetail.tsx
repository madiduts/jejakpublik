import React, { useState } from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { ProgramHierarchy } from '../components/instansi/ProgramHierarchy';
import { IndikatorTab } from '../components/instansi/dlh/IndikatorTab';
import { UnitKerjaTab } from '../components/instansi/dlh/UnitKerjaTab';
import rawRealisasiData from '../data/dlh-realisasi-anggaran-2025.json';
import rawIndikatorData from '../data/dlh-efisiensi-indikator-2025.json';
import rawUnitKerjaData from '../data/dlh-unit-kerja-2025.json';
import { ProgramItem, DlhIndikatorItem, DlhUnitKerjaItem } from '../types';
import { Link } from 'react-router-dom';

export const InstansiDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'program' | 'indikator' | 'unit'>('program');

  const programs = (rawRealisasiData as { program: ProgramItem[] }).program;
  const indikators = (rawIndikatorData as { baris: DlhIndikatorItem[] }).baris;
  const units = (rawUnitKerjaData as { unit: DlhUnitKerjaItem[] }).unit;

  return (
    <LayoutShell>
      {/* Hero Visual Container Frame 03 Instansi DLH (node-id 92:283) */}
      <div className="figma-hero-wrapper" style={{ marginBottom: '32px' }}>
        <div className="figma-hero-box" style={{ minHeight: '320px', padding: '48px 32px' }}>
          <img
            src="/assets/dlh-bg-raw.jpg"
            alt="Dinas Lingkungan Hidup Jakarta"
            className="figma-hero-bg"
          />
          <div className="figma-hero-overlay" />
          <div className="figma-hero-content" style={{ maxWidth: '840px' }}>
            <div className="figma-breadcrumb" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.85)' }}>Beranda</Link>
              <span className="sep" style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
              <Link to="/jelajahi" style={{ color: 'rgba(255,255,255,0.85)' }}>Jelajahi Data</Link>
              <span className="sep" style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
              <span className="current" style={{ color: '#ffffff' }}>Dinas Lingkungan Hidup</span>
            </div>
            <h1 className="figma-hero-h1" style={{ fontSize: '42px', marginBottom: '12px' }}>
              Dinas Lingkungan Hidup
            </h1>
            <p className="figma-hero-p" style={{ marginBottom: 0 }}>
              Provinsi DKI Jakarta &middot; sumber LKIP 2025 &middot; data tahun 2025 (periode selesai)
            </p>
          </div>
        </div>
      </div>

      <div className="figma-container" style={{ paddingTop: 0 }}>
        {/* 4 Summary Stat Banner Sesuai Figma node-id 92:35 */}
        <section aria-label="Ringkasan 4 Pilar DLH" className="figma-stat-banner" style={{ marginTop: 0 }}>
          <div className="figma-stat-banner-inner" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="figma-stat-item">
              <span className="figma-stat-label">Anggaran penetapan</span>
              <div className="figma-stat-number" style={{ fontSize: '24px' }}>Rp3.800.927.272.668</div>
              <span className="figma-stat-sub">APBD awal tahun</span>
            </div>

            <div className="figma-stat-item">
              <span className="figma-stat-label">Anggaran perubahan</span>
              <div className="figma-stat-number" style={{ fontSize: '24px' }}>Rp3.719.846.734.770</div>
              <span className="figma-stat-sub">Setelah perubahan 2025</span>
            </div>

            <div className="figma-stat-item">
              <span className="figma-stat-label">Realisasi</span>
              <div className="figma-stat-number" style={{ fontSize: '24px' }}>Rp3.362.947.632.852</div>
              <span className="figma-stat-sub">Dilaporkan instansi</span>
            </div>

            <div className="figma-stat-item">
              <span className="figma-stat-label">Terserap</span>
              <div className="figma-stat-number" style={{ fontSize: '24px', color: '#0066cc' }}>90,41%</div>
              <span className="figma-stat-sub">Terhadap anggaran perubahan</span>
            </div>
          </div>
        </section>

        {/* Callout Penjelasan Desimal Persentase Sesuai Figma */}
        <div className="figma-callout-warning">
          <strong>Mengapa 90,41% bukan 90,40%?</strong> LKIP mencetak 90,40%, hitungan langsung 90,4055%, dan dokumen sumber memotong desimal alih-alih membulatkan. Nilai yang ditahan tidak diubah menjadi nol dan tidak dipakai dalam persentase turunan.
        </div>

        {/* 3 Tabs Bar Figma (Program, Indikator, Unit Kerja) */}
        <div className="figma-tabs-nav">
          <button
            type="button"
            className={`figma-tab-nav-btn ${activeTab === 'program' ? 'active' : ''}`}
            onClick={() => setActiveTab('program')}
          >
            Program (8)
          </button>
          <button
            type="button"
            className={`figma-tab-nav-btn ${activeTab === 'indikator' ? 'active' : ''}`}
            onClick={() => setActiveTab('indikator')}
          >
            Indikator kinerja (12)
          </button>
          <button
            type="button"
            className={`figma-tab-nav-btn ${activeTab === 'unit' ? 'active' : ''}`}
            onClick={() => setActiveTab('unit')}
          >
            Unit kerja (10)
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'program' && <ProgramHierarchy programs={programs} />}
        {activeTab === 'indikator' && <IndikatorTab data={indikators} />}
        {activeTab === 'unit' && <UnitKerjaTab data={units} />}
      </div>
    </LayoutShell>
  );
};
