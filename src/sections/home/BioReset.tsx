import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Cartão principal branco sólido */}
        <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center gap-12 border border-gray-100">
          
          {/* Coluna Esquerda: Texto */}
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-50 text-secondary text-[10px] font-bold uppercase rounded-full tracking-widest">
              Signature Program
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary">
              The <span className="text-secondary">BioReset</span> Protocol
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed font-light">
              A scientifically backed 30-day journey to reset your metabolic clock, reduce inflammation, and restore natural energy levels. This isn't a diet—it's a biological realignment.
            </p>
            
            <ul className="space-y-4 pt-2">
              {['Comprehensive Hormonal Analysis', 'Customized Nutrition Plan', 'Daily Guidance App Access'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600 font-medium">
                  {/* Ícone atualizado para Lucide React */}
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-6">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Explore BioReset
              </button>
            </div>
          </div>
          
          {/* Coluna Direita: Imagem e Cartão Flutuante */}
          <div className="lg:w-1/2 relative w-full mt-8 lg:mt-0">
            {/* Imagem Principal */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/2] shadow-sm border border-gray-100">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4zPcXMGfkhtBUonMu9y7lQXXEsDUo7qD6g75gF10_uDJzcMyAH7yUE-zoUgOa3s6Z4unCTs2ArDWFaK860-TCS7gB13yFIr_FcLyr2askRwKiWcS9sWPsPgDGFb7oewFSM1KwPqQEkH3WI8a9QR7Hw6tdwjsxSTj8W5q7h6luRDGCoJRXapF_RuYV5KJBR0PxIzpRycdHYhP2tUDVhCf7OBZVxCB8CONxOPvQ4PAu-T0xEYABHn-vAd1jYqdga52t6wJHJd-hJclL" 
                alt="BioReset Protocol" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Cartão de Resultados (Flutuante) */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-float max-w-[200px] border border-gray-50 animate-float-gentle hidden sm:block">
              <div className="flex items-center justify-between mb-4 gap-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Results</span>
                <span className="text-green-500 font-bold text-sm">+24%</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1 text-gray-500 font-medium">
                    <span>Energy</span> 
                    <span>High</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1 text-gray-500 font-medium">
                    <span>Sleep Quality</span> 
                    <span>Deep</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-periwinkle h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};