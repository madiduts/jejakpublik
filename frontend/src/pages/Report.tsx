import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ico } from '../components/detail/icons';
import { getSession } from '../lib/session';

export const Report: React.FC = () => {
  const location = useLocation();
  const session = getSession();

  // Akun moderator diarahkan ke antrean verifikasi laporan
  if (session?.role === 'moderator') {
    return <Navigate to="/moderator" replace />;
  }

  return (
    <div className="lp rp-select-page">
      <Navbar />

      <main className="rp-select-wrap">
        <p className="rp-crumb">
          <Link to="/" className="rp-crumb-link">Beranda</Link> / <strong>Lapor</strong>
        </p>

        <div className="rp-eyebrow-row">
          <span className="rp-tag-laporan">LAPORAN</span>
          <span className="rp-tag-akun">BUTUH AKUN</span>
        </div>

        <h1 className="rp-select-title">Pilih kategori temuan laporan</h1>
        <p className="rp-select-lede">
          Setiap laporan diverifikasi tim moderator berdasarkan bukti dokumen atau dokumentasi visual lapangan sebelum ditampilkan ke publik.
        </p>

        <div className="rp-card-stack">
          {/* Opsi 1: Koreksi Informasi & Data Anggaran */}
          <Link
            to={{ pathname: '/lapor/koreksi', search: location.search }}
            className="rp-choice-card"
          >
            <div className="rp-card-num" aria-hidden="true">01</div>
            <div className="rp-card-content">
              <h2 className="rp-card-title">Koreksi Informasi & Data Anggaran</h2>
              <p className="rp-card-desc">
                Gunakan opsi ini jika kamu menemukan angka yang tidak selaras antara portal JejakPublik dengan dokumen LKIP, BPKD, atau perda APBD.
              </p>
              <div className="rp-chip-group">
                <span className="rp-chip">Butuh nomor halaman / PDF</span>
                <span className="rp-chip">Koreksi selisih angka</span>
                <span className="rp-chip">Klasifikasi subkegiatan</span>
              </div>
            </div>
            <div className="rp-card-btn" aria-hidden="true">
              <Ico g="chev" slot={20} color="currentColor" />
            </div>
          </Link>

          {/* Opsi 2: Observasi Lapangan & Fakta Fisik */}
          <Link
            to={{ pathname: '/lapor/observasi', search: location.search }}
            className="rp-choice-card"
          >
            <div className="rp-card-num" aria-hidden="true">02</div>
            <div className="rp-card-content">
              <h2 className="rp-card-title">Observasi Lapangan & Fakta Fisik</h2>
              <p className="rp-card-desc">
                Gunakan opsi ini jika kamu menemukan ketidaksesuaian antara realisasi anggaran yang dilaporkan dengan kondisi nyata di lingkungan sekitarmu.
              </p>
              <div className="rp-chip-group">
                <span className="rp-chip">Butuh foto bukti fisik</span>
                <span className="rp-chip">Alamat / lokasi jelas</span>
                <span className="rp-chip">Perkiraan waktu temuan</span>
              </div>
            </div>
            <div className="rp-card-btn" aria-hidden="true">
              <Ico g="chev" slot={20} color="currentColor" />
            </div>
          </Link>
        </div>

        {/* Notice Box */}
        <div className="rp-notice-box">
          <h3 className="rp-notice-h">Sebelum mengirim</h3>
          <p className="rp-notice-p">
            JejakPublik meninjau laporan dan menampilkannya sebagai <strong>laporan warga</strong>, bukan fakta terverifikasi. Kami menjaga kerahasiaan identitas pelapor dan tidak pernah meminta NIK, foto KTP, atau swafoto.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Report;
