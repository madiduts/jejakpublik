import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Breadcrumbs, Crumb } from './Breadcrumbs';

export const LayoutShell: React.FC<{ children: React.ReactNode; crumbs?: Crumb[]; mainClass?: string }> = ({ children, crumbs, mainClass }) => (
  <div className="app">
    <Navbar />
    {crumbs && <div className="wrap crumbsbar"><Breadcrumbs items={crumbs} /></div>}
    <main id="main-content" className={mainClass}>{children}</main>
    <Footer />
  </div>
);
