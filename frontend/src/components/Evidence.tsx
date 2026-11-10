import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Correction } from '../lib/data';
import { formatRupiah } from '../utils/format';

export const Evidence: React.FC<{ c: Correction }> = ({ c }) => (
  <div>
    <div className={`notice notice-${c.state === 'dikoreksi' ? 'warn' : 'hold'}`} role="status" style={{ marginBottom: 12 }}>
      <AlertTriangle size={17} aria-hidden="true" style={{ flex: 'none', marginTop: 1 }} />
      <div>
        <b>{c.state === 'dikoreksi' ? 'Angka dikoreksi.' : 'Nilai ditahan.'}</b>{' '}
        {c.state === 'dikoreksi'
          ? 'Dokumen sumber memuat dua nilai berbeda untuk baris yang sama.'
          : 'Dokumen sumber tidak memuat nilai yang dapat dipastikan untuk baris ini.'}
      </div>
    </div>
    <div className="evidence">
      <div className="erow head"><span>Dokumen</span><span className="r">Nilai</span><span className="st">Status</span></div>
      <div className="erow">
        <span>{c.printed.label}</span>
        <span className="r num" style={{ color: c.state === 'dikoreksi' ? 'var(--warn)' : 'var(--hold)' }}>{formatRupiah(c.printed.value)}</span>
        <span className="st"><span className={`badge badge-${c.state === 'dikoreksi' ? 'warn' : 'hold'}`}>{c.state === 'dikoreksi' ? 'salah salin' : 'tidak pasti'}</span></span>
      </div>
      <div className="erow">
        <span>{c.verified.label}</span>
        <span className="r num" style={{ color: c.state === 'dikoreksi' ? 'var(--accent)' : 'var(--ink)' }}>{formatRupiah(c.verified.value)}</span>
        <span className="st"><span className={`badge badge-${c.state === 'dikoreksi' ? 'info' : 'plain'}`}>{c.state === 'dikoreksi' ? 'dipakai' : 'pembanding'}</span></span>
      </div>
      {c.comparator && (
        <div className="erow">
          <span>{c.comparator.label}</span>
          <span className="r num">{formatRupiah(c.comparator.value)}</span>
          <span className="st"><span className="badge badge-plain">pembanding</span></span>
        </div>
      )}
      {c.formula && (
        <div className="eq">
          <span>{formatRupiah(c.formula.a)}</span>
          <span className="op">{c.state === 'dikoreksi' ? '−' : 'Δ'}</span>
          <span>{formatRupiah(c.formula.b)}</span>
          <span className="op">=</span>
          <span className="res">{formatRupiah(c.formula.result)}</span>
        </div>
      )}
      <p className="enote">{c.note}</p>
    </div>
  </div>
);
