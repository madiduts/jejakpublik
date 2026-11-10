import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell';
import { GoogleButton } from '../components/auth/GoogleButton';
import { getSession, signIn } from '../lib/session';
import { redirectTarget } from '../lib/redirect';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = redirectTarget(location.state);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [ulang, setUlang] = useState('');
  const [beda, setBeda] = useState(false);
  const [googleMsg, setGoogleMsg] = useState('');
  const [googleBusy, setGoogleBusy] = useState(false);

  if (getSession()) return <Navigate to={from} replace />;

  const enter = (who: string) => {
    signIn(who);
    navigate(from, { replace: true });
  };

  return (
    <AuthShell>
      <p className="au-crumb"><span>Akun</span><span>·</span><b>Daftar</b></p>

      <div className="au-h1wrap">
        <h1 className="au-h1">Buat akun untuk mengirim laporan</h1>
      </div>

      <div className="au-descwrap">
        <p className="au-desc">
          Cukup alamat email dan kata sandi. Setelah akun dibuat, kamu langsung kembali ke halaman laporan yang tadi kamu buka.
        </p>
      </div>

      <form
        className="au-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (pass !== ulang) {
            setBeda(true);
            return;
          }
          setBeda(false);
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
          <label className="au-label au-label-pad" htmlFor="kunci">Kata sandi</label>
          <p className="au-hint" id="kunci-hint">Minimal 8 karakter.</p>
          <input
            id="kunci"
            className="au-input"
            type="password"
            name="kunci"
            autoComplete="new-password"
            required
            minLength={8}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            aria-describedby="kunci-hint"
          />
        </div>

        <div className="au-field">
          <label className="au-label" htmlFor="ulang">Ulangi kata sandi</label>
          <input
            id="ulang"
            className="au-input"
            type="password"
            name="ulang"
            autoComplete="new-password"
            required
            minLength={8}
            value={ulang}
            onChange={(e) => { setUlang(e.target.value); setBeda(false); }}
            aria-invalid={beda}
            aria-describedby={beda ? 'ulang-salah' : undefined}
          />
          {beda && <p className="au-msg" id="ulang-salah" role="alert">Kata sandi dan ulangannya belum sama.</p>}
        </div>

        <div className="au-linksrow">
          <span>
            Sudah punya akun? <Link className="au-link-strong" to="/masuk">Masuk</Link>
          </span>
        </div>

        <button className="au-btn" type="submit">
          Buat akun
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <div className="au-or" role="separator" aria-hidden="true"><span>atau</span></div>

      <GoogleButton
        label="Daftar dengan Google"
        busy={googleBusy}
        onStart={() => { setGoogleMsg(''); setGoogleBusy(true); }}
        onDone={(who) => enter(who)}
        onError={(msg) => setGoogleMsg(msg)}
        onSettled={() => setGoogleBusy(false)}
      />
      {googleMsg && <p className="au-msg" role="status">{googleMsg}</p>}

      <div className="au-notewrap">
        <p className="au-note">
          Akun hanya dipakai untuk mengirim dan memantau laporan. JejakPublik tidak meminta NIK, foto KTP, atau swafoto.
        </p>
      </div>
    </AuthShell>
  );
};
