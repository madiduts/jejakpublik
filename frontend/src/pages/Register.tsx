import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_223, FOOT_223 } from '../lib/frameIds';
import { getSession, signIn } from '../lib/session';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/lapor';

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [repeatPass, setRepeatPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (getSession()) return <Navigate to={from} replace />;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    if (pass !== repeatPass) {
      setErrorMsg('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (pass.length < 8) {
      setErrorMsg('Kata sandi minimal 8 karakter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass })
      });
      const json = await res.json();

      if (res.ok && json.success) {
        signIn({
          name: json.user?.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: json.user?.role || 'warga',
          token: json.token
        });
        navigate(from, { replace: true });
        return;
      } else {
        setErrorMsg(json.error || 'Gagal mendaftarkan akun. Email mungkin sudah digunakan.');
      }
    } catch {
      // Fallback lokal jika backend tidak terjangkau
      signIn({
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'warga'
      });
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp" data-figma-root data-node-id="22:2">
      <Navbar ids={NAV_223} />

      <section className="lg-split" data-node-id="22:24">
        <aside className="lg-photo" data-node-id="22:25">
          <div className="lg-photo-img" aria-hidden="true" />
          <div className="lg-photo-shade" aria-hidden="true" />
          <div className="lg-eyebrowwrap" data-node-id="22:29">
            <p className="lg-eyebrow" data-node-id="22:30">AKUN JEJAKPUBLIK</p>
          </div>
          <div className="lg-ledewrap" data-node-id="22:35">
            <p className="lg-lede" data-node-id="22:33">
              Akun hanya diperlukan untuk mengirim laporan. Membaca seluruh data anggaran tidak memerlukan akun.
            </p>
          </div>
        </aside>

        <div className="lg-panel" data-node-id="22:36">
          <div className="lg-crumbwrap" data-node-id="22:37">
            <p className="lg-crumb" data-node-id="22:38">AKUN › DAFTAR</p>
          </div>

          <div className="lg-h1wrap" data-node-id="22:40">
            <h1 className="lg-h1" data-node-id="22:41">Buat akun untuk mengirim laporan</h1>
          </div>

          <div className="lg-descwrap" data-node-id="22:43">
            <p className="lg-desc" data-node-id="22:44">
              Setelah membuat akun, kamu kembali ke halaman laporan yang tadi kamu buka.
            </p>
          </div>

          <form className="lg-form" onSubmit={handleRegister}>
            {/* Field 1: Alamat Email */}
            <div className="lg-group">
              <div className="lg-labelwrap">
                <label className="lg-label" htmlFor="email">ALAMAT EMAIL</label>
              </div>
              <div className="lg-hintwrap">
                <span className="lg-hint">Email dipakai untuk memberi kabar status laporan.</span>
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

            {/* Field 2: Kata Sandi */}
            <div className="lg-group" style={{ paddingTop: 16 }}>
              <div className="lg-labelwrap">
                <label className="lg-label" htmlFor="kunci">KATA SANDI</label>
              </div>
              <div className="lg-hintwrap">
                <span className="lg-hint">Minimal 8 karakter.</span>
              </div>
              <input
                id="kunci"
                className="lg-input"
                type="password"
                name="kunci"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="kata sandi"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            {/* Field 3: Ulangi Kata Sandi */}
            <div className="lg-group2" style={{ paddingTop: 16 }}>
              <div className="lg-labelwrap2">
                <label className="lg-label2" htmlFor="kunci-ulang">ULANGI KATA SANDI</label>
              </div>
              <input
                id="kunci-ulang"
                className="lg-input2"
                type="password"
                name="kunci-ulang"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="ulangi kata sandi"
                value={repeatPass}
                onChange={(e) => setRepeatPass(e.target.value)}
              />
            </div>

            {/* Tautan: Sudah punya akun? Masuk */}
            <div className="lg-links-row">
              <span>
                Sudah punya akun? <Link to="/masuk">Masuk</Link>
              </span>
            </div>

            {errorMsg && (
              <p className="lg-alert" style={{ color: '#DC2626', borderColor: '#FECACA', background: '#FEF2F2' }} role="alert">
                {errorMsg}
              </p>
            )}

            <div className="lg-actions" style={{ paddingTop: 20 }}>
              <button className="lg-btn-blue" type="submit" disabled={loading}>
                {loading ? 'Mendaftarkan...' : 'Buat akun →'}
              </button>
            </div>
          </form>

          <div className="lg-notewrap" style={{ width: '100%', maxWidth: 560 }}>
            <p className="lg-note">
              JejakPublik tidak meminta NIK, foto KTP, atau swafoto. Identitas pelapor tidak ditampilkan ke publik.
            </p>
          </div>
        </div>
      </section>

      <Footer ids={FOOT_223} />
    </div>
  );
};

export default Register;
