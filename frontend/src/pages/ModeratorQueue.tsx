import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_223, FOOT_223 } from '../lib/frameIds';
import { listReports, Report } from '../lib/reports';
import { getSession } from '../lib/session';

interface ModQueueItem {
  id: string;
  title: string;
  context: string;
  date: string;
  status: 'Baru' | 'Perlu informasi' | 'Siap terbit' | 'Terbit' | 'Ditolak';
  category: 'perlu_periksa' | 'terbit' | 'ditolak' | 'perlu_info';
}

const DEFAULT_MOD_QUEUE: ModQueueItem[] = [
  {
    id: 'L-2026-0031',
    title: 'Koreksi nominal B3',
    context: 'Koreksi informasi · Program Pengendalian B3',
    date: '8 Nov 2026',
    status: 'Baru',
    category: 'perlu_periksa'
  },
  {
    id: 'L-2026-0030',
    title: 'Angka realisasi Bina Marga',
    context: 'Koreksi informasi · Halaman instansi',
    date: '7 Nov 2026',
    status: 'Baru',
    category: 'perlu_periksa'
  },
  {
    id: 'L-2026-0027',
    title: 'Trotoar Jalan Sabang rusak',
    context: 'Observasi lapangan · Jakarta Pusat',
    date: '2 Nov 2026',
    status: 'Perlu informasi',
    category: 'perlu_info'
  },
  {
    id: 'L-2026-0024',
    title: 'Istilah efisiensi',
    context: 'Koreksi informasi · Glosarium',
    date: '29 Okt 2026',
    status: 'Siap terbit',
    category: 'perlu_periksa'
  },
  {
    id: 'L-2026-0018',
    title: 'Sisa anggaran operasional DLH',
    context: 'Koreksi informasi · Rekapitulasi belanja',
    date: '25 Okt 2026',
    status: 'Terbit',
    category: 'terbit'
  },
  {
    id: 'L-2026-0012',
    title: 'Klaim pemborosan dana fiktif',
    context: 'Observasi lapangan · Penafsiran keliru',
    date: '18 Okt 2026',
    status: 'Ditolak',
    category: 'ditolak'
  }
];

export const ModeratorQueue: React.FC = () => {
  const session = getSession();
  const userReports = listReports();

  // Konversi laporan lokal jika ada
  const dynamicItems = useMemo<ModQueueItem[]>(() => {
    return userReports.map((r: Report) => {
      let st: ModQueueItem['status'] = 'Baru';
      let cat: ModQueueItem['category'] = 'perlu_periksa';

      if (r.status === 'diperiksa') {
        st = 'Perlu informasi';
        cat = 'perlu_info';
      } else if (r.status === 'diterima') {
        st = 'Terbit';
        cat = 'terbit';
      } else if (r.status === 'ditolak') {
        st = 'Ditolak';
        cat = 'ditolak';
      }

      return {
        id: r.id,
        title: r.title || r.target,
        context: `${r.kind === 'koreksi' ? 'Koreksi informasi' : 'Observasi lapangan'} · ${r.instansi}`,
        date: new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: st,
        category: cat
      };
    });
  }, [userReports]);

  const allItems = useMemo(() => {
    return [...dynamicItems, ...DEFAULT_MOD_QUEUE];
  }, [dynamicItems]);

  const [tab, setTab] = useState<'perlu_periksa' | 'terbit' | 'ditolak' | 'perlu_info'>('perlu_periksa');

  const filteredItems = useMemo(() => {
    return allItems.filter((i) => i.category === tab);
  }, [allItems, tab]);

  const countPerluPeriksa = allItems.filter((i) => i.category === 'perlu_periksa').length;
  const countTerbit = allItems.filter((i) => i.category === 'terbit').length;
  const countDitolak = allItems.filter((i) => i.category === 'ditolak').length;
  const countPerluInfo = allItems.filter((i) => i.category === 'perlu_info').length;

  if (!session) {
    return (
      <div className="lp myr-page">
        <Navbar ids={NAV_223} />
        <main className="myr-wrap" style={{ maxWidth: 640, textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>Ruang Moderator Terkunci</h2>
          <p style={{ color: 'var(--muted)', margin: '12px 0 24px' }}>
            Silakan masuk dengan akun moderator untuk membuka panel verifikasi dan antrean laporan warga.
          </p>
          <Link
            to="/masuk"
            state={{ from: '/moderator' }}
            className="rp-btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Masuk sebagai Moderator →
          </Link>
        </main>
        <Footer ids={FOOT_223} />
      </div>
    );
  }

  return (
    <div className="lp myr-page">
      <Navbar ids={NAV_223} />

      <main className="myr-wrap">
        <p className="myr-crumb">
          <span>Moderator</span> / <span>Antrian laporan</span>
        </p>

        <div className="myr-headwrap">
          <span className="myr-tag">AREA INTERNAL · PERAN MODERATOR ({session.name})</span>
          <h1 className="myr-h1">Antrian laporan</h1>
          <p className="myr-desc">
            Laporan masuk diperiksa sebelum terbit. Keputusan dan alasannya dicatat, dan dapat dibaca pelapor.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="myr-tabs">
          <button
            type="button"
            className={`myr-tab${tab === 'perlu_periksa' ? ' on' : ''}`}
            onClick={() => setTab('perlu_periksa')}
          >
            Perlu diperiksa ({countPerluPeriksa})
          </button>
          <button
            type="button"
            className={`myr-tab${tab === 'terbit' ? ' on' : ''}`}
            onClick={() => setTab('terbit')}
          >
            Terbit ({countTerbit})
          </button>
          <button
            type="button"
            className={`myr-tab${tab === 'ditolak' ? ' on' : ''}`}
            onClick={() => setTab('ditolak')}
          >
            Ditolak ({countDitolak})
          </button>
          <button
            type="button"
            className={`myr-tab${tab === 'perlu_info' ? ' on' : ''}`}
            onClick={() => setTab('perlu_info')}
          >
            Perlu informasi ({countPerluInfo})
          </button>
        </div>

        {/* Card Tabel Antrean */}
        <section className="myr-card">
          <div className="myr-table-wrap">
            <div className="myr-thead" style={{ gridTemplateColumns: '140px minmax(280px, 1fr) 140px 140px 100px' }}>
              <div>Nomor Tiket</div>
              <div>Judul & Konteks Laporan</div>
              <div>Tanggal</div>
              <div>Status</div>
              <div style={{ textAlign: 'right' }}>Aksi</div>
            </div>

            {filteredItems.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13.5 }}>
                Tidak ada laporan dalam kategori ini.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="myr-row"
                  style={{ gridTemplateColumns: '140px minmax(280px, 1fr) 140px 140px 100px' }}
                >
                  <div className="myr-ticket">{item.id}</div>
                  <div className="myr-titleblock">
                    <span className="myr-title">{item.title}</span>
                    <span className="myr-sub">{item.context}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#52525B' }}>{item.date}</div>
                  <div>
                    <span
                      className={`myr-badge ${
                        item.status === 'Baru'
                          ? 'warn'
                          : item.status === 'Terbit'
                          ? 'ok'
                          : item.status === 'Perlu informasi'
                          ? 'orange'
                          : 'neutral'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Link
                      to={`/moderator/${item.id}`}
                      className="myr-btn-open"
                      style={{ textDecoration: 'none' }}
                    >
                      Periksa →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer ids={FOOT_223} />
    </div>
  );
};

export default ModeratorQueue;
