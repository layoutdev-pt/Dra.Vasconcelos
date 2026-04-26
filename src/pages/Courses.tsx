import React from 'react';
import { CoursesHero } from '../sections/academy/CoursesHero';
import { AcademyMetrics } from '../sections/academy/AcademyMetrics';
import { AcademyLeadMagnet } from '../sections/academy/AcademyLeadMagnet';
import { AcademyTrustBadge } from '../sections/academy/AcademyTrustBadge';
import { AcademyCourses } from '../sections/academy/AcademyCourses';
import { motion } from 'framer-motion';

export const Courses: React.FC = () => {
  return (
    <div className="w-full">
      <CoursesHero />
      <AcademyMetrics />
      
      <section className="py-24 bg-white" id="catalogo">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
              Formação Contínua
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-4">Mergulhe Mais Fundo</h2>
            <p className="text-gray-500 font-light text-lg max-w-2xl mx-auto">
              Os nossos programas intensivos e cursos práticos desenhados para transformar a sua saúde.
            </p>
          </motion.div>
          <AcademyCourses />
        </div>
      </section>

      <AcademyLeadMagnet />
      <AcademyTrustBadge />
    </div>
  );
};
