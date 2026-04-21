import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import { Link } from 'react-router-dom';

export const BioReset: React.FC = () => {
  const { courses, loading } = useCourses();

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center bg-surface-hero">
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
    <section className="py-24 bg-white relative overflow-hidden z-0">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center gap-12 border border-blue-50/50">
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-50 text-secondary text-[10px] font-bold uppercase rounded-full tracking-widest">
              {latestCourse.type === 'programa' ? 'Programa' : 'Curso'}
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary">
              {latestCourse.title}
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed font-light">
              {latestCourse.published_at && `Início: ${formattedDate}. `}
              {latestCourse.description}
            </p>
            
            <ul className="space-y-4 pt-2">
              {['Acompanhamento Especializado', 'Conteúdo Programático Exclusivo', 'Materiais de Apoio Digitais'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-6">
              <Link to={`/cursos/${latestCourse.id}`} className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Garanta Já a Sua Vaga
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative w-full mt-8 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/2] shadow-sm border border-gray-100">
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