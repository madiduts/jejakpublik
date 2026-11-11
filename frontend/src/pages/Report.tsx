import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

export const Report: React.FC = () => {
  const location = useLocation();

  return (
    <div className="rk-page" data-figma-root data-node-id="164:2">
      {/* Header */}
      <header className="rk-head" data-node-id="164:3">
        <div className="rk-brandwrap" data-node-id="164:4">
          <Link to="/" className="rk-brand" data-node-id="164:5">
            JejakPublik
          </Link>
        </div>

        <nav className="rk-navwrap" data-node-id="164:7" aria-label="Navigasi utama">
          <div className="rk-navitem" data-node-id="164:8">
            <Link to="/jelajahi" className="rk-navlink" data-node-id="164:9">
              Jelajahi Data
            </Link>
          </div>
          <div className="rk-navitem" data-node-id="164:11">
            <Link to="/panduan" className="rk-navlink" data-node-id="164:12">
              Panduan
            </Link>
          </div>
          <div className="rk-navitem" data-node-id="164:13">
            <Link to="/istilah" className="rk-navlink" data-node-id="164:14">
              Glosarium
            </Link>
          </div>
          <div className="rk-navitem" data-node-id="164:15">
            <Link to="/tentang" className="rk-navlink" data-node-id="164:16">
              Tentang
            </Link>
          </div>
          <Link to="/lapor" className="rk-cta" data-node-id="164:17">
            <span className="rk-ctatxt" data-node-id="164:18">Lapor</span>
            <span className="rk-ctadot" data-node-id="164:20" aria-hidden="true">
              <span className="rk-ctaarrow" data-node-id="164:21">→</span>
            </span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="rk-main" data-node-id="164:23">
        {/* Breadcrumb */}
        <div className="rk-crumbwrap" data-node-id="164:24">
          <p className="rk-crumb" data-node-id="164:25">
            <Link to="/" className="rk-crumblink">Beranda</Link> / <strong>Lapor</strong>
          </p>
        </div>

        {/* Eyebrow */}
        <div className="rk-eyebrowwrap" data-node-id="164:27">
          <div className="rk-tag1wrap" data-node-id="164:28">
            <span className="rk-tag1" data-node-id="164:29">Laporan</span>
          </div>
          <span className="rk-tag2" data-node-id="164:31">Butuh akun</span>
        </div>

        {/* Heading 1 */}
        <div className="rk-h1wrap" data-node-id="164:32">
          <h1 className="rk-h1" data-node-id="164:33">
            Laporkan apa yang kamu temukan
          </h1>
        </div>

        {/* Lede */}
        <div className="rk-ledewrap" data-node-id="164:69">
          <p className="rk-lede" data-node-id="164:36">
            Dua jenis laporan, dua tujuan berbeda. Keduanya diperiksa tim sebelum terbit, dan tidak langsung mengubah data publik.
          </p>
        </div>

        {/* Choices */}
        <div className="rk-choices" data-node-id="164:38">
          {/* Choice 1: Koreksi informasi */}
          <Link
            to={{ pathname: '/lapor/koreksi', search: location.search }}
            className="rk-choice1"
            data-node-id="164:39"
          >
            <div className="rk-choice-content" data-node-id="164:40">
              <div className="rk-choicetitle-wrap" data-node-id="164:41">
                <h2 className="rk-choicetitle" data-node-id="164:42">
                  Koreksi informasi
                </h2>
              </div>
              <div className="rk-choicedesc-wrap" data-node-id="164:47">
                <p className="rk-choicedesc" data-node-id="164:45">
                  Ada angka, nama, klasifikasi, atau tautan sumber di JejakPublik yang menurutmu keliru. Sertakan dokumen pembanding bila punya.
                </p>
              </div>
            </div>
            <div className="rk-circle" data-node-id="164:48" aria-hidden="true">
              <span className="rk-arrow" data-node-id="164:49">→</span>
            </div>
          </Link>

          {/* Choice 2: Observasi lapangan */}
          <Link
            to={{ pathname: '/lapor/observasi', search: location.search }}
            className="rk-choice2"
            data-node-id="164:51"
          >
            <div className="rk-choice-content" data-node-id="164:52">
              <div className="rk-choicetitle-wrap" data-node-id="164:53">
                <h2 className="rk-choicetitle" data-node-id="164:54">
                  Observasi lapangan
                </h2>
              </div>
              <div className="rk-choicedesc-wrap" data-node-id="164:57">
                <p className="rk-choicedesc" data-node-id="164:56">
                  Ada kondisi di lokasi yang perlu diketahui publik, misalnya pekerjaan tidak sesuai gambar atau fasilitas tidak berfungsi. Sertakan lokasi dan waktu.
                </p>
              </div>
            </div>
            <div className="rk-circle" data-node-id="164:58" aria-hidden="true">
              <span className="rk-arrow" data-node-id="164:59">→</span>
            </div>
          </Link>
        </div>

        {/* Notice Card */}
        <div className="rk-noticewrap" data-node-id="164:71">
          <div className="rk-noticecard" data-node-id="164:60">
            <div className="rk-noticeh3wrap" data-node-id="164:61">
              <h3 className="rk-noticeh3" data-node-id="164:62">
                Sebelum mengirim
              </h3>
            </div>
            <div className="rk-noticepwrap" data-node-id="164:64">
              <p className="rk-noticep" data-node-id="164:65">
                JejakPublik meninjau laporan dan menampilkannya sebagai <strong>laporan warga</strong>, bukan fakta terverifikasi. Kami tidak menjanjikan instansi akan menindaklanjuti. Untuk aduan resmi, gunakan kanal pemerintah.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
