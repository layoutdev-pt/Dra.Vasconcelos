import React from 'react';
import { ExternalLink, MapPin, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const LOCATIONS = [
  {
    id: 'lisboa',
    city: 'Lisboa',
    address: 'Avenida Sérgio Vieira de Mello, 17A\n1750-344 Lisboa',
    embedQuery: 'Avenida+Sérgio+Vieira+de+Mello+17A+Lisboa',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+S%C3%A9rgio+Vieira+de+Mello+17A+Lisboa',
    extraInfo: 'ERS 26476/2025',
    pdfUrl: '/docs/clinica lisboa.pdf',
  },
  {
    id: 'braga',
    city: 'Braga',
    address: 'Avenida do Cávado, 235 Palmeira\n4700-690 Braga',
    embedQuery: 'Avenida+do+Cávado+235+Palmeira+Braga',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+do+C%C3%A1vado+235+Palmeira+Braga',
    extraInfo: 'Apenas testes de intolerância alimentar',
    pdfUrl: '/docs/clinica Braga.pdf',
  },
  {
    id: 'gaia',
    city: 'Vila Nova de Gaia',
    address: 'Rua António Luís Gomes, 168 R/C Dtº Frente\n4400-125 Vila Nova de Gaia',
    embedQuery: 'Rua+António+Luís+Gomes+168+Vila+Nova+de+Gaia',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Ant%C3%B3nio+Lu%C3%ADs+Gomes+168+Vila+Nova+de+Gaia',
    extraInfo: 'ERS 23480/2023',
    pdfUrl: '/docs/clinica Vila nova de Gaia.pdf',
  },
  // {
  //   id: 'vilamoura',
  //   city: 'Vilamoura',
  //   address: 'Avenida Tivoli Edifício Alcharb\nFração e R/C, 8125-410 Vilamoura',
  //   embedQuery: 'Avenida+Tivoli+Edifício+Alcharb+Vilamoura',
  //   mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+Tivoli+Edif%C3%ADcio+Alcharb+Vilamoura',
  // },
];

const EMBED_BASE = 'https://maps.google.com/maps?q=';
const EMBED_SUFFIX = '&output=embed&z=16';

/* ─── Animation variants ──────────────────────────────────────────────── */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const cardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const Locations: React.FC = () => {
  return (
    <section className="py-20 bg-site-bg">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.span variants={fadeInUp} custom={0} className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
            Onde Estamos
          </motion.span>
          <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-4xl font-bold text-site-text mb-4">
            As Nossas Localizações
          </motion.h2>
          <motion.p variants={fadeInUp} custom={2} className="text-site-text-muted font-light text-lg">
            Consultas presenciais em 2 locais em Portugal (Lisboa e Vila Nova de Gaia) e espaço dedicado a testes em Braga, com primeira consulta exclusivamente online.
          </motion.p>
        </motion.div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.id}
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              custom={i}
              className="bg-surface rounded-3xl overflow-hidden border border-surface-border shadow-sm hover:shadow-[0_8px_32px_0_rgba(124,176,176,0.18)] transition-shadow duration-300 flex flex-col group"
            >
              {/* Map embed */}
              <div className="relative h-[250px] overflow-hidden">
                <iframe
                  src={`${EMBED_BASE}${loc.embedQuery}${EMBED_SUFFIX}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa da clínica em ${loc.city}`}
                />
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col grow">
                {/* City heading & Extra Info */}
                <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-3 mb-3">
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-secondary shrink-0" />
                    <h3 className="font-bold text-base text-site-text leading-tight">{loc.city}</h3>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                    {/* Extra info badge */}
                    {loc.extraInfo && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-surface-muted text-site-text-muted border border-surface-border rounded-md text-xs font-semibold text-right sm:text-left text-balance">
                        {loc.extraInfo}
                      </span>
                    )}
                    {/* Informações button */}
                    {loc.pdfUrl && (
                      <a
                        href={loc.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-site-text text-[11px] font-semibold hover:border-secondary hover:text-secondary transition-colors duration-200 shadow-sm"
                      >
                        Informações
                        <Info className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Address */}
                <p className="text-secondary text-sm font-medium leading-relaxed whitespace-pre-line mb-4">
                  {loc.address}
                </p>
                {/* Action buttons */}
                <div className="mt-auto">
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-surface-border text-site-text text-xs font-semibold hover:border-secondary hover:text-secondary transition-colors duration-200 shadow-sm group/btn"
                  >
                    Abrir Mapa
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
