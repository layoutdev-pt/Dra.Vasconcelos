import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingCart } from 'lucide-react';
import { supabase } from '../config/supabase';
import type { Course } from '../types/course';
import DOMPurify from 'dompurify'; // Sanitizes the rich text

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase.from('courses').select('*').eq('id', id).single();
      if (data) setCourse(data);
      setLoading(false);
    }
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-32 pb-24 min-h-screen text-center">
        <h2 className="text-2xl font-bold">Curso não encontrado.</h2>
        <Link to="/aprender" className="text-secondary hover:underline mt-4 inline-block">
          Voltar para a Academia
        </Link>
      </div>
    );
  }

  // Sanitize the HTML from the rich text editor
  const cleanHTML = course.content ? DOMPurify.sanitize(course.content) : '';

  return (
    <div className="pt-32 pb-24 min-h-screen bg-surface-hero relative overflow-hidden z-0">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-secondary) 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>

      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        <Link to="/aprender" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-secondary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar aos cursos
        </Link>
        
        <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-start gap-12 border border-gray-100">
          
          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-50 text-secondary text-[10px] sm:text-xs font-bold uppercase rounded-full tracking-widest border border-blue-100">
              {course.type === 'programa' ? 'Programa ao Vivo' : 'Curso Online'}
            </div>
            
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-primary leading-tight">
              {course.title}
            </h1>

            {course.subtitle && (
              <h2 className="text-xl lg:text-2xl font-medium text-gray-500">
                {course.subtitle}
              </h2>
            )}
            
            <p className="text-lg text-gray-500 leading-relaxed font-light pb-6 border-b border-gray-100">
              {course.description}
            </p>
            
            {/* Rich Text Render Area */}
            {cleanHTML ? (
              <div 
                className="prose prose-lg max-w-none text-gray-600 prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-secondary-dark"
                dangerouslySetInnerHTML={{ __html: cleanHTML }}
              />
            ) : (
              <p className="text-gray-400 italic">Mais informações em breve...</p>
            )}

            {course.buy_url && (
               <div className="pt-6 lg:hidden">
                <a href={course.buy_url} target="_blank" rel="noopener noreferrer" className="bg-primary flex items-center justify-center gap-3 w-full hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Inscrever-me Agora
                </a>
              </div>
            )}
          </div>
          
          {/* Floating Sidebar (Like in the screenshot) */}
          <div className="lg:w-1/3 w-full sticky top-32">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-sm border border-gray-100 mb-6 bg-gray-50">
              {course.image_url ? (
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sem Imagem
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                Resumo
              </div>

              {course.price !== null && (
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 text-3xl font-bold text-secondary">
                  {course.price === 0 ? 'Gratuito' : `€${course.price.toFixed(2)}`}
                </div>
              )}

              {course.buy_url ? (
                <a href={course.buy_url} target="_blank" rel="noopener noreferrer" className="bg-primary flex items-center justify-center gap-3 hover:bg-primary/90 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group w-full mt-2">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Inscrever-me
                </a>
              ) : (
                <div className="bg-gray-100 text-gray-500 font-medium px-6 py-4 rounded-xl text-center w-full mt-2">
                  Inscrições Encerradas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
