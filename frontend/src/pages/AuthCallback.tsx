import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell';
import { signIn } from '../lib/session';

export const AuthCallback: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name') || '';
    const email = params.get('email') || '';
    const role = (params.get('role') as 'warga' | 'moderator') || 'warga';
    const err = params.get('error');

    if (err) {
      setError(`Otorisasi Google gagal: ${err}`);
      return;
    }

    if (!token) {
      setError('Token otentikasi Google tidak ditemukan dalam respon.');
      return;
    }

    // Simpan sesi autentikasi
    signIn({
      name: name || (email ? email.split('@')[0] : 'Pengguna Google'),
      email,
      role,
      token
    });

    // Ambil redirect tujuan atau kembali ke beranda/laporan
    const returnTo = sessionStorage.getItem('jp.auth.redirect') || '/laporan-saya';
    sessionStorage.removeItem('jp.auth.redirect');
    navigate(returnTo, { replace: true });
  }, [params, navigate]);

  return (
    <AuthShell>
      <p className="au-crumb"><span>Akun</span><span>·</span><b>Google OAuth</b></p>

      <div className="au-h1wrap">
        <h1 className="au-h1">
          {error ? 'Gagal Masuk dengan Google' : 'Menghubungkan Akun Google…'}
        </h1>
      </div>

      <div className="au-descwrap">
        <p className="au-desc">
          {error
            ? error
            : 'Mohon tunggu sebentar, kami sedang memverifikasi identitas akun Google kamu.'}
        </p>
      </div>

      {error ? (
        <div style={{ marginTop: 24 }}>
          <Link to="/masuk" className="au-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Kembali ke Halaman Masuk
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, color: '#1B4332' }}>
          <div
            style={{
              width: 24,
              height: 24,
              border: '3px solid #1B4332',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Memproses tiket sesi…</span>
        </div>
      )}
    </AuthShell>
  );
};

export default AuthCallback;
