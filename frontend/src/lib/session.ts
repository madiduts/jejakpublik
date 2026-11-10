const KEY = 'jp.session.v1';

export interface Session {
  name: string;
  email?: string;
  role: 'warga' | 'moderator';
  token?: string;
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(
  user: string | { name: string; email?: string; role?: 'warga' | 'moderator'; token?: string }
): Session {
  const s: Session =
    typeof user === 'string'
      ? {
          name: user,
          email: user,
          role: user.toLowerCase().includes('mod') ? 'moderator' : 'warga'
        }
      : {
          name: user.name || (user.email ? user.email.split('@')[0] : 'Pengguna'),
          email: user.email,
          role: user.role || 'warga',
          token: user.token
        };

  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* diabaikan */
  }
  return s;
}

export function signOut(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* diabaikan */
  }
}
