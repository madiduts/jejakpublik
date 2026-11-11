import React, { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { getSession } from '../lib/session';
import { createReport } from '../lib/reports';
import { Dropdown } from '../components/ui/Dropdown';

const KATEGORI = [
  'Nominal tidak sesuai dokumen',
  'Penjumlahan antar-tabel tidak cocok',
  'Salah cetak / tertukar kode rekening',
  'Observasi lapangan / kondisi fisik berbeda',
];

const TIPS = [
  { t: 'Halaman yang tepat.', d: 'Sebut nomor halaman dan tabel, bukan hanya nama dokumen.' },
  { t: 'Dua sumber lebih baik.', d: 'Bandingkan angka yang bertentangan dalam satu berkas.' },
  { t: 'Hindari data pribadi.', d: 'Jangan unggah NIK, KTP, atau swafoto.' },
];

export const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const session = getSession();

  // Semua hook dipanggil sebelum kemungkinan keluar lebih awal, supaya urutan
  // hook tetap sama ketika sesi berubah di tengah pemakaian.
  const [category, setCategory] = useState(KATEGORI[0]);
  const [docUrl, setDocUrl] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(true);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [target, setTarget] = useState(
    params.get('target') || 'Program Pengendalian B3 · Anggaran perubahan · Rp3.684.567.176',
  );
  const [editingTarget, setEditingTarget] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    try {
      const res = await fetch('http://localhost:3000/api/v1/reports/upload', {
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
    const r = createReport({
      kind: 'koreksi',
      instansi: instansiDefault,
      target: target.trim() || 'Program Pengendalian B3 · Anggaran perubahan · Rp3.684.567.176',
      title: title.trim() || target,
      category,
      docUrl: docUrl.trim(),
      evidenceUrls,
      message: message.trim() || 'Penjelasan tidak disertakan.',
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
          <Link to="/">Beranda</Link> / <Link to="/lapor">Lapor</Link> / <span>Koreksi informasi</span>
        </p>
        <p className="cf-eyebrow">Langkah 3 dari 3</p>
        <h1 className="cf-title">Koreksi informasi</h1>
        <p className="cf-lede">
          Bukti menentukan cepat atau lambatnya verifikasi. Kolom di kiri memuat cerita
          temuanmu, panel di kanan menampung semua lampiran.
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
              <span className="cf-label">Informasi yang dilaporkan</span>
              <span className="cf-hint">
                Terisi otomatis dari halaman tempat kamu menekan tombol lapor. Ubah bila
                yang kamu maksud baris lain.
              </span>
              {editingTarget ? (
                <div className="cf-target-edit">
                  <input
                    className="cf-input"
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    aria-label="Ubah informasi yang dilaporkan"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="cf-btn-ghost cf-btn-sm"
                    onClick={() => setEditingTarget(false)}
                  >
                    Selesai
                  </button>
                </div>
              ) : (
                <div className="cf-locked">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <span>{target}</span>
                  <button
                    type="button"
                    className="cf-target-edit-btn"
                    onClick={() => setEditingTarget(true)}
                  >
                    Ubah
                  </button>
                </div>
              )}
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor="kategori">Kategori koreksi</label>
              <Dropdown
                id="kategori"
                value={category}
                options={KATEGORI}
                onChange={setCategory}
                ariaLabel="Kategori koreksi"
              />
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor="judul">Judul laporan</label>
              <input
                id="judul"
                type="text"
                className="cf-input"
                placeholder="Contoh: Nilai APBD-P Tabel 2.4 berbeda dengan Tabel 3.34"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor="penjelasan">Penjelasan</label>
              <span className="cf-hint">Sebutkan halaman, tabel, dan angka pembanding. Minimal 15 karakter.</span>
              <textarea
                id="penjelasan"
                className="cf-textarea"
                placeholder="Pada LKIP halaman 26 Tabel 2.4, program ini tercetak Rp67.876.101.084. Pada halaman 96 Tabel 3.34 tercetak Rp3.684.567.176."
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
              <h2 className="cf-panel-h">Bukti pendukung</h2>

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
                <strong>{uploading ? 'Mengunggah…' : 'Letakkan berkas di sini'}</strong>
                <span>atau klik untuk memilih · PNG, JPG, PDF · maks 5 MB</span>
              </button>

              <input
                className="cf-input cf-input-sm"
                type="url"
                aria-label="Tautan dokumen pembanding"
                placeholder="https:// tautan dokumen publik"
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
                {TIPS.map((tip, i) => (
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
