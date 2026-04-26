import React from 'react';

export const BlogHero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 bg-surface-hero border-b border-surface-border transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <span className="text-secondary font-bold tracking-widest uppercase text-xs">
          Artigos e Novidades
        </span>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-site-text mt-4">
          Blog da <span className="text-secondary">Dra. Alexandra</span>
        </h1>
        <p className="text-site-text-muted mt-6 max-w-2xl mx-auto text-lg font-light">
          Explore conteúdos exclusivos sobre medicina integrativa, longevidade e saúde funcional.
        </p>
      </div>
    </section>
  );
};