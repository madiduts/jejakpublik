import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Ico } from '../components/detail/icons';
import { NAV_219, FOOT_219 } from '../lib/frameIds';
import { ARTICLES, CATEGORIES } from '../data/site';

const CARDS = [
  { box: '219:44', body: '219:45', tw: '219:46', title: '219:47', dw: '219:49', desc: '219:50', btn: '219:53', arrow: '219:54' },
  { box: '219:56', body: '219:57', tw: '219:58', title: '219:59', dw: '219:60', desc: '219:61', btn: '219:63', arrow: '219:64' },
  { box: '219:65', body: '219:66', tw: '219:67', title: '219:68', dw: '219:69', desc: '219:70', btn: '219:72', arrow: '219:73' },
  { box: '219:74', body: '219:75', tw: '219:76', title: '219:77', dw: '219:78', desc: '219:79', btn: '219:81', arrow: '219:82' },
  { box: '219:83', body: '219:84', tw: '219:85', title: '219:86', dw: '219:87', desc: '219:88', btn: '219:90', arrow: '219:91' },
  { box: '219:92', body: '219:93', tw: '219:94', title: '219:95', dw: '219:96', desc: '219:97', btn: '219:99', arrow: '219:100' },
];

const CATS = [
  { box: '219:106', text: '219:107' },
  { box: '219:108', text: '219:109' },
  { box: '219:111', text: '219:112' },
  { box: '219:113', text: '219:114' },
  { box: '219:115', text: '219:116' },
  { box: '219:117', text: '219:118' },
];

const SEMUA = 'Semua';

export const Guide: React.FC = () => {
  const [active, setActive] = useState(SEMUA);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of CATEGORIES) map[c] = ARTICLES.filter((a) => a.category === c).length;
    return map;
  }, []);

  const shown = useMemo(
    () => (active === SEMUA ? ARTICLES : ARTICLES.filter((a) => a.category === active)),
    [active],
  );

  return (
    <div className="lp" data-figma-root data-node-id="219:2">
      <Navbar ids={NAV_219} />

      <section className="gd-hero" data-node-id="219:26">
        <div className="gd-hero-img" aria-hidden="true" />
        <div className="ex-hero-shade" aria-hidden="true" />
        <div className="gd-hero-canvas">
          <div data-node-id="219:30">
            <p className="ex-crumb" data-node-id="219:31">Beranda / Panduan</p>
          </div>
          <div className="ex-h1wrap" data-node-id="219:33">
            <h1 className="ex-h1" data-node-id="219:34">Panduan</h1>
          </div>
        </div>
      </section>

      <section className="gd-sec" data-node-id="219:37">
        <div className="gd-introwrap" data-node-id="219:120">
          <p className="gd-intro" data-node-id="219:39">
            Penjelasan singkat untuk istilah dan cara baca yang muncul di JejakPublik. Ditulis untuk warga, bukan untuk ahli akuntansi.
          </p>
        </div>

        <div className="gd-cats" data-node-id="219:101">
          <div className="gd-chips" role="group" aria-label="Saring panduan menurut kategori">
            <button
              className={`gd-chip${active === SEMUA ? ' on' : ''}`}
              aria-pressed={active === SEMUA}
              onClick={() => setActive(SEMUA)}
            >
              Semua
              <span className="gd-chipn">{ARTICLES.length}</span>
            </button>
            {CATEGORIES.map((c, i) => (
              <button
                className={`gd-chip${active === c ? ' on' : ''}`}
                key={c}
                data-node-id={CATS[i].box}
                aria-pressed={active === c}
                onClick={() => setActive(c)}
              >
                <span data-node-id={CATS[i].text}>{c}</span>
                <span className="gd-chipn">{counts[c]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="gd-gridwrap">
          <div className="gd-grid" data-node-id="219:41">
            <div className="gd-list" data-node-id="219:42">
              <div className="gd-listinner" data-node-id="219:43" key={active}>
                {shown.map((a, order) => {
                  const i = ARTICLES.indexOf(a);
                  const ids = CARDS[i];
                  return (
                    <Link
                      className="gd-card"
                      key={a.slug}
                      to={`/panduan/${a.slug}`}
                      data-node-id={ids.box}
                      style={{ animationDelay: `${order * 35}ms` }}
                    >
                      <div className="gd-cardbody" data-node-id={ids.body}>
                        <div className="gd-meta">
                          <span className="gd-no">{String(i + 1).padStart(2, '0')}</span>
                          <span aria-hidden="true">·</span>
                          <span>{a.reading}</span>
                        </div>
                        <div className="gd-titlewrap" data-node-id={ids.tw}>
                          <span className="gd-title" data-node-id={ids.title}>{a.title}</span>
                        </div>
                        <div className="gd-descwrap" data-node-id={ids.dw}>
                          <span className="gd-desc" data-node-id={ids.desc}>{a.desc}</span>
                        </div>
                      </div>
                      <span className="gd-arrow" data-node-id={ids.btn} aria-hidden="true">
                        <span className="gd-arrowicon" data-node-id={ids.arrow}>
                          <Ico g="chev" slot={20} color="currentColor" />
                        </span>
                      </span>
                    </Link>
                  );
                })}
                {shown.length === 0 && (
                  <p className="gd-empty">
                    Belum ada panduan di kategori ini. Pilih <strong>Semua</strong> untuk melihat keenam panduan.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer ids={FOOT_219} />
    </div>
  );
};
