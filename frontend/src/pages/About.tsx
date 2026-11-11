import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_222, FOOT_222 } from '../lib/frameIds';

const TIM = [
  { box: '222:139', nameWrap: '222:140', name: '222:141', roleWrap: '222:142', role: '222:143', n: 'Muhammad Zayyan Rizka', r: 'Ketua tim, data dan knowledge' },
  { box: '222:146', nameWrap: '222:147', name: '222:148', roleWrap: '222:149', role: '222:150', n: 'Mahdi Imantaka Sutejo', r: 'Frontend dan mesin data keuangan' },
  { box: '222:152', nameWrap: '222:153', name: '222:154', roleWrap: '222:155', role: '222:156', n: 'Liaurentino', r: 'Desain UI/UX dan frontend' },
];

const FAQ: { q: string; a: string[] }[] = [
  {
    q: 'Portal ini apa?',
    a: [
      'JejakPublik membantu warga membaca anggaran daerah tanpa harus membuka dokumen ratusan halaman: berapa yang direncanakan, berapa yang sudah dibelanjakan, dan hasil apa yang dilaporkan.',
      'Setiap angka membawa rujukan ke tabel dan halaman dokumen asalnya, sehingga kamu bisa memeriksanya sendiri. Kami tidak menyimpulkan apakah uang itu dipakai dengan benar; kami hanya memastikan angkanya bisa dilacak.'
    ],
  },
  {
    q: 'Dari mana angkanya?',
    a: [
      '3 sumber utama: Dashboard Keuangan BPKD DKI untuk 43 perangkat daerah, LKIP Dinas Lingkungan Hidup 2025 untuk rincian sampai sub kegiatan, dan LKIP Dinas Bina Marga 2025 sebagai pembanding struktur.',
      'Semua diambil pada 21 Oktober 2026 dari dokumen tahun anggaran 2025 yang sudah selesai. Tidak ada angka yang kami perkirakan atau isi sendiri; bila sebuah nilai tidak ada di dokumen, ia ditandai tidak dilaporkan.'
    ],
  },
  {
    q: 'Kenapa ada angka yang kosong?',
    a: [
      'Kalau sebuah nilai tidak dapat dipastikan dari dokumen, kami menahannya. Angka itu tampil kosong dengan alasan di bawahnya, tidak dijumlahkan ke total mana pun, dan tidak masuk penyebut persentase.',
      'Menganggapnya nol akan membuat total terlihat lebih kecil daripada kenyataan — itu kesalahan yang lebih berbahaya daripada tidak menampilkan apa pun. Contohnya pos pembiayaan: hanya 14 dari 43 instansi yang memuatnya, dan ketiadaan baris itu bukan berarti nilainya nol.'
    ],
  },
  {
    q: 'Kalau dua dokumen berbeda?',
    a: [
      'Keduanya ditampilkan. Kami menjumlah ulang seluruh baris, membandingkan dengan total yang tercetak, lalu memakai nilai yang membuat total tercapai. Hasilnya bisa kamu periksa pada halaman perbandingan.',
      'Contoh nyata: Tabel 2.4 mencetak Rp67.876.101.084 untuk satu baris, sedangkan Tabel 3.34 mencetak Rp3.684.567.176. Setelah dikurangkan dari total program, sisanya cocok dengan Tabel 3.34 dan dengan total Dashboard BPKD — jadi angka Tabel 3.34 yang kami pakai, dan kedua angka itu tetap ditampilkan.'
    ],
  },
  {
    q: 'Apakah ini data resmi?',
    a: [
      'Angkanya berasal dari dokumen resmi, tetapi halaman ini bukan produk Pemerintah Provinsi DKI Jakarta dan bukan pengganti dokumen aslinya.',
      'Karena itu setiap baris menyebut nama dokumen, nomor tabel, dan tanggal pengambilan. Kalau kamu menemukan selisih, rujukan itu yang menjadi titik awal pemeriksaan.'
    ],
  },
  {
    q: 'Apa yang tidak kami lakukan?',
    a: [
      'Kami tidak memutuskan apakah uang dipakai dengan benar atau tidak — itu ranah audit dan penegakan hukum, bukan portal data.',
      'Kami juga bukan kanal pengaduan resmi, tidak menyajikan data waktu nyata, tidak menjanjikan instansi menindaklanjuti laporan, dan tidak pernah meminta NIK, KTP, atau data biometrik.'
    ],
  },
  {
    q: 'Siapa yang membuat?',
    a: [
      'Tiga orang: Muhammad Zayyan Rizka (data dan knowledge), Mahdi Imantaka Sutejo (frontend dan mesin data keuangan), Liaurentino (desain UI/UX dan frontend).',
      'Proyek ini dibuat untuk WIA MIA 2026 dengan tema keterbukaan data publik. Kode dan metodologinya dapat diperiksa, termasuk daftar koreksi yang pernah dilakukan.'
    ],
  },
];

const REFS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Riset empiris kepercayaan publik',
    a: (
      <>
        <p>
          Hamzah, M., Surahman, F., Abdurahman, Imam, A., Saputri, E., &amp; Basyarahil, A. (2024). Transparansi anggaran publik
          sebagai kunci peningkatan kepercayaan masyarakat terhadap pemerintah daerah.{' '}
          <em>Assyarikah: Journal of Islamic Economic Business</em>, 5(2), 199–221.{' '}
          <a href="https://doi.org/10.35905/assyarikah.v5i2.1891" target="_blank" rel="noopener noreferrer">
            https://doi.org/10.35905/assyarikah.v5i2.1891
          </a>
        </p>
        <p className="ab-ref-find">
          Temuan kunci: survei 400 responden menunjukkan transparansi data anggaran berpengaruh positif dan signifikan
          terhadap kepercayaan warga (R² = 0,391, koefisien regresi 0,625).
        </p>
      </>
    ),
  },
  {
    q: 'Telaah masalah keuangan negara',
    a: (
      <>
        <p>
          Widodo, T. (2025). Akuntabilitas dan rekonsiliasi data belanja daerah dalam sistem pengelolaan keuangan publik.{' '}
          <em>Jurnal Budget: Isu dan Masalah Keuangan Negara</em>, 10(1), 1–21.
        </p>
        <p className="ab-ref-find">
          Temuan kunci: rekonsiliasi data belanja secara independen diperlukan untuk mencegah bias pencatatan dan
          memudahkan audit partisipatif warga.
        </p>
      </>
    ),
  },
  {
    q: 'Tolok ukur internasional',
    a: (
      <>
        <p>
          International Budget Partnership. (2023). <em>Open budget survey 2023: Indonesia country report</em>. IBP.{' '}
          <a
            href="https://internationalbudget.org/open-budget-survey/country-results/2023/indonesia"
            target="_blank"
            rel="noopener noreferrer"
          >
            internationalbudget.org/open-budget-survey
          </a>
        </p>
        <p className="ab-ref-find">
          Temuan kunci: skor transparansi anggaran Indonesia 70/100, sedangkan skor partisipasi publik dalam pengawasan
          anggaran baru 26/100.
        </p>
      </>
    ),
  },
  {
    q: 'Dasar hukum dan standar aksesibilitas',
    a: (
      <>
        <p>• <strong>Undang-Undang Nomor 14 Tahun 2008</strong> tentang Keterbukaan Informasi Publik (KIP).</p>
        <p>• <strong>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020</strong> tentang Pedoman Teknis Pengelolaan Keuangan Daerah.</p>
        <p>• <strong>W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> untuk keterbacaan kontras tinggi dan navigasi inklusif.</p>
      </>
    ),
  },
];

export const About: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number[]>([0]);
  const [openRef, setOpenRef] = useState<number[]>([0]);

  return (
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

      <div className="ab-faq">
        {FAQ.map((f, i) => {
          const open = openFaq.includes(i);
          return (
            <div className={`ab-faq-item${open ? ' open' : ''}`} key={f.q}>
              <button
                className="ab-faq-q"
                aria-expanded={open}
                aria-controls={`faq-${i}`}
                onClick={() => setOpenFaq((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]))}
              >
                <span>{f.q}</span>
                <span className="ab-faq-n">{String(i + 1).padStart(2, '0')}</span>
              </button>
              <div className="ab-faq-a" id={`faq-${i}`}>
                <div className="ab-faq-inner">
                  {f.a.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
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

      <div className="ab-timhead" style={{ marginTop: 44 }}>
        <h2 className="ab-h2">Landasan Riset & Rujukan Akademik</h2>
      </div>

      <p className="ab-ref-lead">
        Metodologi dan perancangan platform JejakPublik didasarkan pada riset empiris transparansi fiskal, standar
        akuntabilitas pelaporan pemerintah, dan telaah literatur ilmiah berstandar APA 7th Edition.
      </p>

      <div className="ab-faq ab-ref">
        {REFS.map((r, i) => {
          const open = openRef.includes(i);
          return (
            <div className={`ab-faq-item${open ? ' open' : ''}`} key={r.q}>
              <button
                type="button"
                className="ab-faq-q"
                aria-expanded={open}
                aria-controls={`ref-${i}`}
                onClick={() => setOpenRef((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]))}
              >
                <span>{r.q}</span>
                <span className="ab-faq-n">{String(i + 1).padStart(2, '0')}</span>
              </button>
              <div className="ab-faq-a" id={`ref-${i}`}>
                <div className="ab-faq-inner">{r.a}</div>
              </div>
            </div>
          );
        })}
      </div>

    </section>

    <Footer ids={FOOT_222} />
    </div>
  );
};
