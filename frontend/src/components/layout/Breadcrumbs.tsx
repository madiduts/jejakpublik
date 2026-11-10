import React from 'react';
import { Link } from 'react-router-dom';

export interface Crumb { label: string; to?: string }

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav className="crumbs" aria-label="Remah roti">
    {items.map((it, i) => (
      <React.Fragment key={it.label}>
        {i > 0 && <span className="sep" aria-hidden="true">/</span>}
        {it.to ? <Link to={it.to}>{it.label}</Link> : <span className="now">{it.label}</span>}
      </React.Fragment>
    ))}
  </nav>
);
