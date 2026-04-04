import React from 'react';
import draHero from '../../assets/images/dra3.jpg';
import { ArrowDown } from 'lucide-react';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden pt-24">
      <div className="absolute top-0 left-0 w-1/2 h-full bg-surface-hero hidden lg:block" />
      
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="space-y-6 pt-12 lg:pt-0">
            <span className="text-secondary font-bold tracking-widest uppercase text-xs">
              A Minha Missão
            </span>
            <h1 className="text-5xl lg:text-[4rem] font-extrabold text-primary leading-[1.05] tracking-tight">
              Transformando Vidas <br/>
              Através da <span className="text-secondary">Ciência Humana.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-light">
              Uma jornada que une a ciência rigorosa ao cuidado holístico, focada em ajudar clinicamente na base do estilo de vida contemporâneo. A Dra. Alexandra combina rigor académico com uma abordagem humanizada para redefinir o bem-estar no século XXI.
            </p>
            
            <div className="pt-4">
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-primary/20 hover:-translate-y-1 flex items-center gap-3"
              >
                Conheça a Trajetória
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-[600px] lg:h-[800px] flex items-end justify-center">
            <img 
              src={draHero} 
              alt="Dra. Alexandra Vasconcelos" 
              className="w-full h-full object-cover object-top rounded-[2rem] lg:rounded-[3rem] shadow-2xl border-4 border-white/50" 
            />
          </div>

        </div>
      </div>
    </section>
  );
};
