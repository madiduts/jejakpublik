import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, PageHead, Empty, Notice } from '../components/ui';
import { Evidence } from '../components/Evidence';
import { getCorrection } from '../lib/data';
import { createReport } from '../lib/reports';
import { formatRupiah } from '../utils/format';

export const CorrectionForm: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const correction = getCorrection(id);
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');

  if (!correction) {
    return (
      <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Koreksi' }]}>
        <div className="wrap page"><Empty title="Baris tidak ditemukan"><Link to="/perbandingan">Kembali ke perbandingan</Link>.</Empty></div>
      </LayoutShell>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = createReport({
      kind: 'koreksi',
      instansi: 'Dinas Lingkungan Hidup',
      target: `${correction.title} · usulan ${formatRupiah(Number(value.replace(/\D/g, '')) || 0)}`,
      message: reason,
      contact,
    });
    navigate(`/laporan-saya?baru=${r.id}`);
  };

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Perbandingan', to: '/perbandingan' }, { label: 'Usul koreksi' }]}>
      <div className="wrap page" style={{ maxWidth: 860 }}>
        <PageHead eyebrow="Usul koreksi" title={correction.title} desc="Angka yang kami pakai saat ini terlihat di bawah. Jika kamu punya dokumen yang menyatakan lain, sebutkan pada kolom alasan." />
        <Evidence c={correction} />
        <div className="divider" />
        <Card pad>
          <CardHead title="Usulanmu" sub="Diperiksa moderator sebelum mengubah apa pun" />
          <form onSubmit={submit} style={{ marginTop: 14 }}>
            <div className="field">
              <label htmlFor="nilai">Nilai yang kamu usulkan</label>
              <input id="nilai" className="input" inputMode="numeric" placeholder="Contoh: 3.684.567.176" value={value} onChange={(e) => setValue(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="alasan">Alasan dan dokumen rujukan</label>
              <textarea id="alasan" className="textarea" value={reason} onChange={(e) => setReason(e.target.value)} required minLength={20} placeholder="Sebutkan nama dokumen, tabel, dan halaman." />
            </div>
            <div className="field">
              <label htmlFor="kontak">Kontak (opsional)</label>
              <input id="kontak" className="input" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <Notice tone="hold" title="Angka tidak berubah langsung.">Setiap perubahan menyimpan jejak pemeriksaan.</Notice>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-primary" type="submit">Kirim usulan</button>
            </div>
          </form>
        </Card>
      </div>
    </LayoutShell>
  );
};
