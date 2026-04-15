import React from 'react';
import { ArrowDown, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import bookHero from '../../assets/images/book_hero.png';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const AcademyHero: React.FC = () => {
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

          {/* Right — Real book image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="flex-1 relative flex items-center justify-center min-h-[440px] md:min-h-[560px]"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 drop-shadow-[0_40px_60px_rgba(0,0,0,0.18)]"
              style={{ perspective: '1000px' }}
            >
              <img
                src={bookHero}
                alt="Livros da Dra. Alexandra Vasconcelos"
                className="w-[380px] md:w-[500px] lg:w-[580px] h-auto object-contain select-none"
                style={{ transform: 'rotateY(-6deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}
              />
            </motion.div>

            {/* Ground shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[260px] h-[28px] bg-black/5 rounded-full blur-xl" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
