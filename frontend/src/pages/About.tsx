import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_222, FOOT_222 } from '../lib/frameIds';
import { programTotals, unitKerja, indikator } from '../lib/data';

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

      <div className="ab-band" role="list">
        <div role="listitem"><b>43</b><span>perangkat daerah</span></div>
        <div role="listitem"><b>{`8 / ${programTotals.kegiatan} / ${programTotals.subKegiatan}`}</b><span>program / kegiatan / sub</span></div>
        <div role="listitem"><b>{`${indikator.length} / ${unitKerja.length}`}</b><span>indikator / unit kerja</span></div>
        <div role="listitem"><b>TA 2025</b><span>periode selesai</span></div>
      </div>

      <div className="ab-faq">
        <details open>
          <summary>Portal ini apa?<span>01</span></summary>
          <p>Halaman yang membantu warga membaca anggaran daerah: berapa yang direncanakan, berapa yang dibelanjakan, dan hasil apa yang dilaporkan — lengkap dengan dokumen sumbernya.</p>
        </details>
        <details>
          <summary>Dari mana angkanya?<span>02</span></summary>
          <p>Dashboard Keuangan BPKD DKI untuk 43 perangkat daerah, LKIP Dinas Lingkungan Hidup 2025 untuk rincian sampai sub kegiatan, dan LKIP Dinas Bina Marga 2025 sebagai pembanding struktur. Semua diambil 21 Oktober 2026.</p>
        </details>
        <details>
          <summary>Kenapa ada angka yang kosong?<span>03</span></summary>
          <p>Kalau sebuah nilai tidak dapat dipastikan dari dokumen, kami menahannya. Angka itu tidak diubah menjadi nol dan tidak masuk perhitungan total, karena nol berarti “tidak ada uang” — bukan “belum diketahui”.</p>
        </details>
        <details>
          <summary>Kalau dua dokumen berbeda?<span>04</span></summary>
          <p>Keduanya ditampilkan. Kami menjumlah ulang seluruh baris, membandingkan dengan total yang tercetak, lalu memakai nilai yang membuat total tercapai. Hitungannya bisa diperiksa di <a href="/perbandingan">halaman perbandingan</a>.</p>
        </details>
        <details>
          <summary>Apakah ini data resmi?<span>05</span></summary>
          <p>Angkanya berasal dari dokumen resmi, tetapi halaman ini bukan produk pemerintah dan bukan pengganti dokumen aslinya. Kami mencantumkan tabel dan halaman supaya kamu bisa memeriksa sendiri.</p>
        </details>
        <details>
          <summary>Apa yang tidak kami lakukan?<span>06</span></summary>
          <p>Kami tidak memutuskan apakah uang dipakai dengan benar, tidak menjadi kanal pengaduan resmi, tidak menyajikan data waktu nyata, dan tidak meminta NIK, KTP, atau biometrik.</p>
        </details>
        <details>
          <summary>Siapa yang membuat?<span>07</span></summary>
          <p>Tiga orang: Muhammad Zayyan Rizka (data dan knowledge), Mahdi Imantaka Sutejo (frontend dan mesin data keuangan), Liaurentino (desain dan frontend). Proyek ini dibuat untuk WIA MIA 2026.</p>
        </details>
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

      <p className="ab-credits">
        Data diambil 21 Oktober 2026. Foto: Wikimedia Commons (CC BY-SA 3.0, CC BY 3.0). Ikon: Lucide (ISC).
        Menemukan angka yang janggal? <a href="/lapor">Kirim laporan</a> — setiap koreksi yang diterima dicatat pada riwayat angka.
      </p>
    </section>

    <Footer ids={FOOT_222} />
  </div>
);
