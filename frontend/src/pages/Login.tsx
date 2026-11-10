import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, Notice, PageHead } from '../components/ui';
import { signIn, getSession, signOut } from '../lib/session';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('moderator');
  const current = getSession();

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Masuk' }]}>
      <div className="wrap page" style={{ maxWidth: 620 }}>
        <PageHead eyebrow="Akses" title="Masuk" desc="Ruang moderator memerlukan sesi. Versi prototipe membuka sesi lokal tanpa kata sandi server." />
        <Card>
          <CardHead title={current ? 'Sudah masuk' : 'Masuk sebagai moderator'} sub={current ? `Sesi aktif: ${current.name}` : 'Hanya untuk ruang moderator'} />
          <div className="card-pad">
            {current ? (
              <>
                <Notice tone="info" title="Sesi tersimpan di peramban ini.">Autentikasi server belum aktif; sesi ini hanya membuka ruang moderator pada perangkat yang sama.</Notice>
                <div className="rowgap" style={{ marginTop: 16 }}>
                  <button className="btn btn-primary" onClick={() => navigate('/moderator')}>Buka antrean</button>
                  <button className="btn" onClick={() => { signOut(); navigate('/masuk'); }}>Keluar</button>
                </div>
              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); signIn(name || 'moderator'); navigate('/moderator'); }}>
                <div className="field">
                  <label htmlFor="nama">Nama tampilan</label>
                  <input id="nama" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                  <span className="hint">Nama ini tampil pada jejak pemeriksaan laporan.</span>
                </div>
                <div className="field">
                  <label htmlFor="kunci">Kata sandi</label>
                  <input id="kunci" className="input" type="password" placeholder="Belum diperlukan pada versi ini" disabled />
                  <span className="hint">Autentikasi server belum diaktifkan pada versi prototipe.</span>
                </div>
                <button className="btn btn-primary" type="submit">Masuk</button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </LayoutShell>
  );
};
