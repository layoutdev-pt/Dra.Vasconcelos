import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Globe, Star, TrendingUp } from 'lucide-react';

const METRICS = [
  { icon: TrendingUp, value: '+50.000', label: 'Livros Vendidos' },
  { icon: BookOpen, value: '15+', label: 'Títulos Publicados' },
  { icon: Globe, value: '12', label: 'Países com Leitores' },
  { icon: Star, value: '4.9/5', label: 'Avaliação Média' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const BooksMetrics: React.FC = () => {
  return (
    <section className="py-6 bg-white border-y border-gray-100">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6"
        >
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">{metric.value}</p>
                  <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">{metric.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
