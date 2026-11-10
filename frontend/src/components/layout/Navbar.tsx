import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Ico } from '../detail/icons';
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

    <Link to="/jelajahi" className="lp-searchic" data-node-id={ids.icon} aria-label="Cari instansi">
      <Ico g="search" slot={16} />
    </Link>

    <Link to="/lapor" className="lp-cta" data-node-id={ids.cta}>
      <span data-node-id={ids.ctaText}>Lapor Anggaran</span>
    </Link>
  </header>
);
