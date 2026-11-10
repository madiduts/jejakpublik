import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_223, FOOT_223 } from '../lib/frameIds';
import { getSession, signIn } from '../lib/session';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/lapor';

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [notice, setNotice] = useState(false);

  if (getSession()) return <Navigate to={from} replace />;

  return (
    <div className="lp" data-figma-root data-node-id="223:2">
      <Navbar ids={NAV_223} />

      <section className="lg-split" data-node-id="223:24">
        <aside className="lg-photo" data-node-id="223:25">
          <div className="lg-photo-img" aria-hidden="true" />
          <div className="lg-photo-shade" aria-hidden="true" />
          <div className="lg-eyebrowwrap" data-node-id="223:29">
            <p className="lg-eyebrow" data-node-id="223:30">Akun JejakPublik</p>
          </div>
          <div className="lg-ledewrap" data-node-id="223:35">
            <p className="lg-lede" data-node-id="223:33">
              Akun hanya diperlukan untuk mengirim laporan. Membaca seluruh data anggaran tidak memerlukan akun.
            </p>
          </div>
        </aside>

        <div className="lg-panel" data-node-id="223:36">
          <div className="lg-crumbwrap" data-node-id="223:37">
            <p className="lg-crumb" data-node-id="223:38">Laporan · Masuk</p>
          </div>

          <div className="lg-h1wrap" data-node-id="223:40">
            <h1 className="lg-h1" data-node-id="223:41">Masuk untuk mengirim laporan</h1>
          </div>

          <div className="lg-descwrap" data-node-id="223:43">
            <p className="lg-desc" data-node-id="223:44">
              Setelah masuk, kamu kembali ke halaman laporan yang tadi kamu buka.
            </p>
          </div>

          <form
            className="lg-form"
            noValidate={false}
            onSubmit={(e) => {
              e.preventDefault();
              signIn(email.trim());
              navigate(from, { replace: true });
            }}
          >
            <div className="lg-group" data-node-id="223:46">
              <div className="lg-labelwrap" data-node-id="223:47">
                <label className="lg-label" data-node-id="223:48" htmlFor="email">Alamat email</label>
              </div>
              <div className="lg-hintwrap" data-node-id="223:50">
                <span className="lg-hint" data-node-id="223:51">Dipakai untuk kabar status laporan.</span>
              </div>
              <input
                id="email"
                className="lg-input"
                data-node-id="223:53"
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

            <div className="lg-group2" data-node-id="223:57">
              <div className="lg-labelwrap2" data-node-id="223:58">
                <label className="lg-label2" data-node-id="223:59" htmlFor="kunci">Kata sandi</label>
              </div>
              <input
                id="kunci"
                className="lg-input2"
                data-node-id="223:60"
                type="password"
                name="kunci"
                autoComplete="current-password"
                required
                minLength={8}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            <div className="lg-actions" data-node-id="223:63">
              <button className="lg-btn" data-node-id="223:64" type="submit">
                <span data-node-id="223:65">Masuk</span>
              </button>
              <button
                className="lg-btn2"
                data-node-id="223:66"
                type="button"
                onClick={() => setNotice(true)}
                aria-describedby={notice ? 'daftar-notice' : undefined}
              >
                <span data-node-id="223:67">Daftar</span>
              </button>
            </div>
          </form>

          {notice && (
            <p className="lg-alert" id="daftar-notice" role="status">
              Pendaftaran terpisah belum dibuka. Pada versi prototipe, akun dibuat saat kamu pertama kali masuk —
              isi email dan kata sandi, lalu tekan <strong>Masuk</strong>.
            </p>
          )}

          <div className="lg-notewrap" data-node-id="223:76">
            <p className="lg-note" data-node-id="223:69">
              JejakPublik tidak meminta NIK, foto KTP, atau swafoto. Identitas pelapor tidak ditampilkan ke publik.
            </p>
          </div>
        </div>
      </section>

      <Footer ids={FOOT_223} />
    </div>
  );
};
