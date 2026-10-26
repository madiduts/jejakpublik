import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="topbar">
      <div className="wrap">
        <Link to="/" className="brand">
          <ShieldCheck size={26} color="#2DD4BF" />
          <div>
            JejakPublik
            <small>Menelusuri Penggunaan Uang Publik</small>
          </div>
        </Link>
        <nav className="topnav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Beranda
          </NavLink>
          <NavLink to="/instansi/lingkungan-hidup" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dinas LH (Detail)
          </NavLink>
          <NavLink to="/istilah" className={({ isActive }) => (isActive ? 'active' : '')}>
            Penjelasan Istilah
          </NavLink>
          <NavLink to="/tentang" className={({ isActive }) => (isActive ? 'active' : '')}>
            Tentang & Keterbatasan
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
