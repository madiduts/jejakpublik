import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, PageHead, Notice } from '../components/ui';
import { CREDITS } from '../data/site';
import { totals } from '../lib/data';

export const About: React.FC = () => (
  <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Tentang' }]}>
    <div className="wrap page">
      <PageHead eyebrow="Tentang" title="Siapa kami dan dari mana angkanya" desc="JejakPublik adalah proyek independen untuk lomba WIA MIA 2026. Kami tidak berafiliasi dengan Pemerintah Provinsi DKI Jakarta." />

      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <Card>
            <CardHead title="Metode" sub="Empat aturan yang kami pegang" />
            <div className="card-pad prose" style={{ fontSize: 13.5 }}>
              <p><b>1. Setiap angka punya rujukan.</b> Nama dokumen, nomor tabel, dan tanggal pengambilan tercatat.</p>
              <p><b>2. Konflik dibuka.</b> Bila dua tabel memuat nilai berbeda, keduanya ditampilkan dengan hitungan penyelesaiannya.</p>
              <p><b>3. Nilai ditahan tidak dihitung.</b> Angka yang tidak dapat dipastikan tampil kosong dan tidak masuk total maupun penyebut persentase.</p>
              <p><b>4. Tidak ada data waktu nyata.</b> Seluruh angka berasal dari dokumen TA 2025 yang sudah selesai.</p>
            </div>
          </Card>
          <Card>
            <CardHead title="Batas kemampuan" sub="Yang belum kami kerjakan" />
            <div className="card-pad prose" style={{ fontSize: 13.5 }}>
              <p>Rincian program sampai sub kegiatan baru tersedia untuk satu dinas percontohan. {totals.instansi - 1} instansi lain masih pada lapisan ringkasan.</p>
              <p>Laporan warga pada versi ini disimpan di peramban masing-masing, belum tersimpan di server. Antrean moderator karena itu memperlihatkan laporan dari peramban yang sama.</p>
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <Card>
            <CardHead title="Sumber data" />
            <div className="card-pad" style={{ display: 'grid', gap: 10, fontSize: 13 }}>
              {['LKIP Dinas Lingkungan Hidup Jakarta 2025', 'Dashboard Keuangan BPKD Jakarta', 'APBD-P DKI Jakarta 2025', 'Indikator Kinerja Utama 2025'].map((s) => (
                <div key={s} style={{ paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>{s}</div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Kredit dan lisensi" sub="Wajib disebut saat karya dipublikasikan" />
            <div className="card-pad" style={{ display: 'grid', gap: 8, fontSize: 12.5 }}>
              {CREDITS.map((c) => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span>{c.name}</span><span style={{ color: 'var(--muted)' }}>{c.license}</span>
                </div>
              ))}
              <p style={{ color: 'var(--muted)', marginTop: 6 }}>
                Lisensi CC BY-SA 3.0 dan CC BY 3.0 mewajibkan atribusi. Kredit ini dipindahkan dari kaki halaman mockup ke halaman ini; saat situs dirilis, kredit tetap wajib ada.
              </p>
            </div>
          </Card>
          <Notice tone="info" title="Menemukan kesalahan?">
            <Link to="/lapor">Kirim laporan</Link> — setiap koreksi yang diterima dicatat pada riwayat angka.
          </Notice>
        </div>
      </div>
    </div>
  </LayoutShell>
);
