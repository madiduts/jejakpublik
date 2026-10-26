export function formatRupiah(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === '') return 'Rp0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return 'Rp0';
  return 'Rp' + Math.round(num).toLocaleString('id-ID');
}

export function formatRupiahShort(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === '') return 'Rp0';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return 'Rp0';

  if (Math.abs(num) >= 1e12) {
    return 'Rp' + (num / 1e12).toFixed(2).replace('.', ',') + ' T';
  }
  if (Math.abs(num) >= 1e9) {
    return 'Rp' + (num / 1e9).toFixed(2).replace('.', ',') + ' M';
  }
  if (Math.abs(num) >= 1e6) {
    return 'Rp' + (num / 1e6).toFixed(1).replace('.', ',') + ' Jt';
  }
  return formatRupiah(num);
}

export function formatPersen(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === '') return '-';
  if (typeof val === 'string') {
    if (val.includes('%')) return val;
    const n = parseFloat(val.replace(',', '.'));
    return isNaN(n) ? '-' : n.toFixed(2).replace('.', ',') + '%';
  }
  return val.toFixed(2).replace('.', ',') + '%';
}
