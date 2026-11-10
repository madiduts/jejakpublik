import React from 'react';
import { AlertTriangle, Info, Minus } from 'lucide-react';
import { formatRupiah, formatPersen } from '../../utils/format';

export const Card: React.FC<{ children: React.ReactNode; className?: string; pad?: boolean; id?: string }> = ({ children, className = '', pad, id }) => (
  <section id={id} className={`card${pad ? ' card-pad' : ''} ${className}`.trim()}>{children}</section>
);

export const CardHead: React.FC<{ title: string; sub?: string; right?: React.ReactNode }> = ({ title, sub, right }) => (
  <header className="card-h">
    <div>
      <h3>{title}</h3>
      {sub && <div className="sub">{sub}</div>}
    </div>
    {right}
  </header>
);

export const Badge: React.FC<{ tone?: 'ok' | 'warn' | 'hold' | 'info' | 'plain'; children: React.ReactNode }> = ({ tone = 'plain', children }) => (
  <span className={`badge badge-${tone}`}>{children}</span>
);

/** Angka bertanda ditahan selalu tampil kosong, tidak pernah nol. */
export const DataValue: React.FC<{ value: number | null; kind?: 'rupiah' | 'persen' | 'text'; short?: boolean }> = ({ value, kind = 'rupiah', short }) => {
  if (value === null || value === undefined) {
    return <Badge tone="hold"><Minus size={11} aria-hidden="true" />ditahan</Badge>;
  }
  if (kind === 'persen') return <span className="num">{formatPersen(value)}</span>;
  if (kind === 'text') return <span>{value}</span>;
  return <span className="num">{short ? formatRupiah(value) : formatRupiah(value)}</span>;
};

export const Notice: React.FC<{ tone?: 'warn' | 'info' | 'hold'; title: string; children?: React.ReactNode }> = ({ tone = 'warn', title, children }) => (
  <div className={`notice notice-${tone}`} role="status">
    {tone === 'warn' ? <AlertTriangle size={17} aria-hidden="true" style={{ flex: 'none', marginTop: 1 }} /> : <Info size={17} aria-hidden="true" style={{ flex: 'none', marginTop: 1 }} />}
    <div><b>{title}</b>{children && <> {children}</>}</div>
  </div>
);

export const Empty: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="empty"><b>{title}</b>{children}</div>
);

export const PageHead: React.FC<{ eyebrow?: string; title: string; desc?: string; right?: React.ReactNode }> = ({ eyebrow, title, desc, right }) => (
  <div className="pagehead" style={right ? { display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' } : undefined}>
    <div>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {desc && <p>{desc}</p>}
    </div>
    {right}
  </div>
);
