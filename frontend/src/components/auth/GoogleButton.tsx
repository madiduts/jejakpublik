import React from 'react';
import { signInWithGoogle } from '../../lib/google';

/** Tombol Google dengan lambang G resmi (empat warna). */
export const GoogleMark: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

interface Props {
  label: string;
  busy: boolean;
  onStart: () => void;
  onDone: (email: string) => void;
  onError: (message: string) => void;
  onSettled: () => void;
}

export const GoogleButton: React.FC<Props> = ({ label, busy, onStart, onDone, onError, onSettled }) => (
  <button
    type="button"
    className="au-btn-google"
    disabled={busy}
    onClick={async () => {
      onStart();
      try {
        // Simpan target asal sebelum beralih
        const currentPath = window.location.pathname;
        if (currentPath !== '/masuk' && currentPath !== '/daftar') {
          sessionStorage.setItem('jp.auth.redirect', currentPath);
        }

        // 1. Coba OAuth 2.0 Web redirect via backend (langsung membuka pemilih akun Google resmi)
        const res = await fetch('http://localhost:3000/api/v1/auth/google/url');
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.auth_url) {
            window.location.href = json.data.auth_url;
            return;
          }
        }

        // 2. Cadangan GSI lokal
        const { email } = await signInWithGoogle();
        onDone(email);
      } catch (e) {
        onError(e instanceof Error ? e.message : 'Masuk dengan Google gagal.');
      } finally {
        onSettled();
      }
    }}
  >
    <GoogleMark />
    {busy ? 'Menghubungkan ke Google…' : label}
  </button>
);
