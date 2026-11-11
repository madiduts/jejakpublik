import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ico } from '../components/detail/icons';
import { NAV_204, FOOT_204 } from '../lib/frameIds';
import { instansiList, totals } from '../lib/data';
import { formatRupiah } from '../utils/format';

const PAGE_SIZE = 6;

/** 204:121 … 204:210 — lima baris tabel pada frame. */
const ROW_IDS = [
  { row: '204:121', name: '204:122', avatar: '204:123', block: '204:126', nameWrap: '204:127', nameText: '204:128', subWrap: '204:129', subText: '204:130', depth: '204:133', depthText: '204:134', amount: '204:136', amountText: '204:137', action: '204:139', chip: '204:140', chipText: '204:141' },
  { row: '204:143', name: '204:144', avatar: '204:145', block: '204:147', nameWrap: '204:148', nameText: '204:149', subWrap: '204:150', subText: '204:151', depth: '204:153', depthText: '204:154', amount: '204:155', amountText: '204:156', action: '204:157', chip: '204:158', chipText: '204:159' },
  { row: '204:160', name: '204:161', avatar: '204:162', block: '204:164', nameWrap: '204:165', nameText: '204:166', subWrap: '204:167', subText: '204:168', depth: '204:170', depthText: '204:171', amount: '204:172', amountText: '204:173', action: '204:174', chip: '204:175', chipText: '204:176' },
  { row: '204:177', name: '204:178', avatar: '204:179', block: '204:181', nameWrap: '204:182', nameText: '204:183', subWrap: '204:184', subText: '204:185', depth: '204:187', depthText: '204:188', amount: '204:189', amountText: '204:190', action: '204:191', chip: '204:192', chipText: '204:193' },
  { row: '204:194', name: '204:195', avatar: '204:196', block: '204:198', nameWrap: '204:199', nameText: '204:200', subWrap: '204:201', subText: '204:202', depth: '204:204', depthText: '204:205', amount: '204:206', amountText: '204:207', action: '204:208', chip: '204:209', chipText: '204:210' },
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
  const [selInstansi, setSelInstansi] = useState<string[]>([]);
  const [kedalaman, setKedalaman] = useState<'semua' | 'rinci' | 'skpd'>('semua');
  const [instQuery, setInstQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('anggaran');
  const [sortMenu, setSortMenu] = useState(false);
  const [yearMenu, setYearMenu] = useState(false);

  const panelList = useMemo(
    () => [...instansiList].sort((a, b) => a.judul.localeCompare(b.judul, 'id')),
    []
  );
  const panelShown = useMemo(() => {
    const t = instQuery.trim().toLowerCase();
    return t ? panelList.filter((i) => i.judul.toLowerCase().includes(t)) : panelList;
  }, [panelList, instQuery]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return byBudget.filter((i) => {
      if (term && !i.nama.toLowerCase().includes(term)) return false;
      if (selInstansi.length > 0 && !selInstansi.includes(i.judul)) return false;
      if (kedalaman === 'rinci' && !i.detailed) return false;
      if (kedalaman === 'skpd' && i.detailed) return false;
      return true;
    });
  }, [q, selInstansi, kedalaman]);

  const ordered = useMemo(() => {
    const list = [...filtered];
    if (sort === 'nama') list.sort((a, b) => a.judul.localeCompare(b.judul, 'id'));
    if (sort === 'serapan') {
      const pct = (i: typeof list[number]) => (i.belanja ? i.belanjaRealisasi / i.belanja : 0);
      list.sort((a, b) => pct(b) - pct(a));
    }
    return list;
  }, [filtered, sort]);

  const pages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = ordered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  /** Jendela empat nomor halaman seperti frame; bergeser bila halaman aktif melewatinya. */
  const windowStart = Math.min(Math.max(1, current - 2), Math.max(1, pages - 3));
  const windowPages = [0, 1, 2, 3].map((i) => windowStart + i).filter((p) => p <= pages);

  const toggleInstansi = (nama: string) => {
    setSelInstansi((c) => (c.includes(nama) ? c.filter((x) => x !== nama) : [...c, nama]));
    setPage(1);
  };

  /** Dropdown menu ditutup oleh klik di luar, Escape, atau pilihan. */
  useEffect(() => {
    if (!sortMenu && !yearMenu) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.ex-menu') && !t.closest('.ex-sortbtn')) setSortMenu(false);
      if (!t.closest('.ex-menu') && !t.closest('.ex-yearrow')) setYearMenu(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSortMenu(false); setYearMenu(false); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [sortMenu, yearMenu]);

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

        <div className="ex-body-wrap" data-node-id="204:228">
          <div className="ex-body" data-node-id="204:52">
            <aside className="ex-filters-col">
              <div className="ex-filters-head">
                <span className="ex-filters-title" data-node-id="204:55">Filter</span>
              </div>

              <div className="ex-cardwrap">
                <div className="ex-filters" data-node-id="204:53">
                  <div className="ex-group-wrap" data-node-id="204:100">
                    <div className="ex-group ex-group-first" data-node-id="204:59">
                      <label className="ex-psearch">
                    <Ico g="search" slot={14} />
                    <input
                      value={instQuery}
                      onChange={(e) => setInstQuery(e.target.value)}
                      placeholder="Cari instansi"
                      aria-label="Cari instansi di panel filter"
                    />
                  </label>
                  <div className="ex-pscroll">
                    <div className="ex-plist">
                      {panelShown.map((inst) => (
                        <label className="ex-item ex-pitem" key={inst.id}>
                          <input
                            type="checkbox"
                            className={`ex-cb${selInstansi.includes(inst.judul) ? ' on' : ''}`}
                            checked={selInstansi.includes(inst.judul)}
                            onChange={() => toggleInstansi(inst.judul)}
                            aria-label={inst.judul}
                          />
                          <span className="ex-item-l">{inst.judul}</span>
                        </label>
                      ))}
                      {panelShown.length === 0 && <p className="ex-pempty">Tidak ada instansi yang cocok.</p>}
                    </div>
                  </div>
                  <div className="ex-pmeta">
                    <span>{panelShown.length} instansi</span>
                    <button type="button" onClick={() => { setSelInstansi([]); setPage(1); }}>Hapus pilihan</button>
                  </div>
                </div>
              </div>

              <div className="ex-group-wrap" data-node-id="204:101">
                <div className="ex-group" data-node-id="204:79">
                  <div className="ex-group-hwrap" data-node-id="204:80">
                    <span className="ex-group-h" data-node-id="204:81">Tahun anggaran</span>
                  </div>
                  <div className="ex-yearwrap">
                    <button
                      className="ex-yearrow"
                      data-node-id="204:82"
                      aria-haspopup="listbox"
                      aria-expanded={yearMenu}
                      onClick={() => setYearMenu((v) => !v)}
                    >
                      <span data-node-id="204:84">2025</span>
                      <Ico g="chevdown" slot={12} />
                    </button>
                    {yearMenu && (
                      <div className="ex-menu ex-menu-left" role="listbox">
                        <button role="option" aria-selected onClick={() => setYearMenu(false)}>
                          2025 <span className="ex-tick">✓</span>
                        </button>
                        <button role="option" aria-disabled="true" disabled className="ex-menu-off">
                          2024 · belum ada data
                        </button>
                      </div>
                    )}
                  </div>
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
                    <input
                      type="checkbox"
                      className={`ex-cb${kedalaman === 'rinci' ? ' on' : ''}`}
                      data-node-id="204:94"
                      checked={kedalaman === 'rinci'}
                      onChange={() => { setKedalaman((v) => (v === 'rinci' ? 'semua' : 'rinci')); setPage(1); }}
                      aria-label="Sampai sub kegiatan"
                    />
                    <span className="ex-item-l" data-node-id="204:95">Sampai sub kegiatan</span>
                  </label>
                  <label className="ex-item" data-node-id="204:96">
                    <input
                      type="checkbox"
                      className={`ex-cb${kedalaman === 'skpd' ? ' on' : ''}`}
                      data-node-id="204:97"
                      checked={kedalaman === 'skpd'}
                      onChange={() => { setKedalaman((v) => (v === 'skpd' ? 'semua' : 'skpd')); setPage(1); }}
                      aria-label="Tingkat SKPD"
                    />
                    <span className="ex-item-l" data-node-id="204:98">Tingkat SKPD</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

            <div className="ex-list" data-node-id="204:103">
              <div className="ex-list-head" data-node-id="204:104">
                <span className="ex-th18" data-node-id="204:105"><span className="ex-t16" data-node-id="204:106">{rows.length} dari {totals.instansi} instansi</span></span>
                <span className="ex-sortwrap">
                  <button
                    className={`ex-sortbtn${sort !== 'anggaran' ? ' on' : ''}`}
                    data-node-id="204:107"
                    aria-label={`Urutkan: ${SORT_LABEL[sort].replace('Urutkan: ', '')}`}
                    aria-haspopup="menu"
                    aria-expanded={sortMenu}
                    onClick={() => setSortMenu((v) => !v)}
                  >
                    <Ico g="sort" slot={17} />
                  </button>
                  {sortMenu && (
                    <div className="ex-menu ex-menu-right" role="menu" onMouseDown={(ev) => ev.stopPropagation()}>
                      {(['anggaran', 'nama', 'serapan'] as const).map((v) => (
                        <button
                          key={v}
                          role="menuitemradio"
                          aria-checked={sort === v}
                          onClick={() => { setSort(v); setSortMenu(false); }}
                        >
                          {SORT_LABEL[v].replace('Urutkan: ', '')}
                          <span className="ex-tick">{sort === v ? '✓' : ''}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </span>
              </div>

              <div className="ex-cardwrap" data-node-id="204:225">
                <div className="ex-card" data-node-id="204:109">
                  <div className="ex-thead" data-node-id="204:110">
                    <div data-node-id="204:111"><span data-node-id="204:112">Nama instansi</span></div>
                    <div className="ex-c-depth" data-node-id="204:114"><span data-node-id="204:115">Kedalaman data</span></div>
                    <div className="ex-r ex-c-total" data-node-id="204:116"><span data-node-id="204:117">Total anggaran</span></div>
                    <div className="ex-r ex-c-aksi" data-node-id="204:119"><span data-node-id="204:120">Aksi</span></div>
                  </div>

                  {rows.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, color: 'var(--muted)', fontSize: 13.5 }}>
                      Tidak ada instansi yang cocok dengan filter pencarian.
                    </div>
                  ) : (
                    <div key={current} className="ex-rows-anim">
                      {rows.map((inst, i) => (
                        <div className={`ex-row${i === rows.length - 1 ? ' last' : ''}`} key={inst.id} data-node-id={ROW_IDS[i]?.row}>
                          <div className="ex-name" data-node-id={ROW_IDS[i]?.name}>
                            <span className="ex-avatar" data-node-id={ROW_IDS[i]?.avatar} aria-hidden="true">
                              <Ico g="building" slot={18} />
                            </span>
                            <span className="ex-nameblock" data-node-id={ROW_IDS[i]?.block}>
                              <span className="ex-namewrap" data-node-id={ROW_IDS[i]?.nameWrap}>
                                <Link to={`/instansi/${inst.slug}`} className="ex-name-t" data-node-id={ROW_IDS[i]?.nameText}>{inst.judul}</Link>
                              </span>
                              <span className="ex-subwrap" data-node-id={ROW_IDS[i]?.subWrap}>
                                <span className="ex-sub" data-node-id={ROW_IDS[i]?.subText}>Pemerintah Provinsi DKI Jakarta</span>
                              </span>
                            </span>
                          </div>
                          <div className="ex-depth ex-c-depth" data-node-id={ROW_IDS[i]?.depth}>
                            <span data-node-id={ROW_IDS[i]?.depthText}>{inst.detailed ? 'Sampai sub kegiatan' : 'Tingkat SKPD'}</span>
                          </div>
                          <div className="ex-amount ex-c-total" data-node-id={ROW_IDS[i]?.amount}>
                            <span data-node-id={ROW_IDS[i]?.amountText}>{formatRupiah(inst.belanja)}</span>
                          </div>
                          <div className="ex-action ex-c-aksi" data-node-id={ROW_IDS[i]?.action}>
                            <Link
                              to={`/instansi/${inst.slug}`}
                              className="ex-detail"
                              data-node-id={ROW_IDS[i]?.chip}
                              aria-label={`Buka ${inst.judul}`}
                            >
                              <Ico g="diag" slot={14} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
