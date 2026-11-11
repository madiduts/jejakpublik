import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut, FileText, Shield, LogIn, PlusCircle } from 'lucide-react';
import { Ico } from '../detail/icons';
import { NavIds, NAV_203 } from '../../lib/frameIds';
import { getSession, signOut } from '../../lib/session';

const LINKS = [
  { label: 'Beranda', to: '/' },
  { label: 'Jelajahi Data', to: '/jelajahi' },
  { label: 'Panduan', to: '/panduan' },
  { label: 'Tentang', to: '/tentang' },
];

export const Navbar: React.FC<{ ids?: NavIds }> = ({ ids = NAV_203 }) => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const session = getSession();

  useEffect(() => {
    if (!openProfile) return;
    const onDown = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenProfile(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openProfile]);

  const handleSignOut = () => {
    signOut();
    setOpenProfile(false);
    navigate('/', { replace: true });
  };

  const initial = session?.name ? session.name.charAt(0).toUpperCase() : 'U';
  const isMod = session?.role === 'moderator';

  return (
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

      {/* 1. Ikon Search */}
      <Link to="/jelajahi" className="lp-searchic" data-node-id={ids.icon} aria-label="Cari instansi">
        <Ico g="search" slot={16} />
      </Link>

      {/* 2. Ikon Profil Akun dengan Anchored Popover Bubble */}
      <div className="lp-profile-anchor" ref={popoverRef}>
        <button
          type="button"
          className={`lp-profile-btn${openProfile ? ' active' : ''}`}
          onClick={() => setOpenProfile((prev) => !prev)}
          aria-expanded={openProfile}
          aria-haspopup="menu"
          aria-label="Profil dan Akun Pengguna"
        >
          {session ? (
            <>
              <span className={`lp-profile-avatar${isMod ? ' mod' : ''}`}>{initial}</span>
              <span className="lp-profile-online" />
            </>
          ) : (
            <User size={16} strokeWidth={2.2} />
          )}
        </button>

        {openProfile && (
          <div className="lp-profile-bubble" role="menu">
            {session ? (
              <>
                <div className="lp-bubble-usercard">
                  <span
                    className={`lp-profile-avatar${isMod ? ' mod' : ''}`}
                    style={{ width: 34, height: 34, borderRadius: 17, fontSize: 13 }}
                  >
                    {initial}
                  </span>
                  <div className="lp-bubble-userinfo">
                    <span className="lp-bubble-name">{session.name}</span>
                    <span className="lp-bubble-email">{session.email || 'Pengguna Terdaftar'}</span>
                    <span className={`lp-bubble-role${isMod ? ' mod' : ''}`}>
                      {isMod ? '🛡️ Moderator' : '👤 Warga Terdaftar'}
                    </span>
                  </div>
                </div>

                <div className="lp-bubble-divider" />

                <div className="lp-bubble-menu">
                  {isMod ? (
                    <>
                      <Link
                        to="/moderator"
                        className="lp-bubble-item"
                        role="menuitem"
                        onClick={() => setOpenProfile(false)}
                      >
                        <Shield size={15} />
                        <span>Antrean Verifikasi</span>
                      </Link>
                      <Link
                        to="/jelajahi"
                        className="lp-bubble-item"
                        role="menuitem"
                        onClick={() => setOpenProfile(false)}
                      >
                        <FileText size={15} />
                        <span>Audit Data Instansi</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/laporan-saya"
                        className="lp-bubble-item"
                        role="menuitem"
                        onClick={() => setOpenProfile(false)}
                      >
                        <FileText size={15} />
                        <span>Laporan Saya</span>
                      </Link>
                      <Link
                        to="/lapor"
                        className="lp-bubble-item"
                        role="menuitem"
                        onClick={() => setOpenProfile(false)}
                      >
                        <PlusCircle size={15} />
                        <span>Lapor Anggaran Baru</span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="lp-bubble-divider" />

                <div className="lp-bubble-menu">
                  <button
                    type="button"
                    className="lp-bubble-item danger"
                    role="menuitem"
                    onClick={handleSignOut}
                  >
                    <LogOut size={15} />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="lp-bubble-unauth">
                <p className="lp-bubble-unauth-title">Akun JejakPublik</p>
                <p className="lp-bubble-unauth-desc">
                  Masuk untuk mengajukan koreksi anggaran dan memantau status tiket laporanmu.
                </p>

                <div className="lp-bubble-divider" />

                <div className="lp-bubble-menu">
                  <Link
                    to="/masuk"
                    className="lp-bubble-item"
                    role="menuitem"
                    onClick={() => setOpenProfile(false)}
                  >
                    <LogIn size={15} />
                    <span>Masuk ke Akun</span>
                  </Link>

                  <Link
                    to="/daftar"
                    className="lp-bubble-item"
                    role="menuitem"
                    onClick={() => setOpenProfile(false)}
                  >
                    <User size={15} />
                    <span>Daftar Akun Baru</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isMod ? (
        <Link
          to="/moderator"
          className="lp-cta lp-cta-mod"
          data-node-id={ids.cta}
          aria-label="Buka Antrean Moderasi"
          style={{ width: 'auto', padding: '10px 18px', gap: 6, background: '#1B4332' }}
        >
          <Shield size={15} />
          <span data-node-id={ids.ctaText}>Antrean Moderasi</span>
        </Link>
      ) : (
        <Link to="/lapor" className="lp-cta" data-node-id={ids.cta}>
          <span data-node-id={ids.ctaText}>Lapor Anggaran</span>
        </Link>
      )}
    </header>
  );
};
