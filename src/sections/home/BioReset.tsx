import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react'; // Corrigido: Importação de ícones
import { useCourses } from '../../hooks/useCourses'; // Corrigido: Importação do Hook
import { Link } from 'react-router-dom'; // Corrigido: Importação do Link
import { OptimizedImage } from '../../components/OptimizedImage';

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

  return (
    <section className="py-24 bg-site-bg relative overflow-hidden z-0 transition-colors duration-500">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        <div className="bg-surface rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center gap-12 border border-surface-border backdrop-blur-sm">
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-surface-muted text-secondary text-[10px] font-bold uppercase rounded-full tracking-widest border border-surface-border">
              {latestCourse.type === 'programa' ? 'Programa' : latestCourse.type === 'presencial' ? 'Presencial' : 'Curso'}
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-site-text">
              BioReset® 14 Dias – 7ª Edição Especial Outono
            </h2>
            
            <p className="text-lg text-site-text-muted leading-relaxed font-light">
              Início: 27 de Setembro de 2026. Prepara o teu corpo para a nova estação com um reset profundo e recupera a tua vitalidade! Sob a orientação da Dra. Alexandra Correia, este é o programa prático que vai transformar a tua saúde.
            </p>
            
            <ul className="space-y-4 pt-2">
              {[
                <React.Fragment key="1"><span className="font-bold">Acompanhamento Especializado:</span> 4 Reuniões Online (Formação Prática via Zoom) e Grupo VIP no Telegram com acompanhamento diário.</React.Fragment>,
                <React.Fragment key="2"><span className="font-bold">Conteúdo Programático Exclusivo:</span> Limpeza total (desparasitação e desintoxicação do fígado, vesícula e intestino), recuperação de energia e criação de novos hábitos alimentares.</React.Fragment>,
                <React.Fragment key="3"><span className="font-bold">Materiais de Apoio Digitais:</span> Acesso às gravações das sessões por 3 meses e bónus de 50% de desconto no Teste de Intolerância Alimentar</React.Fragment>
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-site-text font-medium leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50 dark:fill-green-500/10 shrink-0 mt-0.5" />
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
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-surface-border">
              <OptimizedImage 
                src={latestCourse.image_url} 
                alt={latestCourse.title} 
                className="w-full h-auto block" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};