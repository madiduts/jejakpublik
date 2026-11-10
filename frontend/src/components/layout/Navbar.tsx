import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { NAV } from '../../data/site';

export const Navbar: React.FC = () => {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>Sumber data resmi: <b>APBD &amp; LKIP TA 2025</b> · diambil 21 Oktober 2026</span>
          <span><Link to="/tentang">Metodologi</Link> · <Link to="/masuk">Masuk</Link></span>
        </div>
      </div>
      <header className="nav">
        <div className="wrap">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">J</span>JejakPublik
          </Link>
          <nav className="navlinks" aria-label="Navigasi utama">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <form
              onSubmit={(e) => { e.preventDefault(); navigate(`/jelajahi?q=${encodeURIComponent(q)}`); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <label className="search" style={{ flex: '1 1 150px', maxWidth: 220 }}>
                <span className="sr" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Cari instansi</span>
                <Search size={16} aria-hidden="true" />
                <input className="input" style={{ height: 36, fontSize: 13 }} placeholder="Cari instansi…" value={q} onChange={(e) => setQ(e.target.value)} />
              </label>
            </form>
            <Link className="btn btn-primary" to="/lapor">Lapor Anggaran</Link>
          </div>
        </div>
      </header>
    </>
  );
};
