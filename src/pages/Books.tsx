import React from 'react';
import { AcademyHero } from '../sections/academy/AcademyHero';
import { AcademyMetrics } from '../sections/academy/AcademyMetrics';
import { AcademyLeadMagnet } from '../sections/academy/AcademyLeadMagnet';
import { AcademyTrustBadge } from '../sections/academy/AcademyTrustBadge';
import { AcademyBooks } from '../sections/academy/AcademyBooks';
import { motion } from 'framer-motion';

export const Books: React.FC = () => {
  return (
    <div className="w-full">
      <AcademyHero />
      <AcademyMetrics />

      <section className="py-24 bg-site-bg" id="catalogo">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
              Biblioteca Digital
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-site-text mb-4">Todas as Publicações</h2>
            <p className="text-site-text-muted font-light text-lg max-w-2xl mx-auto">
              Guias práticos de saúde integrativa para ler onde e quando quiser.
            </p>
          </motion.div>
          <AcademyBooks />
        </div>
      </section>

      <AcademyLeadMagnet />
      <AcademyTrustBadge />
    </div>
  );
};
