import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const LINKS = [
  { label: 'Jelajahi Data', to: '/jelajahi' },
  { label: 'Panduan', to: '/panduan' },
  { label: 'Glosarium', to: '/istilah' },
  { label: 'Tentang', to: '/tentang' },
];

/**
 * Kerangka tiga layar akun (masuk, daftar, lupa kata sandi) mengikuti frame
 * 14 Masuk (163:2): kepala 94 px, panel foto 520 px, panel formulir, kaki ringkas.
 */
export const AuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="au">
    <header className="au-head">
      <Link to="/" className="au-brand">JejakPublik</Link>
      <nav className="au-links" aria-label="Navigasi utama">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
        ))}
      </nav>
      <Link to="/lapor" className="au-cta">
        <span className="au-cta-dot" aria-hidden="true" />
        Lapor
      </Link>
    </header>

    <div className="au-body">
      <aside className="au-photo">
        <div className="au-photo-img" aria-hidden="true" />
        <div className="au-photo-shade" aria-hidden="true" />
        <div className="au-photo-text">
          <p className="au-eyebrow">Akun JejakPublik</p>
          <p className="au-lede">
            Akun hanya diperlukan untuk mengirim laporan. Membaca seluruh data anggaran tidak memerlukan akun.
          </p>
        </div>
      </aside>

      <main className="au-panel">{children}</main>
    </div>

    <footer className="au-foot">
      <span className="au-foot-brand">JejakPublik</span>
    </footer>
  </div>
);
