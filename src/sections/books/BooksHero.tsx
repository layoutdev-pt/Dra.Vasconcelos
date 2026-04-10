import React from 'react';
import { ArrowDown, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const BooksHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-surface-hero overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left — Text content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 font-medium text-xs md:text-sm mb-8 shadow-sm border border-amber-100"
            >
              <BookOpen className="w-4 h-4" />
              <span>Publicações da Dra. Alexandra Vasconcelos</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight tracking-tight mb-6"
            >
              Conhecimento que <br className="hidden md:block" />
              <span className="text-secondary">Transforma</span>, em <br className="hidden lg:block" />
              qualquer formato.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-gray-500 font-light mb-10 leading-relaxed max-w-xl"
            >
              Explore a nossa coleção de livros físicos e digitais. Guias práticos de saúde integrativa para ler onde e quando quiser.
            </motion.p>

            <motion.a
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              href="#catalogo"
              className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:-translate-y-1 shadow-xl shadow-secondary/20"
            >
              Explorar Biblioteca
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </motion.a>
          </div>

          {/* Right — Floating book mockups */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="flex-1 relative flex items-center justify-center min-h-[360px] md:min-h-[440px]"
          >
            {/* Physical book mockup */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-20"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-[200px] h-[290px] md:w-[240px] md:h-[340px] rounded-r-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] bg-white overflow-hidden border border-gray-100"
                style={{
                  transform: 'rotateY(-8deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-gray-300 to-gray-100" />
                {/* Cover content */}
                <div className="absolute inset-0 pl-4 pr-5 py-6 flex flex-col justify-between bg-gradient-to-br from-primary via-primary to-primary/90">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Alexandra Vasconcelos</p>
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                      Jovem e<br />Saudável<br />
                      <span className="text-accent italic">em 21 Dias</span>
                    </h3>
                  </div>
                  <div className="relative z-10">
                    <div className="w-8 h-0.5 bg-accent/40" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ebook / tablet mockup */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute right-0 md:right-4 top-8 md:top-4 z-10"
              style={{ perspective: '1000px' }}
            >
              <div
                className="w-[140px] h-[200px] md:w-[170px] md:h-[240px] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] bg-gray-900 overflow-hidden border-4 border-gray-800"
                style={{
                  transform: 'rotateY(6deg) rotateX(-2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Screen content */}
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex flex-col items-center justify-center px-4 py-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  <p className="text-[7px] md:text-[8px] uppercase tracking-[0.15em] text-blue-200 mb-2 relative z-10">Ebook</p>
                  <h4 className="text-xs md:text-sm font-bold text-white text-center leading-tight relative z-10">
                    Guia de Suplementação Inteligente
                  </h4>
                  <div className="flex gap-1 mt-3 relative z-10">
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <div className="w-1 h-1 rounded-full bg-white/50" />
                    <div className="w-1 h-1 rounded-full bg-white/25" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shadow disc */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[30px] bg-black/5 rounded-full blur-xl" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
