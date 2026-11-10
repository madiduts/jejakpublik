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

export const Kpi: React.FC<{ label: string; value: string; foot?: string; large?: boolean; icon?: React.ReactNode }> = ({ label, value, foot, large, icon }) => (
  <div className="kpi">
    <div className="lbl">{icon}{label}</div>
    <div className={`val num${large ? ' val-lg' : ''}`}>{value}</div>
    {foot && <div className="foot">{foot}</div>}
  </div>
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

export const Tabs: React.FC<{ items: { id: string; label: string }[]; active: string; onChange: (id: string) => void }> = ({ items, active, onChange }) => (
  <div className="tabs" role="tablist">
    {items.map((it) => (
      <button key={it.id} role="tab" aria-selected={active === it.id} className={active === it.id ? 'on' : ''} onClick={() => onChange(it.id)}>{it.label}</button>
    ))}
  </div>
);

export const Donut: React.FC<{ pct: number; label?: string; size?: number }> = ({ pct, label = 'terserap', size = 150 }) => {
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const safe = Math.max(0, Math.min(100, pct));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Serapan ${safe.toFixed(2)} persen`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="14" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth="14"
        strokeLinecap="round" strokeDasharray={`${(safe / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="47%" textAnchor="middle" fontSize={size * 0.17} fontWeight="750" fill="var(--ink)">{formatPersen(safe)}</text>
      <text x="50%" y="61%" textAnchor="middle" fontSize={size * 0.085} fill="var(--muted)">{label}</text>
    </svg>
  );
};

export const Bars: React.FC<{ rows: { label: string; value: number; pct?: string | null; warn?: boolean }[]; money?: boolean }> = ({ rows, money = true }) => {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="bars">
      {rows.map((r) => (
        <div className="bar-row" key={r.label}>
          <div title={r.label} style={{ color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</div>
          <div className="bar-track"><div className={`bar-fill${r.warn ? ' warn' : ''}`} style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} /></div>
          <div className="bar-val num">{money ? formatRupiah(r.value) : r.value}</div>
        </div>
      ))}
    </div>
  );
};

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
