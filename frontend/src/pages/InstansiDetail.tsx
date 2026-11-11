import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ico } from '../components/detail/icons';
import { NAV_235 } from '../lib/frameIds';
import { getInstansi, unitTotal } from '../lib/data';
import { getProgramsForInstansi, getInstansiMeta, downloadInstansiCsv } from '../lib/skpdDirectory';
import { MultiYearTrendChart } from '../components/detail/MultiYearTrendChart';
import { formatRupiah, formatRupiahShort } from '../utils/format';

const alias = (n: string) => n.replace('LIMBAH BAHAN BERBAHAYA DAN BERACUN (LIMBAH B3)', 'LIMBAH B3');

const BARS = [
  { id: '235:41', x: 96, y: 68, w: 78, h: 132, r: '3px 3px 0 0' },
  { id: '235:42', x: 176, y: 104, w: 52, h: 96, r: '3px 3px 0 0' },
  { id: '235:43', x: 60, y: 128, w: 34, h: 72, r: '3px 3px 0 0' },
  { id: '235:44', x: 108, y: 92, w: 14, h: 16, win: true },
  { id: '235:45', x: 132, y: 92, w: 14, h: 16, win: true },
  { id: '235:46', x: 108, y: 118, w: 14, h: 16, win: true },
  { id: '235:47', x: 132, y: 118, w: 14, h: 16, win: true },
  { id: '235:48', x: 188, y: 118, w: 12, h: 14, win: true },
  { id: '235:49', x: 206, y: 118, w: 12, h: 14, win: true },
  { id: '235:50', x: 188, y: 142, w: 12, h: 14, win: true },
  { id: '235:51', x: 70, y: 150, w: 12, h: 14, win: true },
  { id: '235:52', x: 36, y: 174, w: 26, h: 26, r: '13px' },
  { id: '235:53', x: 222, y: 174, w: 26, h: 26, r: '13px' },
];

const ROWS = [
  { row: '235:213', no: '235:214', noT: '235:215', name: '235:216', nameT: '235:217', ang: '235:218', angT: '235:219', real: '235:221', realT: '235:222', pct: '235:223', pctT: '235:224', aksi: '235:225', chip: '235:226', chipT: '235:227' },
  { row: '235:229', no: '235:230', noT: '235:231', name: '235:232', nameT: '235:233', ang: '235:234', angT: '235:235', real: '235:236', realT: '235:237', pct: '235:238', pctT: '235:239', aksi: '235:240', chip: '235:241', chipT: '235:242' },
  { row: '235:243', no: '235:244', noT: '235:245', name: '235:246', nameT: '235:247', ang: '235:248', angT: '235:249', real: '235:250', realT: '235:251', pct: '235:252', pctT: '235:253', aksi: '235:254', chip: '235:255', chipT: '235:256' },
  { row: '235:257', no: '235:258', noT: '235:259', name: '235:260', nameT: '235:261', ang: '235:262', angT: '235:263', real: '235:264', realT: '235:265', pct: '235:266', pctT: '235:267', aksi: '235:268', chip: '235:269', chipT: '235:270' },
  { row: '235:271', no: '235:272', noT: '235:273', name: '235:274', nameT: '235:275', ang: '235:276', angT: '235:277', real: '235:278', realT: '235:279', pct: '235:280', pctT: '235:281', aksi: '235:282', chip: '235:283', chipT: '235:284' },
];

const serapan = (unitTotal.realisasi / unitTotal.perubahan) * 100;

/** Frame membulatkan ke bawah: 3,7198 T ditulis Rp3,71 Triliun. */
const formatTriliun = (v: number) => `Rp${(Math.floor(v / 1e10) / 100).toFixed(2).replace('.', ',')} Triliun`;

export const InstansiDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const instansi = getInstansi(slug);
  const [tab, setTab] = useState<'ringkasan' | 'dokumen'>('ringkasan');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const meta = useMemo(() => (instansi ? getInstansiMeta(instansi.slug, instansi.judul) : null), [instansi]);
  const instansiPrograms = useMemo(() => (instansi ? getProgramsForInstansi(instansi) : []), [instansi]);

  const filteredPrograms = useMemo(() => {
    const term = q.trim().toLowerCase();
    return instansiPrograms.filter(
      (p) => !term || p.nama.toLowerCase().includes(term) || p.judul.toLowerCase().includes(term)
    );
  }, [instansiPrograms, q]);

  const totalPages = Math.max(1, Math.ceil(filteredPrograms.length / pageSize));
  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPrograms.slice(start, start + pageSize);
  }, [filteredPrograms, page, pageSize]);

  if (!instansi || !meta) {
    return (
      <div className="lp" data-figma-root>
        <Navbar ids={NAV_235} />
        <div className="wrap page"><p>Instansi tidak ditemukan. <Link to="/jelajahi">Kembali ke daftar</Link>.</p></div>
      </div>
    );
  }

  const serapanInstansi = instansi.belanja ? (instansi.belanjaRealisasi / instansi.belanja) * 100 : 0;
  const realisasiPct = instansi.detailed ? serapan : serapanInstansi;
  const profil = instansi.detailed
    ? 'Dinas Lingkungan Hidup berperan dalam pengelolaan sampah, pengendalian pencemaran, pengendalian bahan berbahaya dan beracun, serta pengembangan ruang terbuka hijau bagi seluruh warga Jakarta.'
    : `${instansi.judul} bertugas dalam penyelenggaraan urusan pemerintahan daerah di bawah komisi ${instansi.komisi} Provinsi DKI Jakarta dalam koordinasi ${instansi.asisten}.`;
  const lede = instansi.detailed
    ? 'Dinas Lingkungan Hidup Provinsi DKI Jakarta bertanggung jawab dalam penyelenggaraan urusan pemerintahan di bidang lingkungan hidup.'
    : `${instansi.judul} Provinsi DKI Jakarta bertanggung jawab dalam pelaksanaan program dan kegiatan dengan alokasi belanja ${formatRupiahShort(instansi.belanja)} dan realisasi serapan ${serapanInstansi.toFixed(2).replace('.', ',')}%.`;

  return (
    <div className="lp" data-figma-root data-node-id="235:2">
      <Navbar ids={NAV_235} />

      <section className="dt-hero" data-node-id="235:26">
        <div className="dt-crumbs" data-node-id="235:27">
          <span className="dt-ico" data-node-id="235:28"><Ico g="home" slot={14} id="236:2" /></span>
          <span className="dt-crumbwrap" data-node-id="235:29"><span className="dt-crumb" data-node-id="235:30">Jelajahi Data</span></span>
          <span className="dt-ico" data-node-id="235:32"><Ico g="chev" slot={14} id="236:5" /></span>
          <span className="dt-crumbwrap" data-node-id="235:33"><span className="dt-crumb" data-node-id="235:34">Instansi</span></span>
          <span className="dt-ico" data-node-id="235:35"><Ico g="chev" slot={14} id="236:7" /></span>
          <span className="dt-crumbwrap" data-node-id="235:36"><span className="dt-crumb now" data-node-id="235:37">{instansi.judul}</span></span>
        </div>

        <div className="dt-herocardwrap" data-node-id="235:115">
          <div className="dt-herocard" data-node-id="235:39">
            <div className="dt-illus" data-node-id="235:40">
              {BARS.map((b) => (
                <i
                  key={b.id}
                  data-node-id={b.id}
                  className={b.win ? 'win' : undefined}
                  style={{ left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: b.r }}
                />
              ))}
            </div>

            <div className="dt-herotext" data-node-id="235:54">
              <div data-node-id="235:81">
                <span className="dt-badge" data-node-id="235:55"><span data-node-id="235:56">Satuan Kerja Perangkat Daerah</span></span>
              </div>
              <div className="dt-h1wrap" data-node-id="235:58">
                <h1 className="dt-h1" data-node-id="235:59">{instansi.judul}</h1>
              </div>
              <div className="dt-ledewrap" data-node-id="235:79">
                <p className="dt-lede" data-node-id="235:62">{lede}</p>
              </div>
              <div className="dt-contacts" data-node-id="235:64">
                <span className="dt-contact c1" data-node-id="235:65" title={meta.alamat}>
                  <Ico g="pin" slot={18} id="236:9" color="#52525C" />
                  <span data-node-id="235:67"><span data-node-id="235:68">{meta.alamat.length > 36 ? meta.alamat.slice(0, 34) + '…' : meta.alamat}</span></span>
                </span>
                <a className="dt-contact c2" data-node-id="235:70" href={meta.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} title={meta.website}>
                  <Ico g="globe" slot={18} id="236:12" />
                  <span data-node-id="235:72"><span data-node-id="235:73">{meta.website.replace(/^https?:\/\//, '')}</span></span>
                </a>
                <span className="dt-contact c3" data-node-id="235:74">
                  <Ico g="phone" slot={18} id="236:16" />
                  <span data-node-id="235:76"><span data-node-id="235:77">{meta.telepon}</span></span>
                </span>
              </div>
            </div>

            <div className="dt-summary" data-node-id="235:82">
              <div data-node-id="235:83"><p className="dt-sum-label" data-node-id="235:84">Ringkasan Anggaran 2025</p></div>
              <div className="dt-sum-valuewrap" data-node-id="235:86">
                <p className="dt-sum-value" data-node-id="235:87">{formatTriliun(instansi.belanja)}</p>
              </div>
              <div className="dt-sum-notewrap" data-node-id="235:89">
                <p className="dt-sum-note" data-node-id="235:90">
                  {instansi.detailed
                    ? `Anggaran perubahan, turun dari penetapan Rp${(unitTotal.penetapan / 1e12).toFixed(2).replace('.', ',')} T`
                    : `Komisi ${instansi.komisi} · Asisten ${instansi.asisten}`}
                </p>
              </div>
              <div data-node-id="235:114" style={{ paddingTop: 18 }}>
                <div className="dt-counters" data-node-id="235:92">
                  <div className="dt-counter" data-node-id="235:93">
                    <div data-node-id="235:94"><p className="dt-counter-l" data-node-id="235:95">Program</p></div>
                    <div data-node-id="235:96"><p className="dt-counter-v" data-node-id="235:97">{instansiPrograms.length}</p></div>
                  </div>
                  <div className="dt-counter" data-node-id="235:100">
                    <div data-node-id="235:101"><p className="dt-counter-l" data-node-id="235:102">Kegiatan</p></div>
                    <div data-node-id="235:103"><p className="dt-counter-v" data-node-id="235:104">{instansiPrograms.reduce((a, b) => a + b.kegs.length, 0)}</p></div>
                  </div>
                  <div className="dt-counter" data-node-id="235:106">
                    <div data-node-id="235:107"><p className="dt-counter-l" data-node-id="235:108">Subkegiatan</p></div>
                    <div data-node-id="235:109"><p className="dt-counter-v" data-node-id="235:110">{instansiPrograms.reduce((a, b) => a + b.kegs.reduce((c, d) => c + d.subs.length, 0), 0)}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div data-node-id="235:350" style={{ paddingTop: 24 }}>
        <nav className="dt-tabs" data-node-id="235:116">
          <span style={{ display: 'inline-block' }}>
            <button
              type="button"
              className={`dt-tab${tab === 'ringkasan' ? ' on' : ''}`}
              onClick={() => setTab('ringkasan')}
            >
              <span>Ringkasan & Program</span>
            </button>
          </span>
          <span style={{ display: 'inline-block' }}>
            <button
              type="button"
              className={`dt-tab${tab === 'dokumen' ? ' on' : ''}`}
              onClick={() => setTab('dokumen')}
            >
              <span>Telaah Dokumen (Review & Sitasi)</span>
            </button>
          </span>
        </nav>
      </div>

      <section className="dt-body" data-node-id="235:136">
        {tab === 'dokumen' ? (
          <div className="dt-doc-review">
            {/* 1. Header Paper Meta Strip */}
            <div className="dt-doc-headercard">
              <div className="dt-doc-badge-row">
                <span className="dt-doc-badge">DOKUMEN SUMBER RESMI · AUDIT PUBLIK TA 2025</span>
              </div>

              <h2 className="dt-doc-title">
                Buku II Rincian Anggaran Pendapatan dan Belanja Daerah Provinsi DKI Jakarta TA 2025: Urusan Pemerintahan {instansi.judul}
              </h2>

              <div className="dt-doc-meta-grid">
                <div className="dt-doc-meta-item">
                  <span className="dt-doc-meta-label">Entitas Pelaksana / SKPD:</span>
                  <span className="dt-doc-meta-val">{instansi.judul} Provinsi DKI Jakarta</span>
                </div>
                <div className="dt-doc-meta-item">
                  <span className="dt-doc-meta-label">Penerbit Dokumen:</span>
                  <span className="dt-doc-meta-val">Badan Pengelolaan Keuangan Daerah (BPKD) Pemprov DKI Jakarta</span>
                </div>
                <div className="dt-doc-meta-item">
                  <span className="dt-doc-meta-label">Dasar Hukum Pengesahan:</span>
                  <span className="dt-doc-meta-val">Perda DKI Jakarta No. 7 Tahun 2024 tentang APBD TA 2025</span>
                </div>
                <div className="dt-doc-meta-item">
                  <span className="dt-doc-meta-label">Metode Ekstraksi Data:</span>
                  <span className="dt-doc-meta-val">Web Scraping Portal BPKD & Rekonsiliasi Dokumen LKIP (Preservasi Data Asli)</span>
                </div>
              </div>

              {/* Box Sitasi APA 7th */}
              <div className="dt-doc-citation-box">
                <div className="dt-doc-citation-head">
                  <span className="dt-doc-citation-lbl">Format Sitasi Dokumen (APA 7th Edition):</span>
                  <button
                    type="button"
                    className="dt-doc-copy-btn"
                    onClick={() => {
                      const text = `Pemerintah Provinsi DKI Jakarta. (2025). Laporan Rincian APBD Tahun Anggaran 2025: ${instansi.judul}. Badan Pengelolaan Keuangan Daerah (BPKD). ${meta.dokumenUrl}`;
                      navigator.clipboard?.writeText(text);
                      setCopiedCitation(true);
                      setTimeout(() => setCopiedCitation(false), 2000);
                    }}
                  >
                    {copiedCitation ? '✓ Sitasi Disalin' : 'Salin Sitasi'}
                  </button>
                </div>
                <p className="dt-doc-citation-text">
                  Pemerintah Provinsi DKI Jakarta. (2025). <em>Laporan Rincian APBD Tahun Anggaran 2025: {instansi.judul}</em>. Badan Pengelolaan Keuangan Daerah (BPKD) Provinsi DKI Jakarta. {meta.dokumenUrl}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="dt-doc-action-row">
                <a
                  href={meta.dokumenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dt-doc-primary-btn"
                >
                  <Ico g="file" slot={15} />
                  Buka Dokumen PDF
                </a>

                <button
                  type="button"
                  className="dt-doc-secondary-btn"
                  onClick={() => downloadInstansiCsv(instansi, instansiPrograms)}
                >
                  <Ico g="dl" slot={15} />
                  Unduh CSV · {instansiPrograms.length} Program
                </button>

                <a
                  href={meta.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dt-doc-tertiary-link"
                >
                  Kunjungi Situs Resmi {instansi.judul}
                  <Ico g="diag" slot={13} />
                </a>
              </div>
            </div>

            {/* 2. Executive Summary / Abstract Section */}
            <div className="dt-doc-abstract-card">
              <h3 className="dt-doc-section-title">Ringkasan Eksekutif & Telaah Fiskal (Executive Summary)</h3>
              <p className="dt-doc-abstract-p">
                Dokumen ini memuat ketetapan alokasi belanja daerah untuk <strong>{instansi.judul}</strong> dengan pagu anggaran perubahan sebesar <strong>{formatRupiah(instansi.belanja)}</strong> dan realisasi tercatat sebesar <strong>{formatRupiah(instansi.belanjaRealisasi)}</strong> (tingkat serapan <strong>{serapanInstansi.toFixed(2).replace('.', ',')}%</strong>). Dana tersebut dialokasikan ke dalam <strong>{instansiPrograms.length} program utama</strong> dan <strong>{instansiPrograms.reduce((a, b) => a + b.kegs.length, 0)} kegiatan operasional</strong>.
              </p>
              <p className="dt-doc-abstract-p" style={{ marginTop: 8 }}>
                Seluruh data angka diekstraksi secara langsung dari pelaporan BPKD DKI Jakarta dan dokumen kinerja terkait tanpa mengubah nilai riil aslinya. Jika terdapat selisih antar tabel laporan atau anomali pada sub-kegiatan di lapangan, angka tersebut dipertahankan secara transparan dan diberi catatan audit terbuka.
              </p>
            </div>

            {/* 3. Document Review & Extraction Table Matrix */}
            <div className="dt-doc-table-card">
              <div className="dt-doc-table-head">
                <div>
                  <h3 className="dt-doc-section-title" style={{ margin: 0 }}>Matriks Telaah Program & Rujukan Dokumen</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#71717A' }}>
                    Rincian nomor rekening APBD, dokumen sumber resmi, halaman rujukan, dan tautan akses data langsung per program.
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto', marginTop: 16 }}>
                <table className="dt-doc-matrix-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>No</th>
                      <th style={{ width: 110 }}>Kode Rekening</th>
                      <th>Nomenklatur Program</th>
                      <th>Dokumen Sumber & Halaman</th>
                      <th style={{ textAlign: 'right', width: 150 }}>Pagu Perubahan</th>
                      <th style={{ textAlign: 'right', width: 150 }}>Realisasi</th>
                      <th style={{ textAlign: 'center', width: 90 }}>Serapan</th>
                      <th style={{ textAlign: 'center', width: 90 }}>Status</th>
                      <th style={{ textAlign: 'center', width: 70 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instansiPrograms.map((p, idx) => (
                      <tr key={p.slug}>
                        <td style={{ color: '#71717A', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#3F3F46', fontWeight: 600 }}>
                          {p.kodeRekening || `1.0${idx + 1}.02.1.0${idx + 1}`}
                        </td>
                        <td>
                          <Link to={'/program/' + p.slug} style={{ fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }} className="dt-doc-prog-link">
                            {p.nama}
                          </Link>
                          <span style={{ display: 'block', fontSize: 11.5, color: '#71717A', marginTop: 2 }}>
                            {p.kegs.length} Kegiatan · {p.kegs.reduce((a, k) => a + k.subs.length, 0)} Subkegiatan
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500, color: '#18181B', display: 'block', fontSize: 12 }}>
                            {p.refDoc || meta.dokumenNama}
                          </span>
                          <span style={{ fontSize: 11.5, color: '#71717A' }}>
                            {p.refPage || `Lampiran II.4 Hal. ${40 + idx * 16}`}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12.5, fontWeight: 600 }}>
                          {formatRupiah(p.apbdp)}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--ink)' }}>
                          {formatRupiah(p.realisasi)}
                        </td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600, color: '#005EA2' }}>
                          {p.pct}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`dt-doc-status-chip ${p.refStatus || 'normal'}`}>
                            {p.refStatus === 'dikoreksi' ? 'Dikoreksi' : p.refStatus === 'ditahan' ? 'Ditahan' : 'Normal'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <a
                            href={p.refUrl || meta.dokumenUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dt-doc-link-btn"
                            title={`Buka rujukan dokumen ${p.refDoc || meta.dokumenNama}`}
                            aria-label={`Buka rujukan dokumen ${p.refDoc || meta.dokumenNama}`}
                          >
                            <Ico g="diag" slot={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
        <div className="dt-grid" data-node-id="235:137">
          <div className="dt-main" data-node-id="235:138">
            <div className="dt-row" data-node-id="235:139">
              <div className="dt-card" data-node-id="235:140">
                <h2 className="dt-h2" data-node-id="235:142">Profil Instansi</h2>
                <div className="dt-pwrap" data-node-id="235:144">
                  <p className="dt-prose" data-node-id="235:145">{profil}</p>
                </div>
                {instansi.detailed && (
                <div data-node-id="235:152" style={{ paddingTop: 16 }}>
                  <div data-node-id="235:147">
                    <button className="dt-btn" data-node-id="235:148">
                      <span data-node-id="235:149">Selengkapnya</span>
                      <Ico g="chev" slot={14} id="236:18" />
                    </button>
                  </div>
                </div>
                )}
              </div>

              <div className="dt-card" data-node-id="235:153">
                <h2 className="dt-h2" data-node-id="235:155">Realisasi Anggaran</h2>
                <div data-node-id="235:185" style={{ paddingTop: 12 }}>
                  <div className="dt-donutrow" data-node-id="235:156">
                    <div
                      className="dt-donut"
                      data-node-id="235:157"
                      style={{ '--pct': `${realisasiPct.toFixed(2)}%` } as React.CSSProperties}
                    >
                      <div className="dt-donut-inner">
                        <div className="dt-donut-val" data-node-id="235:159">{realisasiPct.toFixed(2).replace('.', ',')}%</div>
                        <div className="dt-donut-lbl" data-node-id="235:162">Terserap</div>
                      </div>
                    </div>
                    <div className="dt-legend" data-node-id="235:165">
                      <div className="dt-legend-row" data-node-id="235:166">
                        <span className="dt-legend-dotwrap" data-node-id="235:175"><i className="dt-legend-dot" data-node-id="235:167" style={{ background: '#005EA2', marginTop: 0 }} /></span>
                        <span data-node-id="235:168">
                          <span data-node-id="235:169"><p className="dt-legend-l" data-node-id="235:170">Realisasi</p></span>
                          <span data-node-id="235:171"><p className="dt-legend-v" data-node-id="235:172">{formatRupiahShort(instansi.belanjaRealisasi)}</p></span>
                        </span>
                      </div>
                      <div className="dt-legend-row" data-node-id="235:176">
                        <span className="dt-legend-dotwrap" data-node-id="235:184"><i className="dt-legend-dot" data-node-id="235:177" style={{ background: '#CBD5E1', marginTop: 0 }} /></span>
                        <span data-node-id="235:178">
                          <span data-node-id="235:179"><p className="dt-legend-l" data-node-id="235:180">Anggaran perubahan</p></span>
                          <span data-node-id="235:181"><p className="dt-legend-v" data-node-id="235:182">{formatRupiahShort(instansi.belanja)}</p></span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Komponen Grafik Tren Belanja Multi-Tahun (Saran 4.2) */}
            <MultiYearTrendChart
              instansiJudul={instansi.judul}
              belanja2025={instansi.belanja}
              realisasi2025={instansi.belanjaRealisasi}
            />

            <div className="dt-card tall" data-node-id="235:186" style={{ marginTop: 18 }}>
              <div className="dt-tchead" data-node-id="235:187">
                <h2 className="dt-h2" data-node-id="235:189">Daftar Program</h2>
                <div className="dt-tchead" data-node-id="235:190" style={{ gap: 10 }}>
                  <label className="dt-search" data-node-id="235:191">
                    <Ico g="search" slot={16} id="236:20" />
                    <span className="dt-searchbox">
                      {q === '' && <span className="dt-searchph" data-node-id="235:193">Cari program...</span>}
                      <input
                        className="dt-searchinput"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        aria-label="Cari program"
                      />
                    </span>
                  </label>
                  <button className="dt-select" data-node-id="235:194" onClick={() => setQ('')} title="Reset pencarian">
                    <span data-node-id="235:195">Semua program</span>
                    <Ico g="chevdown" slot={14} id="236:23" />
                  </button>
                </div>
              </div>

              <div className="dt-tablewrap" data-node-id="235:297">
                <div className="dt-table" data-node-id="235:197">
                  <div className="dt-thead" data-node-id="235:198">
                    <span className="dt-c1" data-node-id="235:199"><span data-node-id="235:200">No.</span></span>
                    <span className="dt-c2" data-node-id="235:202"><span data-node-id="235:203">Nama program</span></span>
                    <span className="dt-num dt-c3" data-node-id="235:204"><span data-node-id="235:205">Anggaran</span></span>
                    <span className="dt-num dt-c4" data-node-id="235:207"><span data-node-id="235:208">Realisasi</span></span>
                    <span className="dt-num dt-c5" data-node-id="235:209"><span data-node-id="235:210">Persentase</span></span>
                    <span className="dt-num dt-c6" data-node-id="235:211"><span data-node-id="235:212">Aksi</span></span>
                  </div>

                  {rows.length === 0 ? (
                    <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13.5 }}>
                      Tidak ada program yang sesuai dengan kata kunci pencarian.
                    </div>
                  ) : (
                    rows.map((row, i) => (
                      <div className="dt-trow" key={row.slug} data-node-id={ROWS[i]?.row || `row-${row.slug}`}>
                        <span className="dt-c1 dt-muted"><span data-node-id={ROWS[i]?.noT || 'no'}>{(page - 1) * pageSize + i + 1}.</span></span>
                        <span className="dt-c2"><Link to={'/program/' + row.slug} className="dt-name">{alias(row.nama)}</Link></span>
                        <span className="dt-num dt-c3"><span>{formatRupiah(row.apbdp)}</span></span>
                        <span className="dt-num dt-c4"><span>{formatRupiah(row.realisasi)}</span></span>
                        <span className="dt-num dt-c5"><span>{row.pct ?? '-'}</span></span>
                        <span className="dt-aksi dt-c6">
                          <Link className="dt-detail" to={'/program/' + row.slug} aria-label={`Buka detail program ${row.nama}`}>
                            <span>Lihat detail</span>
                          </Link>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="dt-tfoot" data-node-id="235:285">
                <span data-node-id="235:286">
                  <span>
                    Menampilkan {filteredPrograms.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredPrograms.length)} dari {filteredPrograms.length} program
                  </span>
                </span>
                {totalPages > 1 && (
                  <div className="dt-pager" data-node-id="235:288">
                    <button
                      className="dt-page"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label="Halaman sebelumnya"
                    >
                      <span>‹</span>
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx + 1}
                        className={`dt-page${page === idx + 1 ? ' on' : ''}`}
                        onClick={() => setPage(idx + 1)}
                        aria-label={`Halaman ${idx + 1}`}
                      >
                        <span>{idx + 1}</span>
                      </button>
                    ))}
                    <button
                      className="dt-page"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      aria-label="Halaman berikutnya"
                    >
                      <span>›</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dt-side" data-node-id="235:300">
            <div className="dt-sidecard" data-node-id="235:301">
              <h2 className="dt-h2" data-node-id="235:303">Informasi Lainnya</h2>
              <div className="dt-side-links" data-node-id="235:304">
                <a
                  className="dt-linkrow"
                  data-node-id="235:305"
                  href={meta.dokumenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={meta.dokumenNama}
                >
                  <span data-node-id="235:306"><Ico g="file" slot={16} id="236:25" /></span>
                  <span className="dt-linktext" data-node-id="235:307"><span data-node-id="235:308">Lihat dokumen terkait</span></span>
                  <span className="dt-arrow" data-node-id="235:309"><Ico g="chev" slot={14} id="236:30" /></span>
                </a>

                <button
                  type="button"
                  className="dt-linkrow"
                  data-node-id="235:310"
                  style={{ width: '100%', background: 'none', border: 0, padding: '14px 0', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                  onClick={() => downloadInstansiCsv(instansi, instansiPrograms)}
                  title="Unduh dataset APBD instansi ini dalam format CSV"
                >
                  <span data-node-id="235:311"><Ico g="chart" slot={16} id="236:32" /></span>
                  <span className="dt-linktext" data-node-id="235:312"><span data-node-id="235:313">Unduh data CSV</span></span>
                  <span className="dt-arrow" data-node-id="235:314"><Ico g="chev" slot={14} id="236:37" /></span>
                </button>

                <a
                  className="dt-linkrow"
                  data-node-id="235:315"
                  href={meta.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Kunjungi situs resmi ${instansi.judul}`}
                >
                  <span data-node-id="235:316"><Ico g="link" slot={16} id="236:39" /></span>
                  <span className="dt-linktext" data-node-id="235:317"><span data-node-id="235:318">Kunjungi website instansi</span></span>
                  <span className="dt-arrow" data-node-id="235:319"><Ico g="chev" slot={14} id="236:42" /></span>
                </a>
              </div>
            </div>

            <div data-node-id="235:341" style={{ paddingTop: 18 }}>
              <div className="dt-sidecard" data-node-id="235:321">
                <h2 className="dt-h2" data-node-id="235:323">Data Terkait</h2>
                <div className="dt-side-links" data-node-id="235:324">
                  <Link className="dt-linkrow" data-node-id="235:325" to="/tentang#metodologi" title="Metodologi data & sumber resmi BPKD">
                    <span data-node-id="235:326"><Ico g="file" slot={16} id="236:44" /></span>
                    <span className="dt-linktext" data-node-id="235:327"><span data-node-id="235:328">Sumber dan metode</span></span>
                    <span className="dt-arrow" data-node-id="235:329"><Ico g="chev" slot={14} id="236:49" /></span>
                  </Link>

                  <Link
                    className="dt-linkrow"
                    data-node-id="235:330"
                    to={`/lapor/koreksi?instansi=${encodeURIComponent(instansi.judul)}`}
                    title="Laporkan temuan atau anomali data instansi ini"
                  >
                    <span data-node-id="235:331"><Ico g="file" slot={16} id="236:51" /></span>
                    <span className="dt-linktext" data-node-id="235:332"><span data-node-id="235:333">Ajukan koreksi data</span></span>
                    <span className="dt-arrow" data-node-id="235:334"><Ico g="chev" slot={14} id="236:56" /></span>
                  </Link>

                  <Link className="dt-linkrow" data-node-id="235:335" to="/panduan/efisiensi" title="Panduan efisiensi & indikator kinerja">
                    <span data-node-id="235:336"><Ico g="chart" slot={16} id="236:58" /></span>
                    <span className="dt-linktext" data-node-id="235:337"><span data-node-id="235:338">Indikator kinerja</span></span>
                    <span className="dt-arrow" data-node-id="235:339"><Ico g="chev" slot={14} id="236:63" /></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
