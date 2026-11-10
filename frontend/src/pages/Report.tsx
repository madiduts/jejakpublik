import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, PageHead, Notice, Badge } from '../components/ui';
import { createReport, ReportKind, KIND_LABEL } from '../lib/reports';
import { instansiList } from '../lib/data';

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [kind, setKind] = useState<ReportKind>('koreksi');
  const [instansi, setInstansi] = useState(params.get('instansi') ?? '');
  const [target, setTarget] = useState(params.get('target') ?? '');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = createReport({ kind, instansi, target, message, contact });
    navigate(`/laporan-saya?baru=${r.id}`);
  };

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Lapor anggaran' }]}>
      <div className="wrap page" style={{ maxWidth: 760 }}>
        <PageHead eyebrow="Partisipasi" title="Laporkan angka yang janggal" desc="Kami membaca setiap laporan. Laporan yang kuat menjadi usulan koreksi; yang tidak dapat diverifikasi ditolak dengan alasan." />
        <Notice tone="hold" title="Versi prototipe:">Laporan tersimpan di peramban ini, belum di server. Pada versi produksi laporan dikirim ke antrean moderator bersama rujukan dokumen.</Notice>

        <Card className="card-pad" pad>
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="jenis">Jenis laporan</label>
              <select id="jenis" className="select" value={kind} onChange={(e) => setKind(e.target.value as ReportKind)}>
                {(Object.keys(KIND_LABEL) as ReportKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="instansi">Instansi</label>
              <select id="instansi" className="select" value={instansi} onChange={(e) => setInstansi(e.target.value)} required>
                <option value="" disabled>Pilih instansi</option>
                {instansiList.map((i) => <option key={i.id} value={i.nama}>{i.nama}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="sasaran">Angka atau baris yang dilaporkan</label>
              <input id="sasaran" className="input" placeholder="Contoh: belanja program pengelolaan sampah" value={target} onChange={(e) => setTarget(e.target.value)} required />
              <span className="hint">Sebutkan nama baris dan, bila tahu, nilai yang tercetak.</span>
            </div>
            <div className="field">
              <label htmlFor="pesan">Apa yang menurutmu salah?</label>
              <textarea id="pesan" className="textarea" placeholder="Tuliskan alasan dan rujukan dokumen bila ada." value={message} onChange={(e) => setMessage(e.target.value)} required minLength={20} />
              <span className="hint">Minimal 20 karakter. Sebutkan halaman atau tabel sumber bila memungkinkan.</span>
            </div>
            <div className="field">
              <label htmlFor="kontak">Kontak (opsional)</label>
              <input id="kontak" className="input" placeholder="Email, agar kami bisa menanyakan detail" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <div className="rowgap" style={{ justifyContent: 'space-between' }}>
              <Badge tone="plain">Tidak dipublikasikan sebelum diperiksa</Badge>
              <button className="btn btn-primary" type="submit">Kirim laporan</button>
            </div>
          </form>
        </Card>
      </div>
    </LayoutShell>
  );
};
