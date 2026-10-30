import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="topbar" role="banner">
      <div className="wrap">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="JejakPublik Beranda">
          <ShieldCheck size={28} color="#2DD4BF" aria-hidden="true" />
          <div>
            JejakPublik
            <small>Menelusuri Penggunaan Uang Publik</small>
          </div>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        >
          {isOpen ? <X size={22} color="#FFFFFF" /> : <Menu size={22} color="#FFFFFF" />}
        </button>

        <nav
          className={`topnav ${isOpen ? 'open' : ''}`}
          aria-label="Navigasi Utama"
        >
          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Beranda
          </NavLink>
          <NavLink
            to="/instansi/lingkungan-hidup"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Dinas LH (Detail)
          </NavLink>
          <NavLink
            to="/istilah"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Penjelasan Istilah
          </NavLink>
          <NavLink
            to="/tentang"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Tentang & Keterbatasan
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
