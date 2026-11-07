import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="figma-footer" role="contentinfo">
      <div className="figma-footer-inner">
        {/* Brand Header */}
        <div className="figma-footer-brand">
          <Link to="/" aria-label="JejakPublik Beranda">
            <span className="figma-footer-logo-jejak">J E J A K</span>
            <span className="figma-footer-logo-publik">Publik</span>
          </Link>
        </div>

        {/* 4 Kolom Navigasi & Informasi */}
        <div className="figma-footer-grid">
          {/* Kolom 1: DATA */}
          <div>
            <h4 className="figma-footer-col-title">DATA</h4>
            <ul className="figma-footer-list">
              <li>
                <Link to="/#skpd-section">43 instansi daerah</Link>
              </li>
              <li>
                <Link to="/instansi/lingkungan-hidup">Dinas Lingkungan Hidup</Link>
              </li>
              <li>
                <Link to="/instansi/lingkungan-hidup">8 program, 15 kegiatan, 33 sub</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 2: RUJUKAN */}
          <div>
            <h4 className="figma-footer-col-title">RUJUKAN</h4>
            <ul className="figma-footer-list">
              <li>
                <Link to="/istilah">Glosarium istilah</Link>
              </li>
              <li>
                <Link to="/tentang">Tentang dan metode</Link>
              </li>
              <li>
                <Link to="/tentang#sumber">Sumber data</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: BATAS */}
          <div>
            <h4 className="figma-footer-col-title">BATAS</h4>
            <ul className="figma-footer-list">
              <li>Bukan data real-time</li>
              <li>Bukan kanal pengaduan</li>
              <li>Bukan vonis korupsi</li>
            </ul>
          </div>

          {/* Kolom 4: SUMBER ANGKA */}
          <div>
            <h4 className="figma-footer-col-title">SUMBER ANGKA</h4>
            <ul className="figma-footer-list">
              <li>
                <a
                  href="https://dashboard-bpkd.jakarta.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dashboard Keuangan BPKD
                </a>
              </li>
              <li>LKIP Dinas Lingkungan Hidup 2025</li>
              <li>Diambil 21 Oktober 2026</li>
            </ul>
          </div>
        </div>

        {/* Attribution Baris Bawah */}
        <div className="figma-footer-attribution">
          Foto: Gunawan Kartapranata (CC BY-SA 3.0), Pemerintah Indonesia (domain publik), Lima_Em_Railfans (CC BY-SA 3.0), Akhmad Fauzi (CC BY 3.0). Sumber: Wikimedia Commons.
        </div>
      </div>
    </footer>
  );
};
