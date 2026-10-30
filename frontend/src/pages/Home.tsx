import React from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { SummaryCards } from '../components/home/SummaryCards';
import { SkpdTable } from '../components/home/SkpdTable';
import rawSkpdData from '../data/bpkd-skpd-2025.json';
import { SkpdItem } from '../types';
import { Search, FileText, CheckCircle2, AlertOctagon, Info, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const skpdList = (rawSkpdData as { data: SkpdItem[] }).data;

  return (
    <LayoutShell>
      <div className="wrap" style={{ paddingTop: '24px' }}>
        {/* Notice Banner */}
        <div className="notice-banner" role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="var(--accent)" aria-hidden="true" />
            <span>
              <strong>Transparansi Periode:</strong> Seluruh data bersumber dari dokumen resmi APBD & LKIP TA 2025 (periode selesai), penarikan data resmi <strong>21 Oktober 2026</strong>. Bukan data real-time.
            </span>
          </div>
          <Link to="/tentang" style={{ fontWeight: 600, textDecoration: 'underline', whiteSpace: 'nowrap' }}>
            Baca Metodologi &rarr;
          </Link>
        </div>

        {/* Hero Section */}
        <section aria-labelledby="hero-title" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
            <ShieldCheck size={14} aria-hidden="true" />
            Platform Transparansi Anggaran Independen &middot; Provinsi DKI Jakarta 2025
          </div>

          <h1 id="hero-title" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px', lineHeight: 1.25 }}>
            Uang Publik Provinsi DKI Jakarta
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', marginTop: '8px', maxWidth: '780px', lineHeight: 1.6 }}>
            Website independen yang membantu warga menelusuri anggaran, realisasi belanja, dan indikator hasil
            pemerintah provinsi. Kami menyajikan angka apa adanya, menandai anomali salah ketik resmi secara terbuka,
            dan tidak meratakan data anomali menjadi nol.
          </p>

          {/* 4 Feature Highlights / Nilai Pembeda (Sesuai PRD Modul 1 & 2) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              marginTop: '24px',
            }}
          >
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Search size={18} color="var(--accent)" aria-hidden="true" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Arsitektur Dua Lapis</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Akses ringkasan 43 perangkat daerah, tembus hingga 33 subkegiatan dan 10 unit kerja pada dinas percontohan (DLH).
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FileText size={18} color="var(--accent)" aria-hidden="true" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Jejak Sumber Terbuka</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Tiap angka mencantumkan rujukan tabel (Tabel 2.4, 3.33, 3.34, 3.35 LKIP), dokumen sumber, dan tanggal ekstraksi.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertOctagon size={18} color="var(--warn)" aria-hidden="true" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Data State Engine</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Menangani 3 status data (Normal, Dikoreksi kasus B3, dan Ditahan kasus Gaji ASN) dengan modal audit transparan.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} color="var(--accent)" aria-hidden="true" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Pelurus Istilah Nyata</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Membedakan pagu penetapan vs perubahan akibat Inpres 1/2025, serta meluruskan arti "efisiensi" anggaran.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Pilot Callout Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
            border: '1px solid #99F6E4',
            borderRadius: '12px',
            padding: '18px 22px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0F766E', marginBottom: '4px' }}>
              <Database size={14} aria-hidden="true" />
              Pilot Penelusuran Mendalam (Lapis Dalam)
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
              Dinas Lingkungan Hidup Provinsi DKI Jakarta (TA 2025)
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', marginTop: '2px', maxWidth: '640px' }}>
              Menembus 8 Program, 15 Kegiatan, 33 Subkegiatan, 12 Indikator Kinerja LKIP (Tabel 3.35), serta 10 Unit Kerja Pelaksana.
            </p>
          </div>
          <Link
            to="/instansi/lingkungan-hidup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0F766E',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(15, 118, 110, 0.2)',
            }}
          >
            Buka Rincian DLH <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Tiga Pilar Anggaran Provinsi (F-01) */}
        <SummaryCards data={skpdList} />

        {/* Katalog 43 SKPD (F-02) */}
        <SkpdTable data={skpdList} />
      </div>
    </LayoutShell>
  );
};
