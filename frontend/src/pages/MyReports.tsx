import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_223, FOOT_223 } from '../lib/frameIds';
import { listReports, Report } from '../lib/reports';

interface DisplayReport {
  id: string;
  title: string;
  sub: string;
  kind: string;
  contextData: string;
  reviewStatus: 'Dalam peninjauan' | 'Terbit' | 'Ditutup';
  handleStatus: 'Belum ditangani' | 'Diteruskan' | 'Tidak berlaku' | 'Selesai';
  note: string;
  date: string;
  timeline: {
    title: string;
    date: string;
    desc: string;
    status: 'done' | 'active' | 'pending';
  }[];
}

// Data default sesuai mockup Figma frame "13 Laporan saya + status"
const DEFAULT_DEMO_REPORTS: DisplayReport[] = [
  {
    id: 'L-2026-0031',
    title: 'Koreksi nominal B3',
    sub: 'Program Pengendalian B3 · 8 Nov 2026',
    kind: 'Koreksi informasi',
    contextData: 'Tabel 2.4 vs Tabel 3.34 LKIP DLH',
    reviewStatus: 'Dalam peninjauan',
    handleStatus: 'Belum ditangani',
    note: 'Laporan menunggu pemeriksaan moderator sebelum diteruskan ke instansi terkait.',
    date: '8 Nov 2026',
    timeline: [
      {
        title: 'Laporan diterima',
        date: '8 Nov 2026 · 14:20 WIB',
        desc: 'Laporan masuk ke sistem dan tercatat dengan tiket L-2026-0031.',
        status: 'done'
      },
      {
        title: 'Diperiksa moderator',
        date: '8 Nov 2026 · 15:45 WIB',
        desc: 'Tim memeriksa angka terhadap dokumen LKIP Tabel 3.34 dan dashboard BPKD.',
        status: 'active'
      },
      {
        title: 'Keputusan dan tanggapan',
        date: 'Menunggu',
        desc: 'Keputusan audit dan catatan usulan koreksi diterbitkan ke publik.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'L-2026-0028',
    title: 'Salah cetak volume TPS 3R',
    sub: 'Dinas Lingkungan Hidup · 6 Nov 2026',
    kind: 'Koreksi informasi',
    contextData: 'Subkegiatan Pengelolaan Sampah',
    reviewStatus: 'Terbit',
    handleStatus: 'Diteruskan',
    note: 'Angka dikonfirmasi selisih cetak, telah diteruskan ke tim dinas.',
    date: '6 Nov 2026',
    timeline: [
      {
        title: 'Laporan diterima',
        date: '6 Nov 2026 · 09:12 WIB',
        desc: 'Laporan tercatat di sistem.',
        status: 'done'
      },
      {
        title: 'Diperiksa moderator',
        date: '6 Nov 2026 · 11:30 WIB',
        desc: 'Verifikasi kesesuaian dokumen LKIP selesai.',
        status: 'done'
      },
      {
        title: 'Keputusan dan tanggapan',
        date: '6 Nov 2026 · 14:00 WIB',
        desc: 'Koreksi diverifikasi dan diterbitkan di portal.',
        status: 'done'
      }
    ]
  },
  {
    id: 'L-2026-0020',
    title: 'Anomali realisasi belanja pegawai',
    sub: 'Badan Kepegawaian Daerah · 1 Nov 2026',
    kind: 'Observasi lapangan',
    contextData: 'Tingkat SKPD APBD 2025',
    reviewStatus: 'Ditutup',
    handleStatus: 'Tidak berlaku',
    note: 'Pagu anggaran telah sesuai dengan peraturan daerah penetapan APBD.',
    date: '1 Nov 2026',
    timeline: [
      {
        title: 'Laporan diterima',
        date: '1 Nov 2026 · 16:05 WIB',
        desc: 'Laporan tercatat di antrean sistem.',
        status: 'done'
      },
      {
        title: 'Diperiksa moderator',
        date: '2 Nov 2026 · 10:20 WIB',
        desc: 'Pengecekan silang dokumen Perda APBD selesai.',
        status: 'done'
      },
      {
        title: 'Keputusan dan tanggapan',
        date: '2 Nov 2026 · 13:10 WIB',
        desc: 'Laporan ditutup dengan penjelasan regulasi pembanding.',
        status: 'done'
      }
    ]
  }
];

export const MyReports: React.FC = () => {
  const [params] = useSearchParams();
  const baru = params.get('baru');
  const userReports = listReports();

  // Konversi laporan user dari peramban ke format tampilan
  const convertedUserReports = useMemo<DisplayReport[]>(() => {
    return userReports.map((r: Report) => {
      const isReviewDone = r.status === 'diterima';
      const isRejected = r.status === 'ditolak';

      const revStatus: DisplayReport['reviewStatus'] = isReviewDone
        ? 'Terbit'
        : isRejected
        ? 'Ditutup'
        : 'Dalam peninjauan';

      const hStatus: DisplayReport['handleStatus'] = isReviewDone
        ? 'Diteruskan'
        : isRejected
        ? 'Tidak berlaku'
        : 'Belum ditangani';

      return {
        id: r.id,
        title: r.title || r.target,
        sub: `${r.instansi} · ${new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        kind: r.kind === 'koreksi' ? 'Koreksi informasi' : 'Observasi lapangan',
        contextData: r.target,
        reviewStatus: revStatus,
        handleStatus: hStatus,
        note: r.message,
        date: new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        timeline: [
          {
            title: 'Laporan diterima',
            date: new Date(r.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            desc: `Laporan masuk ke sistem dan tercatat dengan tiket ${r.id}.`,
            status: 'done'
          },
          {
            title: 'Diperiksa moderator',
            date: r.status === 'diperiksa' || r.status === 'diterima' ? 'Sedang diverifikasi' : 'Menunggu antrean',
            desc: 'Tim memeriksa angka terhadap dokumen sumber resmi dan bukti pendukung.',
            status: r.status === 'diperiksa' ? 'active' : r.status === 'diterima' ? 'done' : 'pending'
          },
          {
            title: 'Keputusan dan tanggapan',
            date: r.status === 'diterima' || r.status === 'ditolak' ? 'Selesai' : 'Menunggu',
            desc: 'Keputusan audit dan catatan usulan diterbitkan ke portal.',
            status: r.status === 'diterima' ? 'done' : 'pending'
          }
        ]
      };
    });
  }, [userReports]);

  // Gabungkan laporan pengguna dengan data demo terverifikasi
  const allReports = useMemo(() => {
    return [...convertedUserReports, ...DEFAULT_DEMO_REPORTS];
  }, [convertedUserReports]);

  // Tab filter
  const [activeTab, setActiveTab] = useState<'semua' | 'diterima' | 'peninjauan' | 'ditolak'>('semua');

  const filteredReports = useMemo(() => {
    if (activeTab === 'diterima') return allReports.filter((r) => r.reviewStatus === 'Terbit');
    if (activeTab === 'peninjauan') return allReports.filter((r) => r.reviewStatus === 'Dalam peninjauan');
    if (activeTab === 'ditolak') return allReports.filter((r) => r.reviewStatus === 'Ditutup');
    return allReports;
  }, [allReports, activeTab]);

  // Tiket terpilih untuk panel detail di bawah
  const [selectedId, setSelectedId] = useState<string>(baru || allReports[0]?.id || 'L-2026-0031');

  const selectedReport = useMemo(() => {
    return allReports.find((r) => r.id === selectedId) || allReports[0];
  }, [allReports, selectedId]);

  return (
    <div className="lp myr-page">
      <Navbar ids={NAV_223} />

      <main className="myr-wrap">
        <p className="myr-crumb">
          <Link to="/">Beranda</Link> / <span>Akun</span> / <span>Laporan saya</span>
        </p>

        <div className="myr-headwrap">
          <span className="myr-tag">AKUN › {allReports.length} LAPORAN</span>
          <h1 className="myr-h1">Laporan saya</h1>
          <p className="myr-desc">
            Setiap laporan punya dua status: peninjauan oleh tim, dan penanganan masalah di lapangan.
          </p>
        </div>

        {baru && (
          <div
            style={{
              padding: '12px 16px',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: 10,
              fontSize: 13,
              color: '#065F46',
              marginBottom: 16
            }}
          >
            ✅ <strong>Laporan berhasil diajukan!</strong> Nomor tiket Anda adalah <code>{baru}</code>. Detail status dan riwayat ditampilkan di bawah.
          </div>
        )}

        {/* Tab Filter */}
        <div className="myr-tabs">
          <button
            type="button"
            className={`myr-tab${activeTab === 'semua' ? ' on' : ''}`}
            onClick={() => setActiveTab('semua')}
          >
            Semua ({allReports.length})
          </button>
          <button
            type="button"
            className={`myr-tab${activeTab === 'diterima' ? ' on' : ''}`}
            onClick={() => setActiveTab('diterima')}
          >
            Diterima
          </button>
          <button
            type="button"
            className={`myr-tab${activeTab === 'peninjauan' ? ' on' : ''}`}
            onClick={() => setActiveTab('peninjauan')}
          >
            Dalam peninjauan
          </button>
          <button
            type="button"
            className={`myr-tab${activeTab === 'ditolak' ? ' on' : ''}`}
            onClick={() => setActiveTab('ditolak')}
          >
            Ditolak
          </button>
        </div>

        {/* Card Tabel Daftar Laporan */}
        <section className="myr-card">
          <div className="myr-table-wrap">
            <div className="myr-thead">
              <div>Nomor Tiket</div>
              <div>Judul Laporan</div>
              <div>Status Peninjauan</div>
              <div>Status Penanganan</div>
              <div style={{ textAlign: 'right' }}>Aksi</div>
            </div>

            {filteredReports.map((r) => (
              <div
                key={r.id}
                className={`myr-row${selectedId === r.id ? ' active' : ''}`}
                onClick={() => setSelectedId(r.id)}
              >
                <div className="myr-ticket">{r.id}</div>
                <div className="myr-titleblock">
                  <span className="myr-title">{r.title}</span>
                  <span className="myr-sub">{r.sub}</span>
                </div>
                <div>
                  <span
                    className={`myr-badge ${
                      r.reviewStatus === 'Dalam peninjauan'
                        ? 'warn'
                        : r.reviewStatus === 'Terbit'
                        ? 'ok'
                        : 'neutral'
                    }`}
                  >
                    {r.reviewStatus}
                  </span>
                </div>
                <div>
                  <span
                    className={`myr-badge ${
                      r.handleStatus === 'Diteruskan'
                        ? 'orange'
                        : r.handleStatus === 'Belum ditangani'
                        ? 'faint'
                        : 'neutral'
                    }`}
                  >
                    {r.handleStatus}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="myr-btn-open"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(r.id);
                    }}
                  >
                    Buka +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grid 2 Kolom: Detail Laporan & Riwayat Timeline */}
        {selectedReport && (
          <div className="myr-grid2">
            {/* Kolom Kiri: Detail Laporan */}
            <div className="myr-panel">
              <div className="myr-panel-head">
                <div>
                  <h3 className="myr-panel-title">{selectedReport.id}</h3>
                  <p className="myr-panel-sub">{selectedReport.title}</p>
                </div>
                <span
                  className={`myr-badge ${
                    selectedReport.reviewStatus === 'Dalam peninjauan'
                      ? 'warn'
                      : selectedReport.reviewStatus === 'Terbit'
                      ? 'ok'
                      : 'neutral'
                  }`}
                >
                  {selectedReport.reviewStatus}
                </span>
              </div>

              <table className="myr-meta-table">
                <tbody>
                  <tr>
                    <td className="myr-meta-label">Jenis</td>
                    <td className="myr-meta-val">{selectedReport.kind}</td>
                  </tr>
                  <tr>
                    <td className="myr-meta-label">Konteks data</td>
                    <td className="myr-meta-val">{selectedReport.contextData}</td>
                  </tr>
                  <tr>
                    <td className="myr-meta-label">Status peninjauan</td>
                    <td className="myr-meta-val">
                      <span
                        className={`myr-badge ${
                          selectedReport.reviewStatus === 'Dalam peninjauan'
                            ? 'warn'
                            : selectedReport.reviewStatus === 'Terbit'
                            ? 'ok'
                            : 'neutral'
                        }`}
                      >
                        {selectedReport.reviewStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="myr-meta-label">Status penanganan</td>
                    <td className="myr-meta-val">
                      <span
                        className={`myr-badge ${
                          selectedReport.handleStatus === 'Diteruskan'
                            ? 'orange'
                            : selectedReport.handleStatus === 'Belum ditangani'
                            ? 'faint'
                            : 'neutral'
                        }`}
                      >
                        {selectedReport.handleStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="myr-meta-label">Catatan kaki</td>
                    <td className="myr-meta-val" style={{ color: '#52525B', fontSize: 12.5, lineHeight: 1.5 }}>
                      {selectedReport.note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Kolom Kanan: Riwayat / Timeline */}
            <div className="myr-panel">
              <div className="myr-panel-head">
                <h3 className="myr-panel-title">Riwayat</h3>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {selectedReport.timeline.length} tahapan
                </span>
              </div>

              <ul className="myr-timeline">
                {selectedReport.timeline.map((step, idx) => (
                  <li key={idx} className="myr-tl-item">
                    <div
                      className={`myr-tl-dot ${
                        step.status === 'done'
                          ? 'done'
                          : step.status === 'active'
                          ? 'active'
                          : ''
                      }`}
                    >
                      {step.status === 'done' ? '✓' : idx + 1}
                    </div>
                    <div className="myr-tl-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span className="myr-tl-title">{step.title}</span>
                        <span className="myr-tl-date">{step.date}</span>
                      </div>
                      <p className="myr-tl-sub">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <Footer ids={FOOT_223} />
    </div>
  );
};

export default MyReports;
