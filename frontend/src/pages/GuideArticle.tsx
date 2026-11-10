import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Empty } from '../components/ui';
import { ARTICLES } from '../data/site';

const toParagraphs = (body: string): React.ReactNode[] =>
  body.split('\n').filter(Boolean).map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
    return <p key={i}>{line}</p>;
  });

export const GuideArticle: React.FC = () => {
  const { slug = '' } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Panduan', to: '/panduan' }, { label: 'Tidak ditemukan' }]}>
        <div className="wrap page"><Empty title="Artikel tidak ditemukan"><Link to="/panduan">Kembali ke panduan</Link>.</Empty></div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Panduan', to: '/panduan' }, { label: article.title }]}>
      <div className="wrap page">
        <div className="eyebrow">{article.reading}</div>
        <h1 style={{ fontSize: 30, fontWeight: 750, maxWidth: 820 }}>{article.title}</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 26, fontSize: 14.5 }}>{article.desc}</p>
        <article className="prose">{toParagraphs(article.body)}</article>
        <div className="divider" />
        <div className="rowgap">
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>Lanjut baca:</span>
          {ARTICLES.filter((a) => a.slug !== article.slug).map((a) => (
            <Link key={a.slug} to={`/panduan/${a.slug}`} className="chip">{a.title.slice(0, 34)}…</Link>
          ))}
        </div>
      </div>
    </LayoutShell>
  );
};
