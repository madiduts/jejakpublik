import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ico } from '../components/detail/icons';
import { NAV_204, FOOT_204 } from '../lib/frameIds';
import { instansiList, totals } from '../lib/data';
import { formatRupiah } from '../utils/format';

const PAGE_SIZE = 5;

/** 204:63 … 204:75 — baris filter instansi pada frame. */
const FILTER_ITEM_IDS = [
  { box: '204:63', cb: '204:64', label: '204:65' },
  { box: '204:66', cb: '204:67', label: '204:68' },
  { box: '204:69', cb: '204:70', label: '204:71' },
  { box: '204:72', cb: '204:73', label: '204:74' },
  { box: '204:75', cb: '204:76', label: '204:77' },
];

/** 204:121 … 204:210 — lima baris tabel pada frame. */
const ROW_IDS = [
  { row: '204:121', name: '204:122', avatar: '204:123', block: '204:126', nameWrap: '204:127', nameText: '204:128', subWrap: '204:129', subText: '204:130', depth: '204:133', depthText: '204:134', amount: '204:136', amountText: '204:137', action: '204:139', chip: '204:140', chipText: '204:141' },
  { row: '204:143', name: '204:144', avatar: '204:145', block: '204:147', nameWrap: '204:148', nameText: '204:149', subWrap: '204:150', subText: '204:151', depth: '204:153', depthText: '204:154', amount: '204:155', amountText: '204:156', action: '204:157', chip: '204:158', chipText: '204:159' },
  { row: '204:160', name: '204:161', avatar: '204:162', block: '204:164', nameWrap: '204:165', nameText: '204:166', subWrap: '204:167', subText: '204:168', depth: '204:170', depthText: '204:171', amount: '204:172', amountText: '204:173', action: '204:174', chip: '204:175', chipText: '204:176' },
  { row: '204:177', name: '204:178', avatar: '204:179', block: '204:181', nameWrap: '204:182', nameText: '204:183', subWrap: '204:184', subText: '204:185', depth: '204:187', depthText: '204:188', amount: '204:189', amountText: '204:190', action: '204:191', chip: '204:192', chipText: '204:193' },
  { row: '204:194', name: '204:195', avatar: '204:196', block: '204:198', nameWrap: '204:199', nameText: '204:200', subWrap: '204:201', subText: '204:202', depth: '204:204', depthText: '204:205', amount: '204:206', amountText: '204:207', action: '204:208', chip: '204:209', chipText: '204:210' },
];

const CHIP_IDS = [
  { box: '204:44', text: '204:45' },
  { box: '204:46', text: '204:47' },
  { box: '204:48', text: '204:49' },
  { box: '204:50', text: '204:51' },
];

const PAGE_IDS = [
  { box: '204:214', text: '204:215' },
  { box: '204:217', text: '204:218' },
  { box: '204:219', text: '204:220' },
  { box: '204:221', text: '204:222' },
];

const byBudget = [...instansiList].sort((a, b) => b.belanja - a.belanja);

const SORT_LABEL: Record<string, string> = {
  anggaran: 'Urutkan: anggaran terbesar',
  nama: 'Urutkan: nama A–Z',
  serapan: 'Urutkan: serapan',
};

export const Explore: React.FC = () => {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('anggaran');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return byBudget.filter((i) =>
      (!term || i.nama.toLowerCase().includes(term)) &&
      (checked.length === 0 || checked.includes(i.nama))
    );
  }, [q, checked]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  /** Jendela empat nomor halaman seperti frame; bergeser bila halaman aktif melewatinya. */
  const windowStart = Math.min(Math.max(1, current - 3), Math.max(1, pages - 3));
  const windowPages = [0, 1, 2, 3].map((i) => windowStart + i).filter((p) => p <= pages);

  const toggle = (nama: string) =>
    setChecked((c) => (c.includes(nama) ? c.filter((x) => x !== nama) : [...c, nama]));

  const topFilters = byBudget.slice(0, 4).map((i) => i.judul);

  return (
    <div className="lp" data-figma-root data-node-id="204:2">
      <Navbar ids={NAV_204} />

      <section className="ex-hero" data-node-id="204:26">
        <div className="ex-hero-img" aria-hidden="true" />
        <div className="ex-hero-shade" aria-hidden="true" />
        <div className="ex-hero-canvas">
          <div data-node-id="204:30">
            <p className="ex-crumb" data-node-id="204:31">Beranda / Jelajahi Data</p>
          </div>
          <div className="ex-h1wrap" data-node-id="204:33">
            <h1 className="ex-h1" data-node-id="204:34">Jelajahi Data</h1>
          </div>
        </div>
      </section>

      <section className="ex-sec" data-node-id="204:37">
        <form
          className="ex-search"
          data-node-id="204:38"
          onSubmit={(e) => { e.preventDefault(); setPage(1); }}
        >
          <div className="ex-input-wrap" data-node-id="204:39">
            {q === '' && <span className="ex-ph" data-node-id="204:40">Cari instansi, program, atau kata kunci...</span>}
            <input
              className="ex-input"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              aria-label="Cari instansi, program, atau kata kunci"
            />
          </div>
          <button className="ex-go" type="submit" data-node-id="204:41">
            <span data-node-id="204:42">Cari</span>
          </button>
        </form>

        <div className="ex-chips-wrap" data-node-id="204:227">
          <div className="ex-chips" data-node-id="204:43">
            <button className="ex-chip" data-node-id={CHIP_IDS[0].box} onChange={() => undefined}>
              <span data-node-id={CHIP_IDS[0].text}>Semua instansi</span>
            </button>
            <button className="ex-chip" data-node-id={CHIP_IDS[1].box}>
              <span data-node-id={CHIP_IDS[1].text}>Tahun 2025</span>
            </button>
            <button className="ex-chip" data-node-id={CHIP_IDS[2].box}>
              <span data-node-id={CHIP_IDS[2].text}>Kedalaman data</span>
            </button>
            <button className="ex-chip" data-node-id={CHIP_IDS[3].box}>
              <span data-node-id={CHIP_IDS[3].text}>Filter lainnya</span>
            </button>
          </div>
        </div>

        <div className="ex-body-wrap" data-node-id="204:228">
          <div className="ex-body" data-node-id="204:52">
            <aside className="ex-filters" data-node-id="204:53">
              <div className="ex-filters-head" data-node-id="204:54">
                <span className="ex-filters-title" data-node-id="204:55">Filter</span>
                <span className="ex-filters-caret" data-node-id="204:58">▲</span>
              </div>

              <div className="ex-group-wrap" data-node-id="204:100">
                <div className="ex-group" data-node-id="204:59">
                  <div className="ex-group-hwrap" data-node-id="204:60">
                    <span className="ex-group-h" data-node-id="204:61">Instansi</span>
                  </div>
                  {topFilters.map((nama, i) => (
                    <label className={`ex-item${i === 0 ? ' first' : ''}`} key={nama} data-node-id={FILTER_ITEM_IDS[i].box}>
                      <input
                        type="checkbox"
                        className={`ex-cb${checked.includes(nama) ? ' on' : ''}`}
                        data-node-id={FILTER_ITEM_IDS[i].cb}
                        checked={checked.includes(nama)}
                        onChange={() => { toggle(nama); setPage(1); }}
                        aria-label={nama}
                      />
                      <span className="ex-item-l" data-node-id={FILTER_ITEM_IDS[i].label}>{nama}</span>
                    </label>
                  ))}
                  <label className="ex-item" data-node-id={FILTER_ITEM_IDS[4].box}>
                    <input type="checkbox" className="ex-cb" data-node-id={FILTER_ITEM_IDS[4].cb} aria-label="Lainnya" />
                    <span className="ex-item-l" data-node-id={FILTER_ITEM_IDS[4].label}>Lainnya...</span>
                  </label>
                </div>
              </div>

              <div className="ex-group-wrap" data-node-id="204:101">
                <div className="ex-group" data-node-id="204:79">
                  <div className="ex-group-hwrap" data-node-id="204:80">
                    <span className="ex-group-h" data-node-id="204:81">Tahun anggaran</span>
                  </div>
                  <label className="ex-item first" data-node-id="204:82">
                    <input type="checkbox" className="ex-cb on" data-node-id="204:83" defaultChecked aria-label="2025" />
                    <span className="ex-item-l" data-node-id="204:84">2025</span>
                  </label>
                  <div className="ex-note-wrap" data-node-id="204:85">
                    <p className="ex-note" data-node-id="204:86">Hanya 2025 yang sumbernya lengkap.</p>
                  </div>
                </div>
              </div>

              <div className="ex-group-wrap" data-node-id="204:102">
                <div className="ex-group" data-node-id="204:90">
                  <div className="ex-group-hwrap" data-node-id="204:91">
                    <span className="ex-group-h" data-node-id="204:92">Kedalaman data</span>
                  </div>
                  <label className="ex-item first" data-node-id="204:93">
                    <input type="checkbox" className="ex-cb" data-node-id="204:94" aria-label="Sampai sub kegiatan" />
                    <span className="ex-item-l" data-node-id="204:95">Sampai sub kegiatan</span>
                  </label>
                  <label className="ex-item" data-node-id="204:96">
                    <input type="checkbox" className="ex-cb" data-node-id="204:97" aria-label="Tingkat SKPD" />
                    <span className="ex-item-l" data-node-id="204:98">Tingkat SKPD</span>
                  </label>
                </div>
              </div>
            </aside>

            <div className="ex-list" data-node-id="204:103">
              <div className="ex-list-head" data-node-id="204:104">
                <span className="ex-th18" data-node-id="204:105"><span className="ex-t16" data-node-id="204:106">{rows.length} dari {totals.instansi} instansi</span></span>
                <span className="ex-th18" data-node-id="204:107">
                  <span className="ex-sort-txt" data-node-id="204:108">
                    {SORT_LABEL[sort]} <span className="ex-caret">▾</span>
                    <select
                      className="ex-sort-select"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="Urutkan"
                    >
                      <option value="anggaran">Anggaran terbesar</option>
                      <option value="nama">Nama A–Z</option>
                      <option value="serapan">Serapan</option>
                    </select>
                  </span>
                </span>
              </div>

              <div className="ex-cardwrap" data-node-id="204:225">
                <div className="ex-card" data-node-id="204:109">
                  <div className="ex-thead" data-node-id="204:110">
                    <div data-node-id="204:111"><span data-node-id="204:112">Nama instansi</span></div>
                    <div data-node-id="204:114" style={{ width: 230 }}><span data-node-id="204:115">Kedalaman data</span></div>
                    <div className="ex-r" data-node-id="204:116" style={{ width: 180 }}><span data-node-id="204:117">Total anggaran</span></div>
                    <div className="ex-r" data-node-id="204:119" style={{ width: 110 }}><span data-node-id="204:120">Aksi</span></div>
                  </div>

                  {rows.map((inst, i) => (
                    <div className={`ex-row${i === 4 ? ' last' : ''}`} key={inst.id} data-node-id={ROW_IDS[i].row}>
                      <div className="ex-name" data-node-id={ROW_IDS[i].name}>
                        <span className="ex-avatar" data-node-id={ROW_IDS[i].avatar} aria-hidden="true">
                          <Ico g="building" slot={18} />
                        </span>
                        <span className="ex-nameblock" data-node-id={ROW_IDS[i].block}>
                          <span className="ex-namewrap" data-node-id={ROW_IDS[i].nameWrap}>
                            <Link to={`/instansi/${inst.slug}`} className="ex-name-t" data-node-id={ROW_IDS[i].nameText}>{inst.judul}</Link>
                          </span>
                          <span className="ex-subwrap" data-node-id={ROW_IDS[i].subWrap}>
                            <span className="ex-sub" data-node-id={ROW_IDS[i].subText}>Pemerintah Provinsi DKI Jakarta</span>
                          </span>
                        </span>
                      </div>
                      <div className="ex-depth" data-node-id={ROW_IDS[i].depth} style={{ width: 230 }}>
                        <span data-node-id={ROW_IDS[i].depthText}>{inst.detailed ? 'Sampai sub kegiatan' : 'Tingkat SKPD'}</span>
                      </div>
                      <div className="ex-amount" data-node-id={ROW_IDS[i].amount} style={{ width: 180 }}>
                        <span data-node-id={ROW_IDS[i].amountText}>{formatRupiah(inst.belanja)}</span>
                      </div>
                      <div className="ex-action" data-node-id={ROW_IDS[i].action} style={{ width: 110 }}>
                        <Link to={`/instansi/${inst.slug}`} className="ex-detail" data-node-id={ROW_IDS[i].chip}>
                          <span data-node-id={ROW_IDS[i].chipText}>Detail <span className="ex-arrow">→</span></span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ex-pager" data-node-id="204:211">
                <button className="ex-page" data-node-id="204:212" onClick={() => setPage(Math.max(1, current - 1))} aria-label="Halaman sebelumnya">
                  <span data-node-id="204:213">‹</span>
                </button>
                {windowPages.map((p, i) => (
                  <button
                    key={p}
                    className={`ex-page${p === current ? ' on' : ''}`}
                    data-node-id={PAGE_IDS[i].box}
                    onClick={() => setPage(p)}
                    aria-current={p === current ? 'page' : undefined}
                  >
                    <span data-node-id={PAGE_IDS[i].text}>{p}</span>
                  </button>
                ))}
                <button className="ex-page" data-node-id="204:223" onClick={() => setPage(Math.min(pages, current + 1))} aria-label="Halaman berikutnya">
                  <span data-node-id="204:224">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer ids={FOOT_204} />
    </div>
  );
};
