import React from 'react';
import { Link } from 'react-router-dom';
import { FootIds, FOOT_203 } from '../../lib/frameIds';

export const Footer: React.FC<{ ids?: FootIds }> = ({ ids = FOOT_203 }) => (
  <div className={`lp-footwrap${ids.compact ? ' compact' : ''}`} data-node-id={ids.wrap}>
    <footer className="lp-foot" data-node-id={ids.foot} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Siluet Jejak Kaki Vektor (Figma node 148:239) */}
      <div
        className="lp-foot-footprints-wrap"
        aria-hidden="true"
        style={{
          width: '100%',
          maxWidth: '1090px',
          overflow: 'hidden',
          marginBottom: '24px',
          opacity: 0.5,
          pointerEvents: 'none'
        }}
      >
        <img
          src="/assets/jejak-kaki.svg"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Tipografi PUBLIK Vektor Asli (Figma node 148:248) */}
      <div className="lp-foot-brandwrap" data-node-id={ids.brandWrap} style={{ position: 'relative', zIndex: 2, marginTop: '20px', marginBottom: '32px' }}>
        <Link to="/" className="lp-foot-brand" data-node-id={ids.brand} aria-label="JejakPublik" title="JejakPublik">
          <img
            src="/assets/publik-title.svg"
            alt="PUBLIK"
            width={465}
            height={85}
            style={{
              display: 'block',
              width: 'clamp(220px, 32vw, 465px)',
              height: 'auto'
            }}
          />
        </Link>
      </div>

      {!ids.compact && (
      <div className="lp-foot-colswrap" data-node-id={ids.colsWrap}>
        <div className="lp-foot-cols" data-node-id={ids.cols}>
          <div data-node-id={ids.col[0].box}>
            <div className="lp-foot-headwrap" data-node-id={ids.col[0].headWrap}>
              <h4 className="lp-foot-h" data-node-id={ids.col[0].head}>Data</h4>
            </div>
            <div data-node-id={ids.col[0].bodyWrap}>
              <p className="lp-foot-t" data-node-id={ids.col[0].body}>{'43 instansi daerah\nDLH: 8 program, 15 kegiatan, 33 sub\nTA 2025'}</p>
            </div>
          </div>

          <div data-node-id={ids.col[1].box}>
            <div className="lp-foot-headwrap" data-node-id={ids.col[1].headWrap}>
              <h4 className="lp-foot-h" data-node-id={ids.col[1].head}>Rujukan</h4>
            </div>
            <div data-node-id={ids.col[1].bodyWrap}>
              <p className="lp-foot-t" data-node-id={ids.col[1].body}>
                <Link to="/istilah">Glosarium istilah</Link>{'\n'}
                <Link to="/panduan">Panduan membaca</Link>{'\n'}
                <Link to="/tentang">Tentang dan metode</Link>
              </p>
            </div>
          </div>

          <div data-node-id={ids.col[2].box}>
            <div className="lp-foot-headwrap" data-node-id={ids.col[2].headWrap}>
              <h4 className="lp-foot-h" data-node-id={ids.col[2].head}>Batas</h4>
            </div>
            <div data-node-id={ids.col[2].bodyWrap}>
              <p className="lp-foot-t" data-node-id={ids.col[2].body}>{'Bukan data real-time\nBukan kanal pengaduan\nBukan vonis korupsi'}</p>
            </div>
          </div>

          <div data-node-id={ids.col[3].box}>
            <div className="lp-foot-headwrap" data-node-id={ids.col[3].headWrap}>
              <h4 className="lp-foot-h" data-node-id={ids.col[3].head}>Sumber</h4>
            </div>
            <div data-node-id={ids.col[3].bodyWrap}>
              <p className="lp-foot-t" data-node-id={ids.col[3].body}>{'Dashboard Keuangan BPKD\nLKIP Dinas Lingkungan Hidup 2025\nDiambil 21 Oktober 2026'}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="lp-foot-legal" data-node-id={ids.legal} />
    </footer>
  </div>
);
