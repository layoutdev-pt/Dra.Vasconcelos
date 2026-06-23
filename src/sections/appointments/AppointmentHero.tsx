import React from 'react';
import { ArrowRight, Info, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const AppointmentHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-surface-hero overflow-hidden flex flex-col items-center text-center px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Tag */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-xs md:text-sm mb-8 shadow-sm border border-secondary/20"
        >
          <Video className="w-4 h-4" />
          <span>Primeira consulta exclusivamente online</span>
        </motion.div>

        {/* Headlines */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-site-text leading-tight tracking-tight mb-6"
        >
          Agende a sua Consulta de <br className="hidden md:block" />
          Saúde Integrativa
        </motion.h1>
        
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-site-text-muted max-w-2xl font-light mb-10 leading-relaxed"
        >
          Uma abordagem personalizada que une a medicina convencional e funcional para tratar a causa raiz dos seus sintomas.
        </motion.p>

        {/* CTA Button */}
        <motion.a
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          href="https://buk.pt/draalexandravasconcelos"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-xl shadow-secondary/20 flex items-center gap-3 mb-16"
        >
          <span>Agendar Agora</span>
          <ArrowRight className="w-5 h-5" />
        </motion.a>

        {/* Cancellation Notice */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="bg-surface-muted border border-surface-border rounded-2xl p-4 md:p-5 flex items-start text-left gap-4 max-w-3xl shadow-sm"
        >
          <div className="bg-site-text-muted/10 text-site-text p-2 rounded-full shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-site-text text-sm md:text-base">Política de Cancelamento</h4>
            <p className="text-site-text-muted text-xs md:text-sm mt-1 leading-relaxed">
              Informamos que as consultas marcadas não dão direito à devolução de valor em caso de cancelamento. É possível solicitar uma alteração na data, desde que o pedido seja efetuado com uma antecedência mínima de 48 horas.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
