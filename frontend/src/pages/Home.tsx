import React from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { SummaryCards } from '../components/home/SummaryCards';
import { SkpdTable } from '../components/home/SkpdTable';
import rawSkpdData from '../data/bpkd-skpd-2025.json';
import { SkpdItem } from '../types';
import { Search, FileText, CheckCircle2, AlertOctagon, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const skpdList = (rawSkpdData as { data: SkpdItem[] }).data;

  return (
    <LayoutShell>
      <div className="wrap" style={{ paddingTop: '24px' }}>
        {/* Notice Banner */}
        <div className="notice-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} />
            <span>
              <strong>Transparansi Periode:</strong> Seluruh angka bersumber dari dokumen resmi APBD/LKIP TA 2025 (periode selesai), bukan data real-time.
            </span>
          </div>
          <Link to="/tentang" style={{ fontWeight: 600, textDecoration: 'underline' }}>
            Baca Metodologi &rarr;
          </Link>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            Uang Publik Provinsi DKI Jakarta
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', marginTop: '8px', maxWidth: '750px', lineHeight: 1.6 }}>
            Website independen yang membantu warga menelusuri anggaran, realisasi belanja, dan indikator hasil 
            pemerintah provinsi. Kami menyajikan angka apa adanya, menandai salah ketik resmi secara terbuka, 
            dan tidak meratakan anomali data.
          </p>

          {/* 4 Feature Highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '14px',
              marginTop: '24px',
            }}
          >
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Search size={18} color="var(--accent)" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Telusuri Anggaran</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Akses 43 perangkat daerah, tembus hingga 33 subkegiatan pada dinas percontohan.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FileText size={18} color="var(--accent)" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Jejak Sumber Terbuka</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Tiap angka mencantumkan rujukan tabel, nama dokumen resmi, dan tanggal ekstraksi.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertOctagon size={18} color="var(--warn)" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Tandai Angka Bermasalah</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Menandai anomali dokumen (kasus B3 & gaji ASN) dengan riwayat audit transparan.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} color="var(--accent)" />
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Edukasi Istilah Nyata</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Membedakan pagu penetapan vs perubahan, serta meluruskan arti "efisiensi" anggaran.
              </p>
            </div>
          </div>
        </div>

        {/* Provincial Summary Cards */}
        <SummaryCards data={skpdList} />

        {/* 43 SKPD Table */}
        <SkpdTable data={skpdList} />
      </div>
    </LayoutShell>
  );
};
