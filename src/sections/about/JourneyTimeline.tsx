import React, { useEffect, useState, useRef } from 'react';

export const JourneyTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      // Range: from the moment the element enters the middle of the screen 
      // up to the point where its bottom reaches the middle of the screen
      const startTrigger = top - (windowHeight / 2);
      const totalScrollable = height;
      
      let p = -startTrigger / totalScrollable;
      p = Math.max(0, Math.min(1, p)); // Clamp between 0 and 1
      setProgress(p * 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const milestones = [
    {
      year: "1965",
      title: "As Raízes & Ciência Farmacêutica",
      description: "Optei por me licenciar em Ciências Farmacêuticas em Lisboa, e trabalhei durante anos como farmacêutica em Estremoz e Lisboa. Cresci a ouvir falar de doença (o meu pai era médico) e o contacto direto com as pessoas criou-me a convicção de que era necessário abordar a saúde segundo novas perspetivas: focar na sua prevenção e abrandar o envelhecimento."
    },
    {
      year: "2003",
      title: "Mudança de Paradigma",
      description: "Neste ano, optei por abandonar a prática de farmácia de oficina para me dedicar ao estudo e à formação em medicina preventiva. Procurei incessantemente terapêuticas biológicas que respeitassem a genética individual de cada pessoa, e levando sempre em conta a vertente física, mental e espiritual."
    },
    {
      year: "Hoje",
      title: "O Ponto Viragem e Propósito",
      description: "O resultado que vejo diariamente nos pacientes é a minha grande motivação. Sinto-me extremamente grata pela vida por me ter dado a convicção de investir nestas áreas de medicina integrativa e biológica, permitindo-me desempenhar um papel determinante na modelação das doenças crónicas."
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-32 bg-[#0a0f1c] text-white overflow-hidden">
      
      {/* Elementos visuais de fundo abstratos */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Uma Jornada de Propósito
          </h2>
          <p className="text-secondary/80 text-sm tracking-widest uppercase font-semibold">
            Role para explorar os marcos da minha carreira
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Linha vertical central Background */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full overflow-hidden">
             {/* Dynamic Animated Line */}
             <div 
               className="w-full bg-linear-to-b from-secondary via-secondary to-green-300 rounded-full" 
               style={{ 
                 height: `${progress}%`,
                 transition: 'height 0.1s ease-out'
               }} 
             />
          </div>

          <div className="space-y-24">
            {milestones.map((item, idx) => {
               // Determine if this milestone is "active" based on scroll progress
               // Let's divide 100% by the number of milestones
               const threshhold = (idx) * (100 / milestones.length);
               const isActive = progress >= threshhold;

               return (
              <div key={idx} className={`relative flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Ponto / Ano no centro (desktop) ou esquerda (mobile) */}
                <div className="absolute left-0 md:left-1/2 top-0 flex items-center justify-center transform md:-translate-x-1/2">
                  <div className={`w-[56px] h-[56px] rounded-full bg-[#0a0f1c] border-4 flex items-center justify-center z-10 transition-colors duration-500 ${isActive ? 'border-secondary shadow-[0_0_20px_rgba(124,176,176,0.8)]' : 'border-white/20'}`}>
                    <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${isActive ? 'bg-secondary' : 'bg-white/20'}`} />
                  </div>
                </div>

                {/* Ano vizualmente associado ao ponto no desktop, ou ao lado no mobile */}
                <div className={`hidden md:block w-1/2 pt-4 ${idx % 2 === 0 ? 'text-left pl-16' : 'text-right pr-16'}`}>
                  <span className={`text-5xl font-black transition-all duration-500 ${isActive ? 'text-secondary opacity-100' : 'text-white/20'}`}>{item.year}</span>
                </div>

                {/* Cartão de Conteúdo */}
                <div className={`w-full pl-20 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className={`border p-8 rounded-2xl backdrop-blur-sm transition-all duration-500 ${isActive ? 'bg-white/10 border-secondary/30 scale-100' : 'bg-white/5 border-white/5 scale-95 opacity-50'}`}>
                    <div className={`md:hidden font-black text-3xl mb-4 transition-colors duration-500 ${isActive ? 'text-secondary' : 'text-white/40'}`}>{item.year}</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-gray-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

              </div>
            );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
