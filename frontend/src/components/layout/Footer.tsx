import React from 'react';
import { Link } from 'react-router-dom';
import { FootIds, FOOT_203 } from '../../lib/frameIds';

export const Footer: React.FC<{ ids?: FootIds }> = ({ ids = FOOT_203 }) => (
  <div className="lp-footwrap" data-node-id={ids.wrap}>
    <footer className="lp-foot" data-node-id={ids.foot}>
      <div className="lp-foot-brandwrap" data-node-id={ids.brandWrap}>
        <Link to="/" className="lp-foot-brand" data-node-id={ids.brand}>JejakPublik</Link>
      </div>

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

      <div className="lp-foot-legal" data-node-id={ids.legal} />
    </footer>
  </div>
);
