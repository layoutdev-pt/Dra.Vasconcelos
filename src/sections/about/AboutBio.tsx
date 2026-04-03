import React from 'react';
import draImg2 from '../../assets/images/dra_hero.png';
import { Quote, Globe2 } from 'lucide-react';

export const AboutBio: React.FC = () => {
  return (
    <section className="py-24 bg-[#FAFBFF] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-120 h-120 bg-periwinkle/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        {/* Intro Block with Large Quote */}
        <div className="relative bg-white rounded-3xl p-10 lg:p-16 shadow-xl border border-gray-100 mb-20 group">
          <Quote className="absolute top-6 left-6 lg:top-10 lg:left-10 w-16 h-16 text-secondary/10 group-hover:text-secondary/20 transition-colors" />
          <p className="text-2xl lg:text-4xl text-primary font-bold leading-tight relative z-10 pl-6 lg:pl-12">
            "Sempre soube que queria trabalhar na área da saúde e ajudar as pessoas a <span className="text-secondary">viver mais felizes.</span>"
          </p>
        </div>

        {/* Large Image with Floating Quote
        <div className="relative h-[500px] lg:h-[700px] w-full rounded-3xl overflow-hidden shadow-2xl group mb-20">
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
            <img src={draImg2} alt="Dra. Alexandra Clínica" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 object-top" />
            {/* Floating Info */}
            {/*<div className="absolute bottom-8 left-8 right-8 md:left-12 md:right-12 md:bottom-12 bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl z-20 shadow-float max-w-3xl">
              <p className="text-primary font-semibold leading-relaxed text-lg md:text-xl">
                "A minha preocupação é a saúde, a descoberta das causas dos desconfortos, dores e sofrimento que afetam as pessoas e, como tal, ajudá-las a encontrar e a percorrer os caminhos que as mantenham jovens e saudáveis."
              </p>
            </div>
        </div>

        {/* Mission / Motivation Section */}
        <div className="bg-linear-to-br from-white to-blue-50/50 rounded-3xl p-10 lg:p-16 border border-gray-100 shadow-sm flex flex-col items-center text-center max-w-4xl mx-auto">
          <Globe2 className="w-12 h-12 text-secondary mb-6" />
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
            Hoje sou diretora e fundadora das Clínicas Viver: Medicina Integrativa em Lisboa e Porto, sou oradora em diversos congressos e cursos de especialização no âmbito da Nutrição Funcional, Saúde Intestinal, Doenças Autoimunes e Envelhecimento Saudável.
          </p>
          <div className="bg-primary/5 text-primary px-8 py-4 rounded-full border border-primary/10">
            <p className="font-bold text-lg">
              "E sinto que a minha missão é cada vez mais essencial para o bem-estar das pessoas."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
