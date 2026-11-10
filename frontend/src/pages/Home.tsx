import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { NAV_203, FOOT_203 } from '../lib/frameIds';
import { Footer } from '../components/layout/Footer';
import { totals, programList } from '../lib/data';
import { formatRupiah, formatRupiahShort, formatPersen } from '../utils/format';

const serapan = (totals.belanjaRealisasi / totals.belanja) * 100;

/** Label panjang dipendekkan hanya untuk kolom 852 px; angkanya tidak diubah. */
const displayName = (n: string) => n.replace('LIMBAH BAHAN BERBAHAYA DAN BERACUN (LIMBAH B3)', 'LIMBAH B3');

const KPIS = [
  { box: '203:50', lblwrap: '203:51', label: '203:52', valwrap: '203:54', value: '203:55', footwrap: '203:57', foot: '203:58',
    l: 'Instansi', v: String(totals.instansi), f: 'Seluruh perangkat daerah' },
  { box: '203:62', lblwrap: '203:63', label: '203:64', valwrap: '203:65', value: '203:66', footwrap: '203:67', foot: '203:68',
    l: 'Anggaran belanja', v: formatRupiahShort(totals.belanja), f: formatRupiah(totals.belanja) },
  { box: '203:71', lblwrap: '203:72', label: '203:73', valwrap: '203:74', value: '203:75', footwrap: '203:76', foot: '203:77',
    l: 'Realisasi', v: formatRupiahShort(totals.belanjaRealisasi), f: `Dilaporkan ${totals.instansiMelapor} instansi` },
  { box: '203:80', lblwrap: '203:81', label: '203:82', valwrap: '203:83', value: '203:84', footwrap: '203:85', foot: '203:86',
    l: 'Terserap', v: formatPersen(serapan), f: 'Terhadap anggaran perubahan' },
];

const GROUPS = [
  { box: '203:92', numwrap: '203:93', num: '203:94', headwrap: '203:96', head: '203:97', valwrap: '203:99', val: '203:100', notewrap: '203:102', note: '203:103',
    no: '01', t: 'Belanja', v: formatRupiah(totals.belanja),
    n: `${totals.instansiMelapor} dari ${totals.instansi} instansi melaporkan. Realisasi ${formatRupiah(totals.belanjaRealisasi)}.` },
  { box: '203:108', numwrap: '203:109', num: '203:110', headwrap: '203:111', head: '203:112', valwrap: '203:113', val: '203:114', notewrap: '203:115', note: '203:116',
    no: '02', t: 'Pendapatan', v: formatRupiah(totals.pendapatan),
    n: `${totals.instansiPendapatan} dari ${totals.instansi} instansi. Realisasi ${formatRupiah(totals.pendapatanRealisasi)}.` },
  { box: '203:120', numwrap: '203:121', num: '203:122', headwrap: '203:123', head: '203:124', valwrap: '203:125', val: '203:126', notewrap: '203:127', note: '203:128',
    no: '03', t: 'Pembiayaan', v: formatRupiah(totals.pembiayaan),
    n: `${totals.instansiPembiayaan} dari ${totals.instansi} instansi. Sebagian tidak dilaporkan, dan itu bukan nol.` },
];

const ROWS = [
  { row: '203:145', namewrap: '203:146', name: '203:147', valwrap: '203:148', val: '203:149', pctwrap: '203:151', pct: '203:152', cell: '203:153', chip: '203:154', arrow: '203:155' },
  { row: '203:157', namewrap: '203:158', name: '203:159', valwrap: '203:160', val: '203:161', pctwrap: '203:162', pct: '203:163', cell: '203:164', chip: '203:165', arrow: '203:166' },
  { row: '203:167', namewrap: '203:168', name: '203:169', valwrap: '203:170', val: '203:171', pctwrap: '203:172', pct: '203:173', cell: '203:174', chip: '203:175', arrow: '203:176' },
  { row: '203:177', namewrap: '203:178', name: '203:179', valwrap: '203:180', val: '203:181', pctwrap: '203:182', pct: '203:183', cell: '203:184', chip: '203:185', arrow: '203:186' },
  { row: '203:187', namewrap: '203:188', name: '203:189', valwrap: '203:190', val: '203:191', pctwrap: '203:192', pct: '203:193', cell: '203:194', chip: '203:195', arrow: '203:196' },
];

export const Home: React.FC = () => {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const rows = programList.slice(0, 5);

  return (
    <div className="lp" data-figma-root data-node-id="203:2">
      <Navbar ids={NAV_203} />

      <section className="lp-hero" data-node-id="203:24">
        <div className="lp-hero-img" aria-hidden="true" />
        <div className="lp-hero-shade" aria-hidden="true" />
        <div className="lp-hero-in" data-node-id="203:27">
          <div data-node-id="203:28">
            <p className="lp-eyebrow" data-node-id="203:29">Transparansi anggaran DKI Jakarta</p>
          </div>

          <div className="lp-h1wrap" data-node-id="203:31">
            <h1 className="lp-h1" data-node-id="203:32">Telusuri anggaran publik Jakarta</h1>
          </div>

          <div className="lp-pwrap" data-node-id="203:43">
            <p className="lp-lede" data-node-id="203:35">
              Pagu, realisasi, dan hasil yang dilaporkan pemerintah daerah, lengkap dengan dokumen asalnya.
            </p>
          </div>

          <form
            className="lp-hero-search"
            data-node-id="203:37"
            onSubmit={(e) => { e.preventDefault(); navigate(`/jelajahi?q=${encodeURIComponent(q)}`); }}
          >
            <div className="lp-input-wrap" data-node-id="203:38">
              {q === '' && <span className="lp-ph" data-node-id="203:39">Cari instansi, program, atau kata kunci...</span>}
              <input
                className="lp-input-real"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari instansi, program, atau kata kunci"
              />
            </div>
            <button className="lp-go" data-node-id="203:40" type="submit">
              <span data-node-id="203:41">Cari</span>
            </button>
          </form>
        </div>
      </section>

      <section className="lp-sec" data-node-id="203:45">
        <div data-node-id="203:46">
          <p className="lp-label" data-node-id="203:47">Ringkasan tahun anggaran 2025</p>
        </div>

        <div className="lp-kpis-wrap" data-node-id="203:197">
          <div className="lp-kpis" data-node-id="203:49">
            {KPIS.map((k) => (
              <div className="lp-kpi" key={k.box} data-node-id={k.box}>
                <div className="lp-kpi-lblwrap" data-node-id={k.lblwrap}>
                  <p className="lp-kpi-l" data-node-id={k.label}>{k.l}</p>
                </div>
                <div className="lp-kpi-valwrap" data-node-id={k.valwrap}>
                  <p className="lp-kpi-v" data-node-id={k.value}>{k.v}</p>
                </div>
                <div className="lp-kpi-footwrap" data-node-id={k.footwrap}>
                  <p className="lp-kpi-f" data-node-id={k.foot}>{k.f}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-h2wrap" data-node-id="203:89">
          <p className="lp-label" data-node-id="203:90">Tiga kelompok anggaran</p>
        </div>

        <div className="lp-groups-wrap" data-node-id="203:199">
          <div className="lp-groups" data-node-id="203:91">
            {GROUPS.map((g) => (
              <div className="lp-group" key={g.no} data-node-id={g.box}>
                <div className="lp-group-numwrap" data-node-id={g.numwrap}><p className="lp-group-n" data-node-id={g.num}>{g.no}</p></div>
                <div className="lp-group-headwrap" data-node-id={g.headwrap}><p className="lp-group-h" data-node-id={g.head}>{g.t}</p></div>
                <div className="lp-group-valwrap" data-node-id={g.valwrap}><p className="lp-group-v" data-node-id={g.val}>{g.v}</p></div>
                <div className="lp-group-notewrap" data-node-id={g.notewrap}><p className="lp-group-note" data-node-id={g.note}>{g.n}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-h2wrap" data-node-id="203:132">
          <p className="lp-label" data-node-id="203:133">Program yang bisa ditelusuri</p>
        </div>

        <div className="lp-tablewrap" data-node-id="203:201">
          <div className="lp-tablecard" data-node-id="203:134">
            <div className="lp-tr lp-th" data-node-id="203:135">
              <div data-node-id="203:136"><span data-node-id="203:137">Program</span></div>
              <div className="lp-num" data-node-id="203:139" style={{ width: 200 }}><span data-node-id="203:140">Anggaran perubahan</span></div>
              <div className="lp-num" data-node-id="203:142" style={{ width: 100 }}><span data-node-id="203:143">Terserap</span></div>
              <div data-node-id="203:144" style={{ height: 1, width: 100 }} />
            </div>

            {rows.map((p, i) => (
              <div className="lp-tr lp-td" key={p.slug} data-node-id={ROWS[i].row}>
                <div data-node-id={ROWS[i].namewrap}>
                  <Link to={`/program/${p.slug}`} className="lp-td-n" data-node-id={ROWS[i].name}>{displayName(p.nama)}</Link>
                </div>
                <div className="lp-num" data-node-id={ROWS[i].valwrap} style={{ width: 200 }}>
                  <span data-node-id={ROWS[i].val}>{formatRupiah(p.apbdp)}</span>
                </div>
                <div className="lp-num" data-node-id={ROWS[i].pctwrap} style={{ width: 100 }}>
                  <span data-node-id={ROWS[i].pct}>{p.pct ?? '-'}</span>
                </div>
                <div className="lp-arrowcol" data-node-id={ROWS[i].cell} style={{ width: 100 }}>
                  <Link to={`/program/${p.slug}`} className="lp-arrow" data-node-id={ROWS[i].chip}>
                    <span data-node-id={ROWS[i].arrow}>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer ids={FOOT_203} />
    </div>
  );
};
