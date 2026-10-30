import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <Link to="/" style={{ color: 'var(--muted)', fontWeight: 500 }}>
        Beranda
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight size={14} color="var(--muted)" aria-hidden="true" />
            {item.to && !isLast ? (
              <Link to={item.to} style={{ color: 'var(--muted)', fontWeight: 500 }}>
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? 'page' : undefined}
                style={{ color: 'var(--ink)', fontWeight: 600 }}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
