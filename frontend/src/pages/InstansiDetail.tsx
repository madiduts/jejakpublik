import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ico } from '../components/detail/icons';
import { NAV_235, FOOT_235 } from '../lib/frameIds';
import { getInstansi, programList, programTotals, unitTotal } from '../lib/data';
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

const LINKS_A = [
  { row: '235:305', ico: '235:306', icoId: '236:25', text: '235:307', textId: '235:308', chev: '235:309', chevId: '236:30', g: 'file' as const, label: 'Lihat dokumen terkait' },
  { row: '235:310', ico: '235:311', icoId: '236:32', text: '235:312', textId: '235:313', chev: '235:314', chevId: '236:37', g: 'chart' as const, label: 'Unduh data' },
  { row: '235:315', ico: '235:316', icoId: '236:39', text: '235:317', textId: '235:318', chev: '235:319', chevId: '236:42', g: 'link' as const, label: 'Kunjungi website instansi' },
];

const LINKS_B = [
  { row: '235:325', ico: '235:326', icoId: '236:44', text: '235:327', textId: '235:328', chev: '235:329', chevId: '236:49', g: 'file' as const, label: 'Sumber dan metode' },
  { row: '235:330', ico: '235:331', icoId: '236:51', text: '235:332', textId: '235:333', chev: '235:334', chevId: '236:56', g: 'file' as const, label: 'Riwayat koreksi' },
  { row: '235:335', ico: '235:336', icoId: '236:58', text: '235:337', textId: '235:338', chev: '235:339', chevId: '236:63', g: 'chart' as const, label: 'Indikator kinerja' },
];

const serapan = (unitTotal.realisasi / unitTotal.perubahan) * 100;

export const InstansiDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const instansi = getInstansi(slug);
  const [, setTab] = useState('ringkasan');
  const [q, setQ] = useState('');
  const [, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return programList.filter((p) => !term || p.nama.toLowerCase().includes(term)).slice(0, 5);
  }, [q]);

  if (!instansi) {
    return (
      <div className="lp" data-figma-root>
        <Navbar ids={NAV_235} />
        <div className="wrap page"><p>Instansi tidak ditemukan. <Link to="/jelajahi">Kembali ke daftar</Link>.</p></div>
      </div>
    );
  }

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
                <p className="dt-lede" data-node-id="235:62">
                  Dinas Lingkungan Hidup Provinsi DKI Jakarta bertanggung jawab dalam penyelenggaraan urusan pemerintahan di bidang lingkungan hidup.
                </p>
              </div>
              <div className="dt-contacts" data-node-id="235:64">
                <span className="dt-contact c1" data-node-id="235:65">
                  <Ico g="pin" slot={18} id="236:9" color="#52525C" />
                  <span data-node-id="235:67"><span data-node-id="235:68">Jl. Kyai Tapa No. 1, Jakarta Barat</span></span>
                </span>
                <span className="dt-contact c2" data-node-id="235:70">
                  <Ico g="globe" slot={18} id="236:12" />
                  <span data-node-id="235:72"><span data-node-id="235:73">lingkunganhidup.jakarta.go.id</span></span>
                </span>
                <span className="dt-contact c3" data-node-id="235:74">
                  <Ico g="phone" slot={18} id="236:16" />
                  <span data-node-id="235:76"><span data-node-id="235:77">(021) 1234 5678</span></span>
                </span>
              </div>
            </div>

            <div className="dt-summary" data-node-id="235:82">
              <div data-node-id="235:83"><p className="dt-sum-label" data-node-id="235:84">Ringkasan Anggaran 2025</p></div>
              <div className="dt-sum-valuewrap" data-node-id="235:86">
                <p className="dt-sum-value" data-node-id="235:87">Rp3,71 Triliun</p>
              </div>
              <div className="dt-sum-notewrap" data-node-id="235:89">
                <p className="dt-sum-note" data-node-id="235:90">
                  Anggaran perubahan, turun dari penetapan Rp{(unitTotal.penetapan / 1e12).toFixed(2).replace('.', ',')} T
                </p>
              </div>
              <div data-node-id="235:114" style={{ paddingTop: 18 }}>
                <div className="dt-counters" data-node-id="235:92">
                  <div className="dt-counter" data-node-id="235:93">
                    <div data-node-id="235:94"><p className="dt-counter-l" data-node-id="235:95">Program</p></div>
                    <div data-node-id="235:96"><p className="dt-counter-v" data-node-id="235:97">{programList.length}</p></div>
                  </div>
                  <div className="dt-counter" data-node-id="235:100">
                    <div data-node-id="235:101"><p className="dt-counter-l" data-node-id="235:102">Kegiatan</p></div>
                    <div data-node-id="235:103"><p className="dt-counter-v" data-node-id="235:104">{programTotals.kegiatan}</p></div>
                  </div>
                  <div className="dt-counter" data-node-id="235:106">
                    <div data-node-id="235:107"><p className="dt-counter-l" data-node-id="235:108">Subkegiatan</p></div>
                    <div data-node-id="235:109"><p className="dt-counter-v" data-node-id="235:110">{programTotals.subKegiatan}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div data-node-id="235:350" style={{ paddingTop: 24 }}>
        <nav className="dt-tabs" data-node-id="235:116">
          {[
            { id: '235:130', inner: '235:117', text: '235:118', label: 'Ringkasan', w: 61 },
            { id: '235:131', inner: '235:119', text: '235:120', label: 'Program', w: 49 },
            { id: '235:132', inner: '235:122', text: '235:123', label: 'Kegiatan', w: 50 },
            { id: '235:133', inner: '235:124', text: '235:125', label: 'Subkegiatan', w: 71 },
            { id: '235:134', inner: '235:126', text: '235:127', label: 'Dokumen', w: 55 },
            { id: '235:135', inner: '235:128', text: '235:129', label: 'Laporan', w: 47 },
          ].map((t, i) => (
            <span key={t.label} data-node-id={t.id} style={{ display: 'inline-block', width: t.w }}>
              <button
                className={`dt-tab${i === 0 ? ' on' : ''}`}
                data-node-id={t.inner}
                onClick={() => setTab(t.label.toLowerCase())}
              >
                <span data-node-id={t.text}>{t.label}</span>
              </button>
            </span>
          ))}
        </nav>
      </div>

      <section className="dt-body" data-node-id="235:136">
        <div className="dt-grid" data-node-id="235:137">
          <div className="dt-main" data-node-id="235:138">
            <div className="dt-row" data-node-id="235:139">
              <div className="dt-card" data-node-id="235:140">
                <h2 className="dt-h2" data-node-id="235:142">Profil Instansi</h2>
                <div className="dt-pwrap" data-node-id="235:144">
                  <p className="dt-prose" data-node-id="235:145">
                    Dinas Lingkungan Hidup berperan dalam pengelolaan sampah, pengendalian pencemaran,
                    pengendalian bahan berbahaya dan beracun, serta pengembangan ruang terbuka hijau
                    bagi seluruh warga Jakarta.
                  </p>
                </div>
                <div data-node-id="235:152" style={{ paddingTop: 16 }}>
                  <div data-node-id="235:147">
                    <button className="dt-btn" data-node-id="235:148">
                      <span data-node-id="235:149">Selengkapnya</span>
                      <Ico g="chev" slot={14} id="236:18" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="dt-card" data-node-id="235:153">
                <h2 className="dt-h2" data-node-id="235:155">Realisasi Anggaran</h2>
                <div data-node-id="235:185" style={{ paddingTop: 12 }}>
                  <div className="dt-donutrow" data-node-id="235:156">
                    <div className="dt-donut" data-node-id="235:157">
                      <div className="dt-donut-val" data-node-id="235:159">{serapan.toFixed(2).replace('.', ',')}%</div>
                      <div className="dt-donut-lbl" data-node-id="235:162">Terserap</div>
                    </div>
                    <div className="dt-legend" data-node-id="235:165">
                      <div className="dt-legend-row" data-node-id="235:166">
                        <span className="dt-legend-dotwrap" data-node-id="235:175"><i className="dt-legend-dot" data-node-id="235:167" style={{ background: '#3F3F46', marginTop: 0 }} /></span>
                        <span data-node-id="235:168">
                          <span data-node-id="235:169"><p className="dt-legend-l" data-node-id="235:170">Realisasi</p></span>
                          <span data-node-id="235:171"><p className="dt-legend-v" data-node-id="235:172">{formatRupiahShort(unitTotal.realisasi)}</p></span>
                        </span>
                      </div>
                      <div className="dt-legend-row" data-node-id="235:176">
                        <span className="dt-legend-dotwrap" data-node-id="235:184"><i className="dt-legend-dot" data-node-id="235:177" style={{ background: '#C9C9CE', marginTop: 0 }} /></span>
                        <span data-node-id="235:178">
                          <span data-node-id="235:179"><p className="dt-legend-l" data-node-id="235:180">Anggaran perubahan</p></span>
                          <span data-node-id="235:181"><p className="dt-legend-v" data-node-id="235:182">{formatRupiahShort(unitTotal.perubahan)}</p></span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            </div>
            <div className="dt-card tall" data-node-id="235:186">
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
                  <button className="dt-select" data-node-id="235:194">
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

                  {rows.map((row, i) => (
                    <div className="dt-trow" key={row.slug} data-node-id={ROWS[i].row}>
                      <span className="dt-c1 dt-muted" data-node-id={ROWS[i].no}><span data-node-id={ROWS[i].noT}>{i + 1}.</span></span>
                      <span className="dt-c2" data-node-id={ROWS[i].name}><span className="dt-name" data-node-id={ROWS[i].nameT}>{alias(row.nama)}</span></span>
                      <span className="dt-num dt-c3" data-node-id={ROWS[i].ang}><span data-node-id={ROWS[i].angT}>{formatRupiah(row.apbdp)}</span></span>
                      <span className="dt-num dt-c4" data-node-id={ROWS[i].real}><span data-node-id={ROWS[i].realT}>{formatRupiah(row.realisasi)}</span></span>
                      <span className="dt-num dt-c5" data-node-id={ROWS[i].pct}><span data-node-id={ROWS[i].pctT}>{row.pct ?? '-'}</span></span>
                      <span className="dt-aksi dt-c6" data-node-id={ROWS[i].aksi}>
                        <Link className="dt-detail" data-node-id={ROWS[i].chip} to={'/program/' + row.slug}>
                          <span data-node-id={ROWS[i].chipT}>Lihat detail</span>
                        </Link>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dt-tfoot" data-node-id="235:285">
                <span data-node-id="235:286"><span data-node-id="235:287">Menampilkan 1–{rows.length} dari {programList.length} program</span></span>
                <div className="dt-pager" data-node-id="235:288">
                  <button className="dt-page" data-node-id="235:289"><span data-node-id="235:290">‹</span></button>
                  <button className="dt-page on" data-node-id="235:291"><span data-node-id="235:292">1</span></button>
                  <button className="dt-page" data-node-id="235:293"><span data-node-id="235:294">2</span></button>
                  <button className="dt-page" data-node-id="235:295"><span data-node-id="235:296">›</span></button>
                </div>
              </div>
            </div>
          </div>

          <div className="dt-side" data-node-id="235:300">
            <div className="dt-sidecard" data-node-id="235:301">
              <h2 className="dt-h2" data-node-id="235:303">Informasi Lainnya</h2>
              <div className="dt-side-links" data-node-id="235:304">
                {LINKS_A.map((l) => (
                  <a className="dt-linkrow" key={l.label} data-node-id={l.row} href="#" onClick={(e) => e.preventDefault()}>
                    <span data-node-id={l.ico}><Ico g={l.g} slot={16} id={l.icoId} /></span>
                    <span className="dt-linktext" data-node-id={l.text}><span data-node-id={l.textId}>{l.label}</span></span>
                    <span className="dt-arrow" data-node-id={l.chev}><Ico g="chev" slot={14} id={l.chevId} /></span>
                  </a>
                ))}
              </div>
            </div>

            <div data-node-id="235:341" style={{ paddingTop: 18 }}>
              <div className="dt-sidecard" data-node-id="235:321">
                <h2 className="dt-h2" data-node-id="235:323">Data Terkait</h2>
                <div className="dt-side-links" data-node-id="235:324">
                  {LINKS_B.map((l) => (
                    <a className="dt-linkrow" key={l.label} data-node-id={l.row} href="#" onClick={(e) => e.preventDefault()}>
                      <span data-node-id={l.ico}><Ico g={l.g} slot={16} id={l.icoId} /></span>
                      <span className="dt-linktext" data-node-id={l.text}><span data-node-id={l.textId}>{l.label}</span></span>
                      <span className="dt-arrow" data-node-id={l.chev}><Ico g="chev" slot={14} id={l.chevId} /></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer ids={FOOT_235} />
    </div>
  );
};
