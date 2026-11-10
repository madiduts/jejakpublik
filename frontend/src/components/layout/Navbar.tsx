import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const LINKS = [
  { label: 'Beranda', to: '/', wrap: '203:8', text: '203:9', w: 51 },
  { label: 'Jelajahi Data', to: '/jelajahi', wrap: '203:11', text: '203:12', w: 79 },
  { label: 'Panduan', to: '/panduan', wrap: '203:13', text: '203:14', w: 54 },
  { label: 'Tentang', to: '/tentang', wrap: '203:15', text: '203:16', w: 50 },
];

export const Navbar: React.FC = () => (
  <header className="lp-head" data-node-id="203:3">
    <Link to="/" className="lp-brand" data-node-id="203:4">
      <span data-node-id="203:5">JejakPublik</span>
    </Link>

    <nav className="lp-links" data-node-id="203:7" aria-label="Navigasi utama">
      {LINKS.map((l) => (
        <span key={l.to} data-node-id={l.wrap} style={{ width: l.w }}>
          <NavLink to={l.to} end={l.to === '/'} data-node-id={l.text}>{l.label}</NavLink>
        </span>
      ))}
    </nav>

    <div className="lp-gap" data-node-id="203:17" style={{ height: 1 }} />

    <Link to="/jelajahi" aria-label="Cari instansi" style={{ display: 'flex' }}>
      <svg
        data-node-id="203:18"
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        role="img"
        aria-hidden="true"
        style={{ border: '1px solid #E7E7EA', borderRadius: 17, background: '#fff', display: 'block' }}
      >
        <g transform="translate(9.5 9.5) scale(0.625)" stroke="#52525C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>
      </svg>
    </Link>

    <Link to="/lapor" className="lp-cta" data-node-id="203:21">
      <span data-node-id="203:22">Lapor Anggaran</span>
    </Link>
  </header>
);
