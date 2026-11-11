import React, { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NAV_223, FOOT_223 } from '../lib/frameIds';
import { getSession } from '../lib/session';
import { createReport } from '../lib/reports';

export const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const session = getSession();

  // Wajib masuk (login) terlebih dahulu sebelum membuat laporan
  if (!session) {
    return (
      <Navigate
        to="/masuk"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // Pre-fill informasi target yang dilaporkan dari parameter URL atau default demo
  const targetDefault =
    params.get('target') ||
    'Program Pengendalian B3 · Anggaran perubahan · Rp3.684.567.176';
  const instansiDefault = params.get('instansi') || 'Dinas Lingkungan Hidup';

  const [category, setCategory] = useState('Nominal tidak sesuai dokumen');
  const [docUrl, setDocUrl] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(true);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload berkas bukti gambar / PDF ke storage service backend
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
        body: formData
      });
      const json = await res.json();
      if (json.success && json.data?.fileUrl) {
        setEvidenceUrls((prev) => [...prev, json.data.fileUrl]);
      } else {
        setUploadError(json.error || 'Gagal mengunggah berkas bukti.');
      }
    } catch {
      // Fallback simulasi URL jika server backend offline saat pengujian
      const fallbackUrl = `/uploads/${file.name}`;
      setEvidenceUrls((prev) => [...prev, fallbackUrl]);
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
      target: targetDefault,
      title: title.trim() || targetDefault,
      category,
      docUrl: docUrl.trim(),
      evidenceUrls,
      message: message.trim() || 'Penjelasan tidak disertakan.',
      contact: session.name,
      isDraft
    });

    navigate(`/laporan-saya?baru=${r.id}`);
  };

  return (
    <div className="lp rp-page">
      <Navbar ids={NAV_223} />

      <main className="rp-wrap">
        <p className="rp-crumb">
          <Link to="/">Beranda</Link> / <Link to="/lapor">Lapor</Link> / <span>Koreksi informasi</span>
        </p>

        <div className="rp-headwrap">
          <span className="rp-step">LANGKAH 3 DARI 3</span>
          <h1 className="rp-h1">Koreksi informasi</h1>
        </div>

        <section className="rp-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(false);
            }}
          >
            {/* Field 1: Informasi yang dilaporkan (Readonly) */}
            <div className="rp-group">
              <label className="rp-label">INFORMASI YANG DILAPORKAN</label>
              <span className="rp-hint">Terkunci dari halaman tempat kamu menekan tombol lapor.</span>
              <div className="rp-locked">
                <span>{targetDefault}</span>
              </div>
            </div>

            {/* Field 2 & 3: Grid 2 Kolom Kategori & Dokumen Pembanding */}
            <div className="rp-grid2">
              <div className="rp-group">
                <label className="rp-label" htmlFor="kategori">KATEGORI KOREKSI</label>
                <select
                  id="kategori"
                  className="rp-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Nominal tidak sesuai dokumen">Nominal tidak sesuai dokumen</option>
                  <option value="Penjumlahan antar-tabel tidak cocok">Penjumlahan antar-tabel tidak cocok</option>
                  <option value="Salah cetak / tertukar kode rekening">Salah cetak / tertukar kode rekening</option>
                  <option value="Observasi lapangan / kondisi fisik berbeda">Observasi lapangan / kondisi fisik berbeda</option>
                </select>
              </div>

              <div className="rp-group">
                <label className="rp-label" htmlFor="dokumen">DOKUMEN PEMBANDING</label>
                <span className="rp-hint">Opsional, tautan publik atau unggah berkas bukti.</span>
                <div className="rp-upload-wrap">
                  <div className="rp-upload-field">
                    <input
                      id="dokumen"
                      type="url"
                      className="rp-input"
                      placeholder="https://"
                      value={docUrl}
                      onChange={(e) => setDocUrl(e.target.value)}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      className="rp-file-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Mengunggah...' : 'Unggah bukti'}
                    </button>
                  </div>

                  {uploadError && (
                    <span style={{ fontSize: 11.5, color: '#DC2626' }}>{uploadError}</span>
                  )}

                  {evidenceUrls.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                      {evidenceUrls.map((url, idx) => (
                        <span key={url} className="rp-file-badge">
                          📎 Berkas {idx + 1}
                          <button
                            type="button"
                            className="rp-file-remove"
                            onClick={() => handleRemoveEvidence(idx)}
                            aria-label="Hapus berkas"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Field 4: Judul Laporan */}
            <div className="rp-group">
              <label className="rp-label" htmlFor="judul">JUDUL LAPORAN</label>
              <input
                id="judul"
                type="text"
                className="rp-input"
                placeholder="Contoh: Nilai APBD-P Tabel 2.4 berbeda dengan Tabel 3.34"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Field 5: Penjelasan */}
            <div className="rp-group">
              <label className="rp-label" htmlFor="penjelasan">PENJELASAN</label>
              <textarea
                id="penjelasan"
                className="rp-textarea"
                placeholder="Pada LKIP halaman 26 Tabel 2.4, program ini tercetak Rp67.876.101.084. Pada halaman 96 Tabel 3.34 tercetak Rp3.684.567.176."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={15}
              />
            </div>

            {/* Field 6: Checkbox persetujuan */}
            <label className="rp-checkrow">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span className="rp-checktext">
                Saya setuju laporan ini diperiksa dan ditampilkan sebagai laporan warga, dengan nama akun tidak ditampilkan.
              </span>
            </label>

            {/* Tombol aksi: Kirim laporan & Simpan draf */}
            <div className="rp-actions">
              <button
                type="submit"
                className="rp-btn-primary"
                disabled={!agree}
              >
                Kirim laporan
              </button>
              <button
                type="button"
                className="rp-btn-sec"
                onClick={() => handleSubmit(true)}
              >
                Simpan draf
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer ids={FOOT_223} />
    </div>
  );
};

export default ReportForm;
