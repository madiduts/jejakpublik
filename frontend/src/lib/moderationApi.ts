import { API_BASE, adaBackend } from './api';
import { getSession } from './session';
import type { Report, ReportKind, ReportStatus } from './reports';
import { getInstansi } from './data';

/**
 * Jembatan ke backend moderasi.
 *
 * Dipakai hanya bila `VITE_API_BASE` diisi dan sesi punya token hasil login
 * backend. Tanpa keduanya, halaman moderasi tetap memakai penyimpanan lokal
 * seperti prototipe statis.
 */

export interface LaporanApi {
  id: string;
  ticket_number: string;
  status: string;
  title: string;
  description: string;
  skpd_id: string;
  report_type: string;
  created_at: string;
  evidence_urls?: string[] | null;
  audit_trail?: { timestamp: string; action: string; note?: string; actor?: string }[] | null;
  reporter_name?: string;
  reporter_email?: string;
}

export type KeputusanApi = 'diterima' | 'ditolak' | 'diperiksa';

const headers = (json = false): HeadersInit => {
  const token = getSession()?.token;
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const bisaModerasiApi = (): boolean => adaBackend && Boolean(getSession()?.token);

async function minta<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  const isi = (await res.json().catch(() => null)) as
    | { success?: boolean; data?: T; error?: string }
    | null;
  if (!res.ok || !isi?.success) {
    throw new Error(isi?.error || `Permintaan gagal (${res.status}).`);
  }
  return isi.data as T;
}

export const antreanModerasi = (): Promise<LaporanApi[]> =>
  minta<LaporanApi[]>('/api/v1/moderation/queue', { headers: headers() });

/** Semua laporan (bukan hanya antrean) untuk mengisi keempat tab. */
export const semuaLaporan = (): Promise<LaporanApi[]> =>
  minta<LaporanApi[]>('/api/v1/reports', { headers: headers() });

export const detailLaporan = (id: string): Promise<LaporanApi> =>
  minta<LaporanApi>(`/api/v1/moderation/reports/${encodeURIComponent(id)}`, { headers: headers() });

export const putuskanLaporan = (id: string, status: KeputusanApi, catatan: string): Promise<LaporanApi> =>
  minta<LaporanApi>(`/api/v1/moderation/reports/${encodeURIComponent(id)}/decision`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ status, audit_notes: catatan.trim() || 'Tanpa catatan tambahan.' }),
  });

const namaInstansi = (slug: string): string => getInstansi(slug)?.judul ?? slug.replace(/-/g, ' ');

const jenisLaporan = (tipe: string): ReportKind =>
  tipe === 'sumber' ? 'sumber' : tipe === 'observasi_lapangan' ? 'sanggahan' : 'koreksi';

const statusLokal = (status: string): ReportStatus => {
  if (status === 'verified' || status === 'diterima') return 'diterima';
  if (status === 'rejected' || status === 'ditolak') return 'ditolak';
  if (status === 'diperiksa' || status === 'forwarded') return 'diperiksa';
  return 'baru';
};

/** Bentuk laporan backend disamakan dengan bentuk laporan lokal. */
export const keReport = (r: LaporanApi): Report => ({
  id: r.id,
  kind: jenisLaporan(r.report_type),
  instansi: namaInstansi(r.skpd_id),
  target: r.title,
  message: r.description,
  contact: r.reporter_email ?? '',
  evidenceUrls: r.evidence_urls ?? [],
  status: statusLokal(r.status),
  createdAt: r.created_at,
  events: (r.audit_trail ?? []).map((e) => ({
    at: e.timestamp,
    actor: e.actor || 'sistem',
    action: e.action,
    note: e.note,
  })),
});

export const labelJenis = (tipe: string): string =>
  tipe === 'observasi_lapangan' ? 'Observasi lapangan' : tipe === 'sumber' ? 'Dokumen sumber baru' : 'Koreksi informasi';
