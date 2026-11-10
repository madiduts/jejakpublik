import React from 'react';
import { Link } from 'react-router-dom';
import { CREDITS } from '../../data/site';

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="wrap">
      <div className="cols">
        <div>
          <div className="flag">JejakPublik</div>
          <p style={{ maxWidth: 360, lineHeight: 1.6 }}>
            Platform transparansi anggaran independen untuk Provinsi DKI Jakarta.
            Kami menampilkan angka apa adanya, termasuk angka yang tidak bisa dipastikan.
          </p>
        </div>
        <div>
          <h4>Data</h4>
          <p><Link to="/jelajahi">Jelajahi 43 instansi</Link></p>
          <p><Link to="/instansi/dinas-lingkungan-hidup">Dinas Lingkungan Hidup</Link></p>
          <p><Link to="/perbandingan">Perbandingan angka</Link></p>
        </div>
        <div>
          <h4>Metode</h4>
          <p><Link to="/panduan">Panduan membaca</Link></p>
          <p><Link to="/istilah">Daftar istilah</Link></p>
          <p><Link to="/tentang">Sumber dan lisensi</Link></p>
        </div>
        <div>
          <h4>Partisipasi</h4>
          <p><Link to="/lapor">Lapor angka salah</Link></p>
          <p><Link to="/laporan-saya">Laporan saya</Link></p>
          <p><Link to="/moderator">Ruang moderator</Link></p>
        </div>
      </div>
      <div className="legal">
        <span>Data: BPKD DKI Jakarta, LKIP 2025, dashboard-bpkd.jakarta.go.id</span>
        <span>{CREDITS.map((c) => `${c.name} (${c.license})`).join(' · ')}</span>
      </div>
    </div>
  </footer>
);
