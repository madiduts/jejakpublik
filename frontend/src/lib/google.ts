/**
 * Masuk dengan Google memakai Google Identity Services.
 *
 * Prasyarat: isi `VITE_GOOGLE_CLIENT_ID` dengan OAuth 2.0 Web Client ID yang
 * sudah mendaftarkan origin aplikasi ini. Tanpa nilai itu tombolnya memberi
 * keterangan, bukan diam saja.
 */

export const GOOGLE_CLIENT_ID = ((import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? '').trim();

export const googleConfigured = (): boolean => GOOGLE_CLIENT_ID.length > 0;

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (cfg: { client_id: string; callback: (r: GoogleCredentialResponse) => void }) => void;
      prompt: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

/** Pembungkus executor sekali di sini, supaya pemanggil memakai alur lurus. */
function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

let pending: Promise<void> | null = null;

export function loadGoogleScript(): Promise<void> {
  if (pending) return pending;
  const { promise, resolve, reject } = deferred<void>();
  if (window.google) {
    pending = Promise.resolve();
    return pending;
  }
  const el = document.createElement('script');
  el.src = 'https://accounts.google.com/gsi/client';
  el.async = true;
  el.defer = true;
  el.onload = () => resolve();
  el.onerror = () => {
    pending = null;
    reject(new Error('Skrip Google tidak dapat dimuat'));
  };
  document.head.appendChild(el);
  pending = promise;
  return promise;
}

/** Membaca klaim dari ID token (JWT) yang dikembalikan Google. */
export function readIdToken(token: string): { email?: string; name?: string } {
  const part = token.split('.')[1];
  if (!part) throw new Error('ID token tidak berbentuk JWT');
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const json = JSON.parse(new TextDecoder().decode(bytes)) as { email?: string; name?: string };
  return { email: json.email, name: json.name };
}

export interface GoogleResult {
  email: string;
  name?: string;
}

/** Menjalankan alur Google; menolak dengan pesan yang bisa ditampilkan. */
export async function signInWithGoogle(): Promise<GoogleResult> {
  if (!googleConfigured()) {
    throw new Error('Masuk dengan Google belum aktif: VITE_GOOGLE_CLIENT_ID belum diisi.');
  }
  await loadGoogleScript();
  const g = window.google;
  if (!g?.accounts?.id) throw new Error('Google Identity Services tidak tersedia di peramban ini.');

  const { promise, resolve, reject } = deferred<GoogleResult>();
  g.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (res) => {
      if (!res.credential) {
        reject(new Error('Jendela Google ditutup sebelum memilih akun.'));
        return;
      }
      try {
        const { email, name } = readIdToken(res.credential);
        if (!email) {
          reject(new Error('Google tidak mengirim alamat email.'));
          return;
        }
        resolve({ email, name });
      } catch (e) {
        reject(e instanceof Error ? e : new Error('ID token tidak dapat dibaca.'));
      }
    },
  });
  g.accounts.id.prompt();
  return promise;
}
