const KEY = 'jp.session.v1';

export interface Session { name: string; role: 'moderator' }

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(name: string): Session {
  const s: Session = { name, role: 'moderator' };
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* diabaikan */ }
  return s;
}

export function signOut(): void {
  try { localStorage.removeItem(KEY); } catch { /* diabaikan */ }
}
