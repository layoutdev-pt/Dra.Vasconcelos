import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademyCourses } from './AcademyCourses';
import { AcademyBooks } from './AcademyBooks';
import { GraduationCap, BookOpen } from 'lucide-react';

type Tab = 'cursos' | 'livros';

export const AcademyTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cursos');

  return (
    <section className="py-16 bg-white shrink-0" id="catalogo">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-sm relative w-full max-w-md mx-auto">
            
            <button
              onClick={() => setActiveTab('cursos')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all z-10 ${
                activeTab === 'cursos' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              Cursos e Programas
            </button>

            <button
              onClick={() => setActiveTab('livros')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all z-10 ${
                activeTab === 'livros' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Livros e Ebooks
            </button>

            {/* Fundo Deslizante Ativo */}
            <div 
              className={`absolute top-2 bottom-2 w-[calc(50%-8px)] bg-white rounded-xl shadow-sm border border-gray-100 transition-transform duration-300 ease-out`}
              style={{ transform: activeTab === 'cursos' ? 'translateX(0)' : 'translateX(100%)' }}
            />
          </div>
        </div>

        {/* Tab Content com Transições */}
        <div className="w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'cursos' ? (
              <motion.div
                key="cursos"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
                    Formação Contínua
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">Mergulhe Mais Fundo</h2>
                  <p className="text-gray-500 font-light">Os nossos programas intensivos e cursos práticos.</p>
                </div>
                <AcademyCourses />
              </motion.div>
            ) : (
              <motion.div
                key="livros"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
                    Catálogo
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">Todas as Publicações</h2>
                  <p className="text-gray-500 font-light">Guias práticos de saúde integrativa para todos os momentos.</p>
                </div>
                <AcademyBooks />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
