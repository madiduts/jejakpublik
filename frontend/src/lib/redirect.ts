/** Tujuan pengalihan setelah masuk, dari state navigasi tanpa cast. */
export function redirectTarget(state: unknown, fallback = '/lapor'): string {
  if (state && typeof state === 'object' && 'from' in state) {
    const from = state.from;
    if (typeof from === 'string' && from.startsWith('/')) return from;
  }
  return fallback;
}
