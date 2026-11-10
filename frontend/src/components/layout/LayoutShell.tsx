import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Breadcrumbs, Crumb } from './Breadcrumbs';

export const LayoutShell: React.FC<{ children: React.ReactNode; crumbs?: Crumb[] }> = ({ children, crumbs }) => (
  <div className="app">
    <Navbar />
    {crumbs && <div className="wrap"><Breadcrumbs items={crumbs} /></div>}
    <main id="main-content">{children}</main>
    <Footer />
  </div>
);
