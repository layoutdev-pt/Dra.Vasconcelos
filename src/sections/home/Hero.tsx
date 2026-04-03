import React from 'react';
import { Button } from '../../components/Button';
import { PlayCircle, CheckCircle2, Heart, Leaf, Star, Plus } from 'lucide-react';
import draHero from '../../assets/images/dra_hero.png';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-surface-hero">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="space-y-8 relative z-10 lg:pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Bem-vindo à Clínica
            </div>
            
            <h1 className="text-5xl lg:text-[4rem] font-extrabold text-primary leading-[1.05] tracking-tight">
              Mantenha-se <span className="text-secondary block mt-2">jovem e saudável</span>
            </h1>
            
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-light">
              Todas as vezes que vamos ao médico acreditamos tratar da nossa saúde, mas atuamos apenas no tratamento da doença. A biologia e medicina integrativa atuam em busca da sua causa na biologia celular — onde as doenças têm a sua génese.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button variant="primary" className="shadow-lg shadow-accent/30">
                AGENDE JÁ A SUA CONSULTA
              </Button>
              <Button variant="outline" className="bg-white hover:bg-gray-50 border-transparent shadow-sm hover:shadow text-primary flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                Ver Metodologia
              </Button>
            </div>

            <div className="pt-6 flex items-center gap-8 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                Medicina Integrativa
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                Abordagem Causal
              </div>
            </div>
          </div>

          <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
            
            <div className="relative w-full max-w-sm h-full flex items-end">
              <div className="relative z-10 w-full h-[90%] bg-gray-200 rounded-2xl overflow-hidden shadow-xl" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                <img 
                  src={draHero} 
                  alt="Dra. Alexandra" 
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="absolute top-12 -left-16 lg:-left-24 z-20 glass-panel-brand p-5 rounded-2xl text-white w-44 animate-float-gentle">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-white/20 rounded-full">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Health Score</span>
                </div>
                <div className="text-4xl font-extrabold tracking-tight">98%</div>
                <div className="text-[11px] opacity-80 mt-1 font-medium">Taxa de Sucesso</div>
              </div>

              <div className="absolute top-32 -right-8 lg:-right-16 z-20 glass-panel p-3 rounded-2xl shadow-glass flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <Leaf className="w-5 h-5 text-secondary" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Abordagem</p>
                  <p className="text-sm font-bold text-primary">100% Natural</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};