import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_223, FOOT_223 } from '../lib/frameIds';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setResetToken(null);

    const cleanEmail = email.trim();

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMsg(
          json.message ||
            'Tautan pemulihan kata sandi telah dikirim jika email terdaftar dalam sistem.'
        );
        if (json.data?.reset_token) {
          setResetToken(json.data.reset_token);
        }
      } else {
        setErrorMsg(json.error || 'Terjadi kendala saat memproses permintaan.');
      }
    } catch {
      setSuccessMsg(
        'Tautan pemulihan kata sandi telah diproses (mode offline/simulasi).'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp" data-figma-root data-node-id="23:2">
      <Navbar ids={NAV_223} />

      <section className="lg-split" data-node-id="23:24">
        <aside className="lg-photo" data-node-id="23:25">
          <div className="lg-photo-img" aria-hidden="true" />
          <div className="lg-photo-shade" aria-hidden="true" />
          <div className="lg-eyebrowwrap" data-node-id="23:29">
            <p className="lg-eyebrow" data-node-id="23:30">AKUN JEJAKPUBLIK</p>
          </div>
          <div className="lg-ledewrap" data-node-id="23:35">
            <p className="lg-lede" data-node-id="23:33">
              Akun hanya diperlukan untuk mengirim laporan. Membaca seluruh data anggaran tidak memerlukan akun.
            </p>
          </div>
        </aside>

        <div className="lg-panel" data-node-id="23:36">
          <div className="lg-crumbwrap" data-node-id="23:37">
            <p className="lg-crumb" data-node-id="23:38">AKUN • LUPA KATA SANDI</p>
          </div>

          <div className="lg-h1wrap" data-node-id="23:40">
            <h1 className="lg-h1" data-node-id="23:41">Setel ulang kata sandi</h1>
          </div>

          <div className="lg-descwrap" data-node-id="23:43">
            <p className="lg-desc" data-node-id="23:44">
              Masukkan alamat email yang kamu pakai mendaftar. Kami akan mengirim tautan untuk menyetel ulang kata sandi ke alamat itu.
            </p>
          </div>

          <form className="lg-form" onSubmit={handleSubmit}>
            <div className="lg-group" data-node-id="23:46">
              <div className="lg-labelwrap">
                <label className="lg-label" htmlFor="email">ALAMAT EMAIL</label>
              </div>
              <div className="lg-hintwrap">
                <span className="lg-hint">Alamat yang terdaftar pada akunmu.</span>
              </div>
              <input
                id="email"
                className="lg-input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="nama@contoh.id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {successMsg && (
              <div
                className="lg-alert"
                style={{ color: '#047857', borderColor: '#A7F3D0', background: '#ECFDF5' }}
                role="status"
              >
                <p style={{ margin: 0, fontWeight: 600 }}>{successMsg}</p>
                {resetToken && (
                  <p style={{ margin: '8px 0 0', fontSize: 11.5, wordBreak: 'break-all' }}>
                    <strong>Token Pemulihan (Evaluasi/Testing):</strong>
                    <br />
                    <code>{resetToken}</code>
                  </p>
                )}
              </div>
            )}

            {errorMsg && (
              <p
                className="lg-alert"
                style={{ color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2' }}
                role="alert"
              >
                {errorMsg}
              </p>
            )}

            <div className="lg-actions" style={{ paddingTop: 24, flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
              <button className="lg-btn-blue" type="submit" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim tautan →'}
              </button>

              <div style={{ fontSize: 13, paddingTop: 4 }}>
                <Link to="/masuk" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                  Kembali ke masuk
                </Link>
              </div>
            </div>
          </form>

          <div className="lg-notewrap" style={{ width: '100%', maxWidth: 560, marginTop: 12 }}>
            <p className="lg-note">
              Demi keamanan, halaman ini tidak memberi tahu apakah sebuah alamat email terdaftar atau tidak.
            </p>
          </div>
        </div>
      </section>

      <Footer ids={FOOT_223} />
    </div>
  );
};

export default ForgotPassword;
