import React, { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { getSession } from '../lib/session';
import { adaBackend, API_BASE } from '../lib/api';
import { createReport } from '../lib/reports';
import { Dropdown } from '../components/ui/Dropdown';
import { SearchSelect } from '../components/ui/SearchSelect';
import { instansiList, judulInstansi, programList } from '../lib/data';

const KATEGORI_KOREKSI = [
  'Nominal tidak sesuai dokumen',
  'Penjumlahan antar-tabel tidak cocok',
  'Salah cetak / tertukar kode rekening',
  'Perbedaan pagu penetapan dan perubahan',
];

const KATEGORI_OBSERVASI = [
  'Fasilitas belum terbangun / mangkrak',
  'Kondisi fisik rusak atau tidak layak fungsi',
  'Pengadaan barang tidak ditemukan di lokasi',
  'Layanan publik terhenti padahal anggaran terserap',
  'Kondisi nyata berbeda dengan klaim output kinerja',
];

const SMALL = new Set(['dan', 'di', 'ke', 'dari', 'atau', 'yang', 'untuk', 'pada']);
/** Singkatan nama instansi supaya "dlh" ikut menemukan Dinas Lingkungan Hidup. */
const initials = (nama: string): string =>
  nama.split(/\s+/).filter((w) => w && !SMALL.has(w.toLowerCase())).map((w) => w[0].toLowerCase()).join('');

const PREFILL_DEFAULT = 'Program Pengendalian B3 · Anggaran perubahan · Rp3.684.567.176';

/** Dua jalur: nilai otomatis dari halaman sebelumnya, atau pilih dari data. */
const TARGET_GROUPS = (prefilled: string, current: string) => {
  const auto: { value: string; hint?: string }[] = [
    { value: prefilled, hint: 'Terisi otomatis dari halaman tempat kamu menekan Lapor' },
  ];
  if (current && current !== prefilled) {
    auto.unshift({ value: current, hint: 'Pilihan kamu sebelumnya' });
  }

  return [
    { label: 'Dari halaman sebelumnya', items: auto },
    {
      label: 'Program Dinas Lingkungan Hidup',
      items: programList.map((p) => ({
        value: `${p.judul} · TA 2025`,
        hint: 'Program · Dinas Lingkungan Hidup',
        keywords: p.nama,
      })),
    },
    {
      label: 'Instansi daerah',
      items: instansiList.map((i) => ({
        value: judulInstansi(i.nama),
        hint: 'Instansi · TA 2025',
        keywords: `${i.nama} ${initials(i.nama)}`,
      })),
    },
  ];
};

const TIPS_KOREKSI = [
  { t: 'Halaman yang tepat.', d: 'Sebut nomor halaman dan tabel, bukan hanya nama dokumen.' },
  { t: 'Dua sumber lebih baik.', d: 'Bandingkan angka yang bertentangan dalam satu berkas.' },
  { t: 'Hindari data pribadi.', d: 'Jangan unggah NIK, KTP, atau swafoto.' },
];

const TIPS_OBSERVASI = [
  { t: 'Foto fisik jelas.', d: 'Sertakan foto papan proyek atau kondisi fasilitas di lokasi riil.' },
  { t: 'Titik lokasi akurat.', d: 'Sebutkan nama jalan, kelurahan, kecamatan, atau patokan fisik.' },
  { t: 'Hindari data pribadi.', d: 'Jangan memotret wajah warga tanpa izin atau kartu identitas.' },
];

export const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const session = getSession();

  const isObservasi = location.pathname.includes('observasi');
  const categories = isObservasi ? KATEGORI_OBSERVASI : KATEGORI_KOREKSI;
  const tips = isObservasi ? TIPS_OBSERVASI : TIPS_KOREKSI;

  // Semua hook dipanggil sebelum kemungkinan keluar lebih awal, supaya urutan
  // hook tetap sama ketika sesi berubah di tengah pemakaian.
  const [category, setCategory] = useState(categories[0]);
  const [locationAddress, setLocationAddress] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(true);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [target, setTarget] = useState('');
  const [targetError, setTargetError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setCategory(isObservasi ? KATEGORI_OBSERVASI[0] : KATEGORI_KOREKSI[0]);
  }, [isObservasi]);

  const prefilledTarget = params.get('target') || PREFILL_DEFAULT;
  const instansiDefault = params.get('instansi') || 'Dinas Lingkungan Hidup';

  if (!session) {
    return (
      <Navigate
        to="/masuk"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // Moderator tidak diperkenankan membuat laporan (mencegah conflict of interest).
  if (session.role === 'moderator') {
    return <Navigate to="/moderator" replace />;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    // Prototipe statis tanpa backend: berkas tidak diunggah, hanya dicatat.
    if (!adaBackend) {
      setEvidenceUrls((prev) => [...prev, `/uploads/${file.name}`]);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/reports/upload`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.data?.fileUrl) {
        setEvidenceUrls((prev) => [...prev, json.data.fileUrl]);
      } else {
        setUploadError(json.error || 'Gagal mengunggah berkas bukti.');
      }
    } catch {
      // Backend belum menyala saat pengujian: simpan nama berkas sebagai rujukan.
      setEvidenceUrls((prev) => [...prev, `/uploads/${file.name}`]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (isDraft: boolean) => {
    if (!isDraft && !target.trim()) {
      setTargetError(true);
      return;
    }
    setTargetError(false);
    const r = createReport({
      kind: isObservasi ? 'observasi' : 'koreksi',
      instansi: instansiDefault,
      target: target.trim() || (isObservasi ? 'Observasi Lapangan Fisik' : 'Program Pengendalian B3 · Anggaran perubahan · Rp3.684.567.176'),
      title: title.trim() || target,
      category,
      docUrl: docUrl.trim(),
      evidenceUrls,
      message: isObservasi && locationAddress.trim()
        ? `[Lokasi Temuan: ${locationAddress.trim()}]\n\n${message.trim()}`
        : (message.trim() || 'Penjelasan tidak disertakan.'),
      contact: session.name,
      isDraft,
    });

    navigate(`/laporan-saya?baru=${r.id}`);
  };

  return (
    <div className="lp">
      <Navbar />

      <main className="cf-main">
        <p className="cf-crumb">
          <Link to="/">Beranda</Link> / <Link to="/lapor">Lapor</Link> / <span>{isObservasi ? 'Observasi lapangan' : 'Koreksi informasi'}</span>
        </p>
        <p className="cf-eyebrow">Langkah 3 dari 3</p>
        <h1 className="cf-title">{isObservasi ? 'Observasi lapangan & fakta fisik' : 'Koreksi informasi data anggaran'}</h1>
        <p className="cf-lede">
          {isObservasi
            ? 'Dokumentasi foto dan titik lokasi mempercepat peninjauan. Ceritakan temuan fisik di lapangan yang tidak selaras dengan klaim realisasi anggaran.'
            : 'Bukti menentukan cepat atau lambatnya verifikasi. Kolom di kiri memuat cerita temuanmu, panel di kanan menampung semua lampiran.'}
        </p>

        <div className="cf-grid">
          <form
            className="cf-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(false);
            }}
          >
            <div className="cf-field">
              <span className="cf-label">{isObservasi ? 'Program atau instansi yang diobservasi' : 'Informasi yang dilaporkan'}</span>
              <span className="cf-hint">
                {isObservasi
                  ? 'Pilih program atau dinas yang berkaitan dengan proyek atau fasilitas yang kamu amati di lapangan.'
                  : 'Terisi otomatis dari halaman tempat kamu menekan tombol lapor. Klik untuk memilih baris lain lewat pencarian instansi atau program.'}
              </span>
              <SearchSelect
                id="target"
                value={target}
                groups={TARGET_GROUPS(prefilledTarget, target)}
                onChange={(v) => { setTarget(v); setTargetError(false); }}
                placeholder="Pilih baris yang dilaporkan…"
                searchPlaceholder="Cari instansi atau program…"
                ariaLabel="Pilih baris yang dilaporkan"
              />
              {targetError && (
                <p className="cf-error" role="alert">
                  Pilih dulu baris yang kamu laporkan — dari halaman sebelumnya atau lewat pencarian.
                </p>
              )}
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor="kategori">{isObservasi ? 'Kategori temuan lapangan' : 'Kategori koreksi'}</label>
              <Dropdown
                id="kategori"
                value={category}
                options={categories}
                onChange={setCategory}
                ariaLabel={isObservasi ? 'Kategori temuan lapangan' : 'Kategori koreksi'}
              />
            </div>

            {isObservasi && (
              <div className="cf-field">
                <label className="cf-label" htmlFor="lokasi">Lokasi & alamat temuan</label>
                <span className="cf-hint">Sebutkan nama jalan, kelurahan, kecamatan, atau patokan fisik terdekat.</span>
                <input
                  id="lokasi"
                  type="text"
                  className="cf-input"
                  placeholder="Contoh: TPS 3R Rawasari, Jl. Percetakan Negara IX, Cempaka Putih, Jakarta Pusat"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="cf-field">
              <label className="cf-label" htmlFor="judul">Judul laporan</label>
              <input
                id="judul"
                type="text"
                className="cf-input"
                placeholder={isObservasi ? 'Contoh: Pengadaan TPS 3R belum beroperasi dan pintu terkunci' : 'Contoh: Nilai APBD-P Tabel 2.4 berbeda dengan Tabel 3.34'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor="penjelasan">{isObservasi ? 'Deskripsi kondisi nyata di lapangan' : 'Penjelasan'}</label>
              <span className="cf-hint">
                {isObservasi
                  ? 'Jelaskan kondisi riil yang kamu saksikan di lokasi dan ketidaksesuaiannya dengan klaim belanja. Minimal 15 karakter.'
                  : 'Sebutkan halaman, tabel, dan angka pembanding. Minimal 15 karakter.'}
              </span>
              <textarea
                id="penjelasan"
                className="cf-textarea"
                placeholder={
                  isObservasi
                    ? 'Pada dokumen realisasi anggaran dinyatakan selesai 100%, namun di lokasi fisik bangunan belum beratap dan alat pengolah sampah belum tersedia.'
                    : 'Pada LKIP halaman 26 Tabel 2.4, program ini tercetak Rp67.876.101.084. Pada halaman 96 Tabel 3.34 tercetak Rp3.684.567.176.'
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={15}
              />
            </div>

            <label className="cf-check">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span>
                Saya setuju laporan ini diperiksa dan ditampilkan sebagai laporan warga,
                dengan nama akun tidak ditampilkan.
              </span>
            </label>

            <div className="cf-actions">
              <button className="cf-btn-primary" type="submit" disabled={!agree}>
                Kirim laporan
              </button>
              <button className="cf-btn-ghost" type="button" onClick={() => handleSubmit(true)}>
                Simpan draf
              </button>
            </div>
          </form>

          <aside className="cf-side">
            <section className="cf-panel">
              <h2 className="cf-panel-h">{isObservasi ? 'Foto & bukti lapangan' : 'Bukti pendukung'}</h2>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                className="cf-drop"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <strong>{uploading ? 'Mengunggah…' : isObservasi ? 'Unggah foto bukti fisik' : 'Letakkan berkas di sini'}</strong>
                <span>{isObservasi ? 'Ambil foto langsung atau unggah · PNG, JPG · maks 5 MB' : 'atau klik untuk memilih · PNG, JPG, PDF · maks 5 MB'}</span>
              </button>

              <input
                className="cf-input cf-input-sm"
                type="url"
                aria-label={isObservasi ? 'Tautan dokumen atau foto pembanding' : 'Tautan dokumen pembanding'}
                placeholder={isObservasi ? 'https:// tautan foto / dokumen pembanding (opsional)' : 'https:// tautan dokumen publik'}
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
              />

              {uploadError && (
                <p className="cf-error" role="alert">{uploadError}</p>
              )}

              {evidenceUrls.length > 0 && (
                <ul className="cf-files" aria-label="Berkas bukti yang dilampirkan">
                  {evidenceUrls.map((url, idx) => (
                    <li key={`${url}-${idx}`} className="cf-file">
                      <span>{url.split('/').pop() || `Berkas ${idx + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(idx)}
                        aria-label={`Hapus berkas ${idx + 1}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="cf-panel">
              <h2 className="cf-panel-h">Bukti yang kuat</h2>
              <ol className="cf-tips">
                {tips.map((tip, i) => (
                  <li key={tip.t}>
                    <span className="cf-tipnum">{i + 1}</span>
                    <span><b>{tip.t}</b> {tip.d}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="cf-panel">
              <h2 className="cf-panel-h">Perkiraan waktu</h2>
              <p className="cf-panel-p">
                Moderator biasanya memeriksa dalam 1–2 hari kerja. Hasil muncul di
                halaman <Link to="/laporan-saya">Laporan Saya</Link>.
              </p>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportForm;
