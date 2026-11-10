import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <div className="lp-footwrap" data-node-id="203:238">
    <footer className="lp-foot" data-node-id="203:202">
      <div className="lp-foot-brandwrap" data-node-id="203:203">
        <Link to="/" className="lp-foot-brand" data-node-id="203:204">JejakPublik</Link>
      </div>

      <div className="lp-foot-colswrap" data-node-id="203:236">
        <div className="lp-foot-cols" data-node-id="203:206">
          <div data-node-id="203:207">
            <div className="lp-foot-headwrap" data-node-id="203:208">
              <h4 className="lp-foot-h" data-node-id="203:209">Data</h4>
            </div>
            <div data-node-id="203:214">
              <p className="lp-foot-t" data-node-id="203:211">{'43 instansi daerah\nDLH: 8 program, 15 kegiatan, 33 sub\nTA 2025'}</p>
            </div>
          </div>

          <div data-node-id="203:215">
            <div className="lp-foot-headwrap" data-node-id="203:216">
              <h4 className="lp-foot-h" data-node-id="203:217">Rujukan</h4>
            </div>
            <div data-node-id="203:220">
              <p className="lp-foot-t" data-node-id="203:218">
                <Link to="/istilah">Glosarium istilah</Link>{'\n'}
                <Link to="/panduan">Panduan membaca</Link>{'\n'}
                <Link to="/tentang">Tentang dan metode</Link>
              </p>
            </div>
          </div>

          <div data-node-id="203:221">
            <div className="lp-foot-headwrap" data-node-id="203:222">
              <h4 className="lp-foot-h" data-node-id="203:223">Batas</h4>
            </div>
            <div data-node-id="203:226">
              <p className="lp-foot-t" data-node-id="203:224">{'Bukan data real-time\nBukan kanal pengaduan\nBukan vonis korupsi'}</p>
            </div>
          </div>

          <div data-node-id="203:227">
            <div className="lp-foot-headwrap" data-node-id="203:228">
              <h4 className="lp-foot-h" data-node-id="203:229">Sumber</h4>
            </div>
            <div data-node-id="203:232">
              <p className="lp-foot-t" data-node-id="203:230">{'Dashboard Keuangan BPKD\nLKIP Dinas Lingkungan Hidup 2025\nDiambil 21 Oktober 2026'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-foot-legal" data-node-id="203:233" />
    </footer>
  </div>
);
