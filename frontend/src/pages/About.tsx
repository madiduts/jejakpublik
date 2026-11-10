import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_222, FOOT_222 } from '../lib/frameIds';
import { totals, programTotals, unitKerja, indikator } from '../lib/data';

const CAKUPAN = [
  { box: '222:48', label: '222:49', labelText: '222:50', value: '222:51', valueText: '222:52', l: 'Lapis luas, Dashboard BPKD', v: `${totals.instansi} instansi` },
  { box: '222:54', label: '222:55', labelText: '222:56', value: '222:57', valueText: '222:58', l: 'Lapis dalam, LKIP DLH 2025', v: `${programTotals.kegiatan === 15 ? 8 : programTotals.kegiatan} / ${programTotals.kegiatan} / ${programTotals.subKegiatan}` },
  { box: '222:59', label: '222:60', labelText: '222:61', value: '222:62', valueText: '222:63', l: 'Indikator dan unit kerja', v: `${indikator.length} / ${unitKerja.length}` },
  { box: '222:64', label: '222:65', labelText: '222:66', value: '222:67', valueText: '222:68', l: 'Periode', v: 'TA 2025 (selesai)' },
];

const SUMBER = [
  { box: '222:78', label: '222:79', labelText: '222:80', value: '222:81', valueText: '222:82', l: 'Dashboard Keuangan BPKD DKI', v: '43 instansi, tiga kelompok' },
  { box: '222:83', label: '222:84', labelText: '222:85', value: '222:86', valueText: '222:87', l: 'LKIP Dinas Lingkungan Hidup 2025', v: 'Rincian sampai sub kegiatan' },
  { box: '222:88', label: '222:89', labelText: '222:90', value: '222:91', valueText: '222:92', l: 'LKIP Dinas Bina Marga 2025', v: 'Pembanding struktur' },
  { box: '222:93', label: '222:94', labelText: '222:95', value: '222:96', valueText: '222:97', l: 'UU 17/2025 APBN 2026', v: 'Konteks transfer pusat' },
];

const KEADAAN = [
  { box: '222:106', text: '222:107', t: 'Normal — konsisten dengan pembanding.' },
  { box: '222:109', text: '222:110', t: 'Dikoreksi — ada kesalahan cetak yang bisa direkonsiliasi, disertai riwayat.' },
  { box: '222:111', text: '222:112', t: 'Ditahan — belum ada pembanding; tidak diubah menjadi nol.' },
  { box: '222:113', text: '222:114', t: 'Tidak dilaporkan — sumber tidak mencantumkan nilai.' },
];

const BATAS = [
  { box: '222:123', text: '222:124', t: 'Bukan vonis korupsi atau penyimpangan.' },
  { box: '222:125', text: '222:126', t: 'Bukan pengganti dokumen resmi atau kanal pengaduan.' },
  { box: '222:127', text: '222:128', t: 'Tidak menjanjikan instansi menindaklanjuti laporan.' },
  { box: '222:129', text: '222:130', t: 'Tidak meminta NIK, KTP, atau biometrik.' },
];

const TIM = [
  { box: '222:139', nameWrap: '222:140', name: '222:141', roleWrap: '222:142', role: '222:143', n: 'Muhammad Zayyan Rizka', r: 'Ketua tim, data dan knowledge' },
  { box: '222:146', nameWrap: '222:147', name: '222:148', roleWrap: '222:149', role: '222:150', n: 'Mahdi Imantaka Sutejo', r: 'Frontend dan mesin data keuangan' },
  { box: '222:152', nameWrap: '222:153', name: '222:154', roleWrap: '222:155', role: '222:156', n: 'Liaurentino', r: 'Desain UI/UX dan frontend' },
];

export const About: React.FC = () => (
  <div className="lp" data-figma-root data-node-id="222:2">
    <Navbar ids={NAV_222} />

    <section className="gd-hero" data-node-id="222:26">
      <div className="lp-hero-img" aria-hidden="true" />
      <div className="ex-hero-shade" aria-hidden="true" />
      <div className="gd-hero-canvas">
        <div data-node-id="222:30">
          <p className="ex-crumb" data-node-id="222:31">Beranda / Tentang</p>
        </div>
        <div className="ex-h1wrap" data-node-id="222:33">
          <h1 className="ex-h1" data-node-id="222:34">Tentang JejakPublik</h1>
        </div>
      </div>
    </section>

    <section className="ab-sec" data-node-id="222:37">
      <div className="ab-introwrap" data-node-id="222:158">
        <p className="ab-intro" data-node-id="222:39">
          Portal informasi anggaran publik. Warga membaca fakta, sumber, dan keterbatasannya, lalu menilai sendiri.
        </p>
      </div>

      <div className="ab-gridwrap" data-node-id="222:159">
        <div className="ab-grid" data-node-id="222:41">
          <div className="ab-left" data-node-id="222:42">
            <div className="ab-cardwrap" data-node-id="222:99">
              <div className="ab-card" data-node-id="222:43">
                <h2 className="ab-h2" data-node-id="222:45">Cakupan dan periode</h2>
                <div className="ab-rows" data-node-id="222:47">
                  {CAKUPAN.map((r) => (
                    <div className="ab-row" key={r.box} data-node-id={r.box}>
                      <span className="ab-row-l" data-node-id={r.label}><span data-node-id={r.labelText}>{r.l}</span></span>
                      <span className="ab-row-v" data-node-id={r.value}><span data-node-id={r.valueText}>{r.v}</span></span>
                    </div>
                  ))}
                </div>
                <div className="ab-notewrap" data-node-id="222:69">
                  <p className="ab-note" data-node-id="222:70">
                    Data historis, bukan pemantauan langsung. 42 instansi lain baru tersedia pada tingkat SKPD.
                  </p>
                </div>
              </div>
            </div>

            <div className="ab-cardwrap" data-node-id="222:100">
              <div className="ab-card" data-node-id="222:74">
                <h2 className="ab-h2" data-node-id="222:76">Sumber data</h2>
                <div className="ab-rows" data-node-id="222:77">
                  {SUMBER.map((r) => (
                    <div className="ab-row" key={r.box} data-node-id={r.box}>
                      <span className="ab-row-l" data-node-id={r.label}><span data-node-id={r.labelText}>{r.l}</span></span>
                      <span className="ab-row-v" data-node-id={r.value}><span data-node-id={r.valueText}>{r.v}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ab-right" data-node-id="222:101">
            <div className="ab-card" data-node-id="222:102">
              <h2 className="ab-h2" data-node-id="222:104">Keadaan angka</h2>
              <div className="ab-list" data-node-id="222:105">
                {KEADAAN.map((p) => (
                  <div className="ab-p" key={p.box} data-node-id={p.box}>
                    <p className="ab-p-t strong" data-node-id={p.text}>{p.t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ab-cardwrap" data-node-id="222:135">
              <div className="ab-card" data-node-id="222:119">
                <h2 className="ab-h2" data-node-id="222:121">Batas tanggung jawab</h2>
                <div className="ab-list" data-node-id="222:122">
                  {BATAS.map((p) => (
                    <div className="ab-p" key={p.box} data-node-id={p.box}>
                      <p className="ab-p-t" data-node-id={p.text}>{p.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ab-timhead" data-node-id="222:136">
        <h2 className="ab-h2" data-node-id="222:137">Tim</h2>
      </div>

      <div className="ab-timwrap" data-node-id="222:161">
        <div className="ab-team" data-node-id="222:138">
          {TIM.map((m) => (
            <div className="ab-member" key={m.box} data-node-id={m.box}>
              <div className="ab-mnamewrap" data-node-id={m.nameWrap}>
                <span className="ab-mname" data-node-id={m.name}>{m.n}</span>
              </div>
              <div className="ab-mrolewrap" data-node-id={m.roleWrap}>
                <span className="ab-mrole" data-node-id={m.role}>{m.r}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer ids={FOOT_222} />
  </div>
);
