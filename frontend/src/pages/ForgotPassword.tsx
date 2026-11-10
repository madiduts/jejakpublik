import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../components/layout/AuthShell';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <AuthShell>
      <p className="au-crumb"><span>Akun</span><span>·</span><b>Lupa kata sandi</b></p>

      <div className="au-h1wrap">
        <h1 className="au-h1">Setel ulang kata sandi</h1>
      </div>

      <div className="au-descwrap">
        <p className="au-desc">
          Masukkan alamat email yang kamu pakai mendaftar. Kami akan mengirim tautan untuk menyetel ulang kata sandi ke alamat itu.
        </p>
      </div>

      {sent ? (
        <div className="au-done">
          <p className="au-done-h">Permintaan dicatat untuk {email.trim()}</p>
          <p className="au-done-p">
            Pada versi prototipe belum ada layanan surat keluar, jadi tautan setel ulang tidak benar-benar dikirim.
            Untuk mencoba alurnya, kembali ke halaman masuk dan gunakan kata sandi apa pun.
          </p>
          <Link className="au-btn au-btn-inline" to="/masuk">Kembali ke masuk</Link>
        </div>
      ) : (
        <form
          className="au-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="au-field">
            <label className="au-label" htmlFor="email">Alamat email</label>
            <p className="au-hint" id="email-hint">Alamat yang terdaftar pada akunmu.</p>
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

          <button className="au-btn" type="submit">
            Kirim tautan
            <span aria-hidden="true">→</span>
          </button>
        </form>
      )}

      {!sent && (
        <div className="au-linksrow au-linksrow-left">
          <Link to="/masuk">Kembali ke masuk</Link>
        </div>
      )}

      <div className="au-notewrap">
        <p className="au-note">
          Demi keamanan, halaman ini tidak memberi tahu apakah sebuah alamat email terdaftar atau tidak.
        </p>
      </div>
    </AuthShell>
  );
};
