import React, { useState } from 'react';
import { PlayCircle, CheckCircle2 } from 'lucide-react';
import { PalestraModal } from '../../components/common/PalestraModal';
import palestraImg from '../../assets/images/Palestra Online Gratuita.jpeg';

export const PalestraSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24 bg-site-bg relative overflow-hidden z-0 transition-colors duration-500">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        <div className="bg-surface rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center gap-12 border border-surface-border backdrop-blur-sm">
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-muted text-secondary text-[10px] font-bold uppercase rounded-full tracking-widest border border-surface-border">
              Material Gratuito
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-site-text">
              Palestra Online Gratuita: O Poder da Biorressonância para Uso Pessoal
            </h2>
            
            <p className="text-lg text-site-text-muted leading-relaxed font-light">
              Gostaria de ter a tecnologia avançada da biorressonância a trabalhar diariamente para o seu bem-estar e o da sua família? Descubra como esta tecnologia pode apoiar os processos naturais de recuperação do seu corpo!
            </p>
            
            <ul className="space-y-4 pt-2">
              {[
                '1ª Parte: Apresentação e Aplicações com Aliki Athanasiou',
                '2ª Parte: Prática de Programação com Tassos Karantonis',
                'Evento de 2 horas (31 de Maio) - 100% Online e Gratuito'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-site-text font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50 dark:fill-green-500/10 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Receber Convite e Acesso (Zoom)
                <PlayCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative w-full mt-8 lg:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="relative rounded-2xl overflow-hidden shadow-sm border border-surface-border group cursor-pointer block w-full text-left"
            >
              <img 
                src={palestraImg} 
                alt="Palestra Preview" 
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <PalestraModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};
