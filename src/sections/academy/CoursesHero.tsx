import React from 'react';
import { ArrowDown, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import coursesHero from '../../assets/images/courses_hero.png'; // I will rename the generated image to this or use the absolute path for now

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const CoursesHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-surface-hero overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl opacity-30" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-xs md:text-sm mb-8 shadow-sm border border-secondary/20"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Formação Avançada em Saúde Integrativa</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-site-text leading-tight tracking-tight mb-6"
            >
              Cursos que <br className="hidden md:block" />
              <span className="text-secondary">Capacitam</span> a sua <br className="hidden lg:block" />
              Jornada de Saúde.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-site-text-muted font-light mb-10 leading-relaxed max-w-xl"
            >
              Programas intensivos desenhados para quem procura profundidade científica e resultados práticos na medicina integrativa.
            </motion.p>

            <motion.a
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              href="#catalogo"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:-translate-y-1 shadow-xl shadow-primary/20"
            >
              Ver Cursos Disponíveis
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </motion.a>
          </div>

          {/* Right — Floating Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="flex-1 relative flex items-center justify-center min-h-[500px] md:min-h-[650px] lg:min-h-[750px]"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 drop-shadow-[0_40px_60px_rgba(0,0,0,0.18)]"
              style={{ perspective: '1000px' }}
            >
              <img
                src={coursesHero}
                alt="Cursos Dra. Alexandra Vasconcelos"
                className="w-full max-w-[500px] md:max-w-[750px] lg:max-w-[950px] h-auto object-contain select-none transition-all duration-300"
                style={{ transform: 'rotateY(6deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}
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
