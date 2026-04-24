import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react'; // Corrigido: Importação de ícones
import { useCourses } from '../../hooks/useCourses'; // Corrigido: Importação do Hook
import { Link } from 'react-router-dom'; // Corrigido: Importação do Link

export const BioReset: React.FC = () => {
  const { courses, loading } = useCourses();

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center bg-hero-bg">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  const latestCourse = courses[0];
  if (!latestCourse) return null;

  const formattedDate = latestCourse.published_at 
    ? new Date(latestCourse.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })
    : 'Em breve';

  return (
    <section className="py-24 bg-site-bg relative overflow-hidden z-0 transition-colors duration-500">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center gap-12 border border-blue-50/50 dark:border-white/5 backdrop-blur-sm">
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-secondary/10 text-secondary text-[10px] font-bold uppercase rounded-full tracking-widest border dark:border-secondary/20">
              {latestCourse.type === 'programa' ? 'Programa' : 'Curso'}
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-site-text">
              {latestCourse.title}
            </h2>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-light">
              {latestCourse.published_at && `Início: ${formattedDate}. `}
              {latestCourse.description}
            </p>
            
            <ul className="space-y-4 pt-2">
              {['Acompanhamento Especializado', 'Conteúdo Programático Exclusivo', 'Materiais de Apoio Digitais'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50 dark:fill-green-500/10" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-6">
              <Link to={`/cursos/${latestCourse.id}`} className="inline-block bg-secondary hover:bg-secondary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Garanta Já a Sua Vaga
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative w-full mt-8 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/2] shadow-sm border border-gray-100 dark:border-white/10">
              <img 
                src={latestCourse.image_url} 
                alt={latestCourse.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};