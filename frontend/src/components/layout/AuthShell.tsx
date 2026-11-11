import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * Kerangka layar akun (masuk, daftar, lupa kata sandi).
 * Memakai Navbar dan Footer bersama agar konsisten dengan halaman lain.
 */
export const AuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="au">
    <Navbar />

    <div className="au-body">
      <aside className="au-photo">
        <div className="au-photo-img" aria-hidden="true" />
        <div className="au-photo-shade" aria-hidden="true" />
        <div className="au-photo-text">
          <p className="au-eyebrow">Akun JejakPublik</p>
          <div className="au-ledewrap">
            <p className="au-lede">
              Akun hanya diperlukan untuk mengirim laporan. Membaca seluruh data anggaran tidak memerlukan akun.
            </p>
          </div>
        </div>
      </aside>

      <main className="au-panel">{children}</main>
    </div>

    <Footer />
  </div>
);
