import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

interface LayoutShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children, breadcrumbs }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="wrap" style={{ paddingTop: '16px' }}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <main id="main-content" style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};
