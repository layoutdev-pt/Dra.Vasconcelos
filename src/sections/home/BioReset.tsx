import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import curso1 from '../../assets/images/curso1.jpg';

export const BioReset: React.FC = () => {
  return (
    // Fundo alterado para bg-surface-hero (#eceef9 definido no CSS)
    <section className="py-24 bg-surface-hero relative overflow-hidden z-0">
      
      {/* Padrão de pontos subtil no fundo */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-secondary) 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>
      
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        {/* Cartão principal branco sólido */}
        <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center gap-12 border border-gray-100">
          
          {/* Coluna Esquerda: Texto */}
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-50 text-secondary text-[10px] font-bold uppercase rounded-full tracking-widest">
              Programa
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary">
              7.ª Edição <span className="text-secondary">BioReset 21</span> - 14 dias
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed font-light">
              Início: 27 de setembro. Um programa único desenhado para reativar o seu corpo, reduzir inflamação e otimizar processos celulares.
            </p>
            
            <ul className="space-y-4 pt-2">
              {['Acompanhamento Diário ao Vivo', 'Plano Nutricional Anti-inflamatório', 'Materiais de Apoio Exclusivos'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600 font-medium">
                  {/* Ícone atualizado para Lucide React */}
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-6">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Garanta Já a Sua Vaga
              </button>
            </div>
          </div>
          
          {/* Coluna Direita: Imagem e Cartão Flutuante */}
          <div className="lg:w-1/2 relative w-full mt-8 lg:mt-0">
            {/* Imagem Principal */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/2] shadow-sm border border-gray-100">
              <img 
                src={curso1} 
                alt="BioReset 21" 
                className="w-full h-full object-cover" 
              />
            </div>
            


          </div>
        </div>
      </div>
    </section>
  );
};