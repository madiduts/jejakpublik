import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell';
import { GoogleButton } from '../components/auth/GoogleButton';
import { getSession, signIn } from '../lib/session';
import { redirectTarget } from '../lib/redirect';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = redirectTarget(location.state);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [googleMsg, setGoogleMsg] = useState('');
  const [googleBusy, setGoogleBusy] = useState(false);

  if (getSession()) return <Navigate to={from} replace />;

  const enter = (who: string) => {
    signIn(who);
    navigate(from, { replace: true });
  };

  return (
    <AuthShell>
      <p className="au-crumb">Laporan · Masuk</p>

      <h1 className="au-h1">Masuk untuk mengirim laporan</h1>

      <p className="au-desc">
        Gunakan email dan kata sandi yang kamu daftarkan. Setelah masuk, kamu kembali ke halaman laporan yang tadi kamu buka.
      </p>

      <form
        className="au-form"
        onSubmit={(e) => {
          e.preventDefault();
          enter(email.trim());
        }}
      >
        <div className="au-field">
          <label className="au-label" htmlFor="email">Alamat email</label>
          <p className="au-hint" id="email-hint">Email dipakai untuk memberi kabar status laporan.</p>
          <input
            id="email"
            className="au-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="nama@contoh.id"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="email-hint"
          />
        </div>

        <div className="au-field">
          <label className="au-label" htmlFor="kunci">Kata sandi</label>
          <input
            id="kunci"
            className="au-input"
            type="password"
            name="kunci"
            autoComplete="current-password"
            required
            minLength={8}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>

        <div className="au-linksrow">
          <span>
            Belum punya akun? <Link className="au-link-strong" to="/daftar">Daftar</Link>
          </span>
          <Link to="/lupa-kata-sandi">Lupa kata sandi</Link>
        </div>

        <button className="au-btn" type="submit">
          Masuk
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="au-or" role="separator" aria-hidden="true"><span>atau</span></div>

      <GoogleButton
        label="Masuk dengan Google"
        busy={googleBusy}
        onStart={() => { setGoogleMsg(''); setGoogleBusy(true); }}
        onDone={(who) => enter(who)}
        onError={(msg) => setGoogleMsg(msg)}
        onSettled={() => setGoogleBusy(false)}
      />
      {googleMsg && <p className="au-msg" role="status">{googleMsg}</p>}

      <p className="au-note">
        JejakPublik tidak meminta NIK, foto KTP, atau swafoto. Identitas pelapor tidak ditampilkan ke publik.
      </p>
    </AuthShell>
  );
};
