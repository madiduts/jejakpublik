import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NavIds, NAV_203 } from '../../lib/frameIds';

const LINKS = [
  { label: 'Beranda', to: '/' },
  { label: 'Jelajahi Data', to: '/jelajahi' },
  { label: 'Panduan', to: '/panduan' },
  { label: 'Tentang', to: '/tentang' },
];

export const Navbar: React.FC<{ ids?: NavIds }> = ({ ids = NAV_203 }) => (
  <header className="lp-head" data-node-id={ids.head}>
    <Link to="/" className="lp-brand" data-node-id={ids.brand}>
      <span data-node-id={ids.brandText}>JejakPublik</span>
    </Link>

    <nav className="lp-links" data-node-id={ids.links} aria-label="Navigasi utama">
      {LINKS.map((l, i) => {
        const it = ids.items[i];
        const link = (
          <NavLink to={l.to} end={l.to === '/'} data-node-id={it.text}>{l.label}</NavLink>
        );
        return it.outer ? (
          <span key={l.to} className="lp-link-outer" data-node-id={it.outer}>
            <span className="lp-link-active" data-node-id={it.wrap} style={{ width: it.w }}>{link}</span>
          </span>
        ) : (
          <span key={l.to} data-node-id={it.wrap} style={{ width: it.w }}>{link}</span>
        );
      })}
    </nav>

    <div className="lp-gap" data-node-id={ids.gap} style={{ height: 1 }} />

    {ids.iconGlyph ? (
      <Link to="/jelajahi" className="lp-searchic" data-node-id={ids.icon} aria-label="Cari instansi">
        <span className="lp-searchglyph" data-node-id={ids.iconGlyph}>⚲</span>
      </Link>
    ) : (
    <Link to="/jelajahi" aria-label="Cari instansi" style={{ display: 'flex' }}>
      <svg
        data-node-id={ids.icon}
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
    )}

    <Link to="/lapor" className="lp-cta" data-node-id={ids.cta}>
      <span data-node-id={ids.ctaText}>Lapor Anggaran</span>
    </Link>
  </header>
);
