import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ico } from '../components/detail/icons';
import { NAV_247, FOOT_247 } from '../lib/frameIds';
import { corrections, getProgram, unitTotal } from '../lib/data';
import { formatRupiah, formatRupiahShort } from '../utils/format';

const BARS = [
  { col: '247:41', bar: '247:42', label: '247:44', h: 118, color: '#D6D6DA', text: 'Penetapan' },
  { col: '247:46', bar: '247:47', label: '247:49', h: 96, color: '#9CA3AF', text: 'Perubahan' },
  { col: '247:50', bar: '247:51', label: '247:53', h: 74, color: '#D6D6DA', text: 'Realisasi' },
];

const CHIPS = [
  { box: '247:65', text: '247:66', label: 'Dinas Lingkungan Hidup' },
  { box: '247:67', text: '247:68', label: 'TA 2025' },
  { box: '247:69', text: '247:70', label: 'LKIP 2025' },
  { box: '247:71', text: '247:72', label: 'Diambil 21 Oktober 2026' },
];

const COUNTERS = [
  { cell: '247:88', lw: '247:89', lt: '247:90', vw: '247:91', vt: '247:92', l: 'Kegiatan' },
  { cell: '247:95', lw: '247:96', lt: '247:97', vw: '247:98', vt: '247:99', l: 'Sub kegiatan' },
  { cell: '247:101', lw: '247:102', lt: '247:103', vw: '247:104', vt: '247:105', l: 'Terserap' },
];

const STEPS = [
  { box: '247:295', dot: '247:296', hw: '247:297', ht: '247:298', tw: '247:299', tt: '247:300', dw: '247:301', dt: '247:302', on: true,
    h: 'Diperiksa', t: 'Dua nilai pada dokumen sumber', d: 'Tabel 2.4 dan Tabel 3.34 mencetak angka berbeda untuk baris yang sama.' },
  { box: '247:306', dot: '247:307', hw: '247:308', ht: '247:309', tw: '247:310', tt: '247:311', dw: '247:312', dt: '247:313', on: true,
    h: 'Rekonsiliasi', t: 'Selisih Rp64.191.533.908', d: 'Dikurangkan dari total, hasilnya sama dengan Tabel 3.34.' },
  { box: '247:316', dot: '247:317', hw: '247:318', ht: '247:319', tw: '247:320', tt: '247:321', dw: '247:322', dt: '247:323', on: false,
    h: 'Keputusan', t: 'Nilai dipakai, riwayat terbit', d: 'Nilai Tabel 3.34 ditampilkan beserta alasan pemilihannya.' },
];

const LINKS_C = [
  { row: '247:331', ico: '247:332', icoId: '248:20', text: '247:333', textId: '247:334', chev: '247:335', chevId: '248:25', g: 'file' as const, label: 'Dokumen sumber LKIP' },
  { row: '247:336', ico: '247:337', icoId: '248:27', text: '247:338', textId: '247:339', chev: '247:340', chevId: '248:32', g: 'file' as const, label: 'Kegiatan dan sub kegiatan' },
  { row: '247:341', ico: '247:342', icoId: '248:34', text: '247:343', textId: '247:344', chev: '247:345', chevId: '248:37', g: 'chart' as const, label: 'Halaman instansi' },
];

const KEG_ROW = { row: '247:263', no: '247:264', noT: '247:265', name: '247:266', nameT: '247:267', ang: '247:268', angT: '247:269', real: '247:271', realT: '247:272', pct: '247:273', pctT: '247:274', aksi: '247:275', chip: '247:276', chipT: '247:277' };

export const ProgramDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const program = getProgram(slug);
  const [, setTab] = useState('ringkasan');
  const [q, setQ] = useState('');
  const correction = corrections.find((c) => c.programSlug === slug);

  const kegRows = useMemo(() => {
    if (!program) return [];
    const term = q.trim().toLowerCase();
    return program.kegs.filter((k) => !term || k.nama.toLowerCase().includes(term));
  }, [program, q]);

  if (!program) {
    return (
      <div className="lp" data-figma-root>
        <Navbar ids={NAV_247} />
        <div className="wrap page"><p>Program tidak ditemukan. <Link to="/jelajahi">Kembali ke daftar</Link>.</p></div>
      </div>
    );
  }

  const perubahan = program.apbdp ?? 0;
  const realisasi = program.realisasi ?? 0;
  const penetapan = 4530968830;
  const pct = (realisasi / perubahan) * 100;
  const lede = correction
    ? 'Penanganan bahan berbahaya dan beracun serta limbahnya pada Dinas Lingkungan Hidup Provinsi DKI Jakarta, tahun anggaran 2025.'
    : `${program.judul} pada Dinas Lingkungan Hidup Provinsi DKI Jakarta, tahun anggaran 2025.`;
  const profilProgram = correction
    ? 'Program ini mengumpulkan dan mengelola limbah bahan berbahaya dan beracun lintas daerah. Nilai pada dokumen sumber ditandai dikoreksi karena Tabel 2.4 mencetak angka berbeda dari Tabel 3.34.'
    : `${program.judul} dijalankan oleh Dinas Lingkungan Hidup Provinsi DKI Jakarta. Nilainya diambil langsung dari LKIP 2025 tanpa koreksi.`;

  return (
    <div className="lp pg" data-figma-root data-node-id="247:2">
      <Navbar ids={NAV_247} />

      <section className="dt-hero" data-node-id="247:26">
        <div className="dt-crumbs" data-node-id="247:27">
          <span className="dt-ico" data-node-id="247:28"><Ico g="home" slot={14} id="248:2" /></span>
          <span className="dt-crumbwrap" data-node-id="247:29" style={{ width: 68 }}><span className="dt-crumb" data-node-id="247:30">Jelajahi Data</span></span>
          <span className="dt-ico" data-node-id="247:32"><Ico g="chev" slot={14} id="248:5" /></span>
          <span className="dt-crumbwrap" data-node-id="247:33" style={{ width: 128 }}><span className="dt-crumb" data-node-id="247:34">Dinas Lingkungan Hidup</span></span>
          <span className="dt-ico" data-node-id="247:35"><Ico g="chev" slot={14} id="248:7" /></span>
          <span className="dt-crumbwrap" data-node-id="247:36"><span className="dt-crumb now" data-node-id="247:37">{program.judul}</span></span>
        </div>

        <div className="dt-herocardwrap" data-node-id="247:110">
          <div className="dt-herocard" data-node-id="247:39">
            <div className="pg-illus" data-node-id="247:40">
              {BARS.map((b) => (
                <div className="pg-col" key={b.col} data-node-id={b.col}>
                  <i className="pg-bar" data-node-id={b.bar} style={{ height: b.h, background: b.color }} />
                  <p className="pg-col-l" data-node-id={b.label}>{b.text}</p>
                </div>
              ))}
            </div>

            <div className="dt-herotext" data-node-id="247:54">
              {correction && (
              <div data-node-id="247:76">
                <span className="pg-badge" data-node-id="247:55"><span data-node-id="247:56">Program · angka dikoreksi</span></span>
              </div>
              )}
              <div className="dt-h1wrap" data-node-id="247:58">
                <h1 className="dt-h1" data-node-id="247:59">{program.judul}</h1>
              </div>
              <div className="dt-ledewrap" data-node-id="247:74">
                <p className="dt-lede" data-node-id="247:62">{lede}</p>
              </div>
              <div className="pg-chips" data-node-id="247:64">
                {CHIPS.map((c, i) => (
                  <span className="pg-chip" key={c.box} data-node-id={c.box} style={{ width: [144, 64, 73, 144][i] }}>
                    <span data-node-id={c.text}>{c.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="dt-summary" data-node-id="247:77">
              <div data-node-id="247:78"><p className="dt-sum-label" data-node-id="247:79">Anggaran perubahan</p></div>
              <div className="dt-sum-valuewrap" data-node-id="247:81">
                <p className="dt-sum-value" data-node-id="247:82">{formatRupiah(perubahan)}</p>
              </div>
              <div className="dt-sum-notewrap" data-node-id="247:84">
                <p className="dt-sum-note" data-node-id="247:85">Turun dari penetapan {formatRupiah(penetapan)}</p>
              </div>
              <div data-node-id="247:109" style={{ paddingTop: 18 }}>
                <div className="dt-counters" data-node-id="247:87">
                  {COUNTERS.map((c, i) => (
                    <div className="dt-counter" key={c.cell} data-node-id={c.cell}>
                      <div data-node-id={c.lw}><p className="dt-counter-l" data-node-id={c.lt}>{c.l}</p></div>
                      <div data-node-id={c.vw}>
                        <p className="dt-counter-v" data-node-id={c.vt}>
                          {i === 0 ? program.kegs.length : i === 1 ? program.kegs.reduce((a, k) => a + k.subs.length, 0) : pct.toFixed(2).replace('.', ',') + '%'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div data-node-id="247:364" style={{ paddingTop: 24 }}>
        <nav className="dt-tabs" data-node-id="247:111">
          {[
            { id: '247:123', inner: '247:112', text: '247:113', label: 'Ringkasan', w: 61 },
            { id: '247:124', inner: '247:114', text: '247:115', label: 'Kegiatan', w: 50 },
            { id: '247:125', inner: '247:117', text: '247:118', label: 'Sub kegiatan', w: 73 },
            { id: '247:126', inner: '247:119', text: '247:120', label: 'Riwayat koreksi', w: 88 },
            { id: '247:127', inner: '247:121', text: '247:122', label: 'Dokumen', w: 55 },
          ].map((t, i) => (
            <span key={t.label} data-node-id={t.id} style={{ display: 'inline-block', width: t.w }}>
              <button className={`dt-tab${i === 0 ? ' on' : ''}`} data-node-id={t.inner} onClick={() => setTab(t.label.toLowerCase())}>
                <span data-node-id={t.text}>{t.label}</span>
              </button>
            </span>
          ))}
        </nav>
      </div>

      <section className="dt-body" data-node-id="247:128">
        <div className="dt-grid" data-node-id="247:129">
          <div className="dt-main" data-node-id="247:130">
            <div className="dt-row" data-node-id="247:131">
              <div className="dt-card" data-node-id="247:132">
                <h2 className="dt-h2" data-node-id="247:134">Informasi Program</h2>
                <div className="dt-pwrap" data-node-id="247:136">
                  <p className="dt-prose" data-node-id="247:137">{profilProgram}</p>
                </div>
                <div data-node-id="247:144" style={{ paddingTop: 16 }}>
                  <div data-node-id="247:139">
                    <button className="dt-btn" data-node-id="247:140">
                      <span data-node-id="247:141">Selengkapnya</span>
                      <Ico g="chev" slot={14} id="248:9" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="dt-card" data-node-id="247:145">
                <h2 className="dt-h2" data-node-id="247:147">Realisasi Anggaran</h2>
                <div data-node-id="247:177" style={{ paddingTop: 12 }}>
                  <div className="dt-donutrow" data-node-id="247:148">
                    <div className="dt-donut" data-node-id="247:149">
                      <div className="dt-donut-val" data-node-id="247:151">{pct.toFixed(2).replace('.', ',')}%</div>
                      <div className="dt-donut-lblwrap" data-node-id="247:156">
                        <div className="dt-donut-lbl" data-node-id="247:154" style={{ position: 'static', top: 'auto' }}>Terserap</div>
                      </div>
                    </div>
                    <div className="dt-legend" data-node-id="247:157">
                      <div className="dt-legend-row" data-node-id="247:158">
                        <span className="dt-legend-dotwrap" data-node-id="247:167"><i className="dt-legend-dot" data-node-id="247:159" style={{ background: '#3F3F46', marginTop: 0 }} /></span>
                        <span data-node-id="247:160">
                          <span data-node-id="247:161"><p className="dt-legend-l" data-node-id="247:162">Realisasi</p></span>
                          <span data-node-id="247:163"><p className="dt-legend-v" data-node-id="247:164">{formatRupiahShort(realisasi)}</p></span>
                        </span>
                      </div>
                      <div className="dt-legend-row" data-node-id="247:168">
                        <span className="dt-legend-dotwrap" data-node-id="247:176"><i className="dt-legend-dot" data-node-id="247:169" style={{ background: '#C9C9CE', marginTop: 0 }} /></span>
                        <span data-node-id="247:170">
                          <span data-node-id="247:171"><p className="dt-legend-l" data-node-id="247:172">Anggaran perubahan</p></span>
                          <span data-node-id="247:173"><p className="dt-legend-v" data-node-id="247:174">{formatRupiahShort(perubahan)}</p></span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {correction && (
            <div className="pg-alertwrap" data-node-id="247:287">
              <div className="pg-alert" data-node-id="247:178">
                <Ico g="alert" slot={18} id="248:11" color="#B45309" />
                <div data-node-id="247:180">
                  <p className="pg-alert-t" data-node-id="247:181">
                    <b>Angka dikoreksi.</b> Dokumen sumber memuat dua nilai berbeda untuk baris yang sama.
                  </p>
                </div>
              </div>
            </div>

            )}
            {correction && (
            <div className="pg-evdwrap" data-node-id="247:288">
              <div className="pg-evd" data-node-id="247:184">
                <div className="pg-evh" data-node-id="247:185">
                  <span className="h1" data-node-id="247:187">DOKUMEN</span>
                  <span className="h2" data-node-id="247:190">NILAI</span>
                  <span className="h3" data-node-id="247:193">STATUS</span>
                </div>
                <div className="pg-evrow" data-node-id="247:195">
                  <span className="doc" data-node-id="247:197">Tabel 2.4, halaman 26</span>
                  <span className="val" data-node-id="247:199" style={{ color: '#B45309' }}>{formatRupiah(67876101084)}</span>
                  <span className="st" data-node-id="247:202" style={{ color: '#B45309' }}>salah salin</span>
                </div>
                <div className="pg-evrow" data-node-id="247:204">
                  <span className="doc" data-node-id="247:206">Tabel 3.34, halaman 96</span>
                  <span className="val" data-node-id="247:208" style={{ color: '#005EA2' }}>{formatRupiah(perubahan)}</span>
                  <span className="st" data-node-id="247:210" style={{ color: '#005EA2' }}>dipakai</span>
                </div>
                <div className="pg-evrow" data-node-id="247:211">
                  <span className="doc" data-node-id="247:213">Dashboard Keuangan BPKD, total</span>
                  <span className="val" data-node-id="247:215">{formatRupiah(unitTotal.perubahan)}</span>
                  <span className="st" data-node-id="247:217" style={{ color: '#71717A' }}>pembanding</span>
                </div>
                <div className="pg-eqwrap" data-node-id="247:234">
                  <div className="pg-eq" data-node-id="247:218">
                    <span data-node-id="247:219"><span data-node-id="247:220">67.876.101.084</span></span>
                    <span className="op" data-node-id="247:222"><span data-node-id="247:223">−</span></span>
                    <span data-node-id="247:225"><span data-node-id="247:226">64.191.533.908</span></span>
                    <span className="op" data-node-id="247:227"><span data-node-id="247:228">=</span></span>
                    <span className="res" data-node-id="247:229"><span data-node-id="247:230">3.684.567.176</span></span>
                  </div>
                </div>
                <div className="pg-evdnotewrap" data-node-id="247:235">
                  <p className="pg-evnote" data-node-id="247:232">
                    Selisih seluruh program pada Tabel 2.4. Dikurangkan, hasilnya sama dengan Tabel 3.34 dan cocok dengan
                    total Dashboard BPKD. Dua jalur independen menunjuk angka yang sama.
                  </p>
                </div>
              </div>
            </div>

            )}
            <div className="pg-listwrap" data-node-id="247:289">
              <div className="dt-card" data-node-id="247:236" style={{ height: 238 }}>
                <div className="dt-tchead" data-node-id="247:237">
                  <h2 className="dt-h2" data-node-id="247:239">Daftar Kegiatan</h2>
                  <div className="dt-tchead" data-node-id="247:240" style={{ gap: 10 }}>
                    <label className="dt-search" data-node-id="247:241">
                      <Ico g="search" slot={16} id="248:15" />
                      <span className="dt-searchbox">
                        {q === '' && <span className="dt-searchph" data-node-id="247:243">Cari kegiatan...</span>}
                        <input className="dt-searchinput" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari kegiatan" />
                      </span>
                    </label>
                    <button className="dt-select" data-node-id="247:244">
                      <span data-node-id="247:245">Semua kegiatan</span>
                      <Ico g="chevdown" slot={14} id="248:18" />
                    </button>
                  </div>
                </div>

                <div className="dt-tablewrap" data-node-id="247:285">
                  <div className="dt-table pg-table" data-node-id="247:247">
                    <div className="dt-thead" data-node-id="247:248">
                      <span className="dt-c1" data-node-id="247:249"><span data-node-id="247:250">No.</span></span>
                      <span className="dt-c2" data-node-id="247:252"><span data-node-id="247:253">Nama kegiatan</span></span>
                      <span className="dt-num dt-c3" data-node-id="247:254"><span data-node-id="247:255">Anggaran</span></span>
                      <span className="dt-num dt-c4" data-node-id="247:257"><span data-node-id="247:258">Realisasi</span></span>
                      <span className="dt-num dt-c5" data-node-id="247:259"><span data-node-id="247:260">Persentase</span></span>
                      <span className="dt-num dt-c6" data-node-id="247:261"><span data-node-id="247:262">Aksi</span></span>
                    </div>

                    {kegRows.map((k, i) => (
                      <div className="dt-trow" key={k.nama} data-node-id={KEG_ROW.row}>
                        <span className="dt-c1 dt-muted" data-node-id={KEG_ROW.no}><span data-node-id={KEG_ROW.noT}>{i + 1}.</span></span>
                        <span className="dt-c2" data-node-id={KEG_ROW.name}><span className="dt-name" data-node-id={KEG_ROW.nameT}>{k.nama}</span></span>
                        <span className="dt-num dt-c3" data-node-id={KEG_ROW.ang}><span data-node-id={KEG_ROW.angT}>{formatRupiah(k.apbdp)}</span></span>
                        <span className="dt-num dt-c4" data-node-id={KEG_ROW.real}><span data-node-id={KEG_ROW.realT}>{formatRupiah(k.realisasi)}</span></span>
                        <span className="dt-num dt-c5" data-node-id={KEG_ROW.pct}><span data-node-id={KEG_ROW.pctT}>{k.pct ?? '-'}</span></span>
                        <span className="dt-aksi dt-c6" data-node-id={KEG_ROW.aksi}>
                          <a className="dt-detail" data-node-id={KEG_ROW.chip} href="#kegiatan" onClick={(e) => e.preventDefault()}>
                            <span data-node-id={KEG_ROW.chipT}>Lihat detail</span>
                          </a>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dt-tfoot" data-node-id="247:279">
                  <span data-node-id="247:280"><span data-node-id="247:281">Menampilkan 1–{kegRows.length} dari {program.kegs.length} kegiatan</span></span>
                  <div className="dt-pager" style={{ justifyContent: 'flex-end' }}>
                    <button className="dt-page on" data-node-id="247:283"><span data-node-id="247:284">1</span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dt-side" data-node-id="247:290">
            {correction && (
            <div className="dt-card" data-node-id="247:291" style={{ height: 327 }}>
              <h2 className="dt-h2" data-node-id="247:293">Riwayat Koreksi</h2>
              <div data-node-id="247:326" style={{ paddingTop: 12 }}>
                <div className="pg-timeline" data-node-id="247:294">
                  {STEPS.map((s) => (
                    <div className="pg-step" key={s.box} data-node-id={s.box}>
                      <span className={`pg-dot${s.on ? '' : ' off'}`} data-node-id={s.dot} />
                      <div className="pg-step-hwrap" data-node-id={s.hw}><p className="pg-step-h" data-node-id={s.ht}>{s.h}</p></div>
                      <div data-node-id={s.tw}><p className="pg-step-t" data-node-id={s.tt}>{s.t}</p></div>
                      <div className="pg-step-dw" data-node-id={s.dw}><p className="pg-step-d" data-node-id={s.dt}>{s.d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            )}
            <div data-node-id="247:354" style={{ paddingTop: 18 }}>
              <div className="dt-sidecard" data-node-id="247:327">
                <h2 className="dt-h2" data-node-id="247:329">Data Terkait</h2>
                <div className="dt-side-links" data-node-id="247:330">
                  {LINKS_C.map((l) => (
                    <a className="dt-linkrow" key={l.label} data-node-id={l.row} href="#terkait" onClick={(e) => e.preventDefault()}>
                      <span data-node-id={l.ico}><Ico g={l.g} slot={16} id={l.icoId} /></span>
                      <span className="dt-linktext" data-node-id={l.text}><span data-node-id={l.textId}>{l.label}</span></span>
                      <span className="dt-arrow" data-node-id={l.chev}><Ico g="chev" slot={14} id={l.chevId} /></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div data-node-id="247:355" style={{ paddingTop: 18 }}>
              <div className="dt-card" data-node-id="247:347" style={{ height: 118 }}>
                <h2 className="dt-h2" data-node-id="247:349">Batas tafsir</h2>
                <div className="dt-pwrap pg-batas" data-node-id="247:350">
                  <p className="dt-prose" data-node-id="247:351">
                    Selisih angka bukan bukti penyimpangan. Koreksi hanya dilakukan karena ada dokumen pembanding di dalam LKIP yang sama.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer ids={FOOT_247} />
    </div>
  );
};
