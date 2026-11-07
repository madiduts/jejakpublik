import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="figma-navbar" role="banner">
      <div className="figma-navbar-inner">
        {/* Brand: "J E J A K" di atas "Publik" */}
        <Link to="/" className="figma-brand" aria-label="JejakPublik Beranda">
          <span className="figma-brand-jejak">J E J A K</span>
          <span className="figma-brand-publik">Publik</span>
        </Link>

        {/* Navigation Items sesuai Frame Figma */}
        <nav className="figma-nav-links" aria-label="Navigasi Utama">
          <NavLink
            to="/jelajahi"
            className={({ isActive }) => `figma-nav-item ${isActive ? 'active' : ''}`}
          >
            Jelajahi Data
          </NavLink>
          <NavLink
            to="/panduan"
            className={({ isActive }) => `figma-nav-item ${isActive ? 'active' : ''}`}
          >
            Panduan
          </NavLink>
          <NavLink
            to="/istilah"
            className={({ isActive }) => `figma-nav-item ${isActive ? 'active' : ''}`}
          >
            Glosarium
          </NavLink>
          <NavLink to="/tentang" className="figma-nav-pill">
            Tentang <span>&rarr;</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
