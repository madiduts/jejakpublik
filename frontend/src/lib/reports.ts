export type ReportKind = 'koreksi' | 'sanggahan' | 'sumber';
export type ReportStatus = 'baru' | 'diperiksa' | 'diterima' | 'ditolak' | 'draft';

export interface ReportEvent { at: string; actor: string; action: string; note?: string }

export interface Report {
  id: string;
  kind: ReportKind;
  instansi: string;
  target: string;
  message: string;
  contact: string;
  title?: string;
  category?: string;
  docUrl?: string;
  evidenceUrls?: string[];
  status: ReportStatus;
  createdAt: string;
  events: ReportEvent[];
}

const KEY = 'jp.reports.v1';

export const KIND_LABEL: Record<ReportKind, string> = {
  koreksi: 'Angka salah',
  sanggahan: 'Penjelasan angka',
  sumber: 'Dokumen sumber baru',
};

export const STATUS_LABEL: Record<ReportStatus, string> = {
  baru: 'Menunggu pemeriksaan',
  diperiksa: 'Sedang diperiksa',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
  draft: 'Draf laporan',
};

function read(): Report[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Report[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list: Report[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* penyimpanan penuh atau diblokir: laporan tetap dikembalikan ke pemanggil */
  }
}

export const listReports = (): Report[] => read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const getReport = (id: string): Report | undefined => read().find((r) => r.id === id);

export interface ReportInput {
  kind: ReportKind;
  instansi: string;
  target: string;
  message: string;
  contact?: string;
  title?: string;
  category?: string;
  docUrl?: string;
  evidenceUrls?: string[];
  isDraft?: boolean;
}

export function createReport(input: ReportInput): Report {
  const now = new Date().toISOString();
  const isDraft = Boolean(input.isDraft);
  const status: ReportStatus = isDraft ? 'draft' : 'baru';
  const report: Report = {
    id: 'JP-' + now.slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    kind: input.kind,
    instansi: input.instansi,
    target: input.target,
    message: input.message,
    contact: input.contact || '',
    title: input.title || input.target,
    category: input.category,
    docUrl: input.docUrl,
    evidenceUrls: input.evidenceUrls,
    status,
    createdAt: now,
    events: [{ at: now, actor: 'pelapor', action: isDraft ? 'Draf disimpan' : 'Laporan dikirim' }],
  };
  write([report, ...read()]);

  // Sync secara asinkron ke server backend jika aktif
  try {
    fetch('http://localhost:3000/api/v1/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: report.title,
        description: report.message,
        skpd_id: report.instansi,
        report_type: report.kind === 'koreksi' ? 'salah_ketik' : report.kind === 'sumber' ? 'observasi_lapangan' : 'anomali_angka',
        reporter_email: report.contact,
        evidence_urls: report.evidenceUrls || (report.docUrl ? [report.docUrl] : []),
        is_draft: isDraft
      })
    }).catch(() => {});
  } catch {}

  return report;
}

export function setStatus(id: string, status: ReportStatus, note: string): Report | undefined {
  const list = read();
  const i = list.findIndex((r) => r.id === id);
  if (i === -1) return undefined;
  list[i] = {
    ...list[i],
    status,
    events: [...list[i].events, { at: new Date().toISOString(), actor: 'moderator', action: STATUS_LABEL[status], note }],
  };
  write(list);
  return list[i];
}
