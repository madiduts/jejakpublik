import React from 'react';
import { Navbar } from './Navbar';

/**
 * Kerangka tiga layar akun (masuk, daftar, lupa kata sandi).
 * Kepalanya memakai Navbar bersama supaya sama dengan halaman lain; isi panel
 * mengikuti frame 14 Masuk (163:2): foto 520 px, kolom formulir 560 px, kaki ringkas.
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

    <div className="au-footwrap">
      <footer className="au-foot">
        <span className="au-foot-brand">JejakPublik</span>
        <div className="au-foot-legal" />
      </footer>
    </div>
  </div>
);
