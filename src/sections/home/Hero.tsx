import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { CheckCircle2, Heart, Leaf } from 'lucide-react';
import draHero from '../../assets/images/dra_hero.png';

const HERO_PHRASES = ["jovem e saudável", "com mais vitalidade", "em equilíbrio pleno"];

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(1);
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      if (progress < duration) {
        setCount(Math.floor((progress / duration) * end) || 1);
        animationFrame = requestAnimationFrame(animateCount);
      } else { setCount(end); }
    };
    animationFrame = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
};

export const Hero: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [animatePhrase, setAnimatePhrase] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatePhrase(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
        setAnimatePhrase(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const successRate = useCountUp(98, 1500);
  const naturalRate = useCountUp(100, 1500);

  return (
    /* bg-hero-bg muda automaticamente via CSS */
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-hero-bg transition-colors duration-500">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="space-y-8 relative z-10 lg:pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Bem-vindo à Clínica
            </div>
            
            <h1 className="text-4xl md:text-5xl xl:text-[4rem] font-extrabold text-site-text leading-[1.05] tracking-tight min-h-[140px] md:min-h-[160px] xl:min-h-[200px]">
              Mantenha-se 
              <span className={`text-secondary block mt-2 transition-all duration-500 transform ${animatePhrase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {HERO_PHRASES[phraseIndex]}
              </span>
            </h1>
            
            <p className="text-lg text-site-text-muted max-w-lg leading-relaxed font-light mt-[-20px] md:mt-[-40px]">
              Todas as vezes que vamos ao médico acreditamos tratar da nossa saúde, mas atuamos apenas no tratamento da doença. A biologia e medicina integrativa atuam em busca da sua causa na biologia celular.
            </p>
            
            <div className="pt-2">
              <Button to="/consultas" variant="primary" className="shadow-lg shadow-accent/30 w-full max-w-md py-3 md:py-4 px-12 rounded-full font-bold">
                AGENDE JÁ A SUA CONSULTA
              </Button>
            </div>

            <div className="pt-6 flex items-center gap-8 text-sm text-site-text-muted font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-secondary" /> Medicina Integrativa</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-secondary" /> Abordagem Causal</div>
            </div>
          </div>

          {/* Imagem e Painéis flutuantes */}
          <div className="relative w-full h-[550px] lg:h-[700px] flex items-center justify-center mt-12 lg:mt-0">
            <div className="relative w-full max-w-md lg:max-w-[500px] h-full flex items-end">
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                <img src={draHero} alt="Dra. Alexandra" className="w-full h-full object-cover object-top transform scale-105" />
              </div>

              {/* Health Score Panel */}
              <div className="absolute top-48 md:top-12 -left-4 md:-left-8 z-20 glass-panel-brand p-5 rounded-2xl text-white w-44 animate-float-gentle">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 fill-white" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Health Score</span>
                </div>
                <div className="text-4xl font-extrabold tracking-tight">{successRate}%</div>
                <div className="text-[11px] opacity-80 mt-1 font-medium">Taxa de Sucesso</div>
              </div>

              {/* Natural Panel usando glass-panel utilitário do index.css */}
              <div className="absolute top-72 md:top-32 -right-4 md:-right-8 z-20 glass-panel p-3 rounded-2xl shadow-glass flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <Leaf className="w-5 h-5 text-secondary" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] text-site-text-muted font-semibold uppercase tracking-wider">Abordagem</p>
                  <p className="text-sm font-bold text-site-text">{naturalRate}% Natural</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};