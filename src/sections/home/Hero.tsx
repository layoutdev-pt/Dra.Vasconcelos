import React from 'react';
import { Button } from '../../components/Button';
import { PlayCircle, CheckCircle2, Heart, Leaf, Star, Plus } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    // Alterado para a cor de fundo específica registada no theme
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-surface-hero">
      
      {/* Removidos os gradientes abstratos (shapes) para garantir que 
         o fundo cinza #eceef9 seja a cor dominante e limpa da secção.
      */}
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Coluna Esquerda: Conteúdo */}
          <div className="space-y-8 relative z-10 lg:pr-10">
            {/* Pill de Aceitação */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-600 text-xs font-semibold uppercase tracking-wide border border-blue-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Accepting New Patients for 2024
            </div>
            
            {/* Título Principal */}
            <h1 className="text-5xl lg:text-[4rem] font-extrabold text-primary leading-[1.05] tracking-tight">
              Integrative Medicine for a <span className="text-secondary block mt-2">Whole Life.</span>
            </h1>
            
            {/* Parágrafo */}
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-light">
              Reclaim your vitality through a harmonious blend of modern science and holistic wisdom. Personalized care designed for your unique biology.
            </p>
            
            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button variant="primary" className="shadow-lg shadow-accent/30">
                Schedule Consultation
              </Button>
              <Button variant="outline" className="bg-white hover:bg-gray-50 border-transparent shadow-sm hover:shadow text-primary flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                Watch Methodology
              </Button>
            </div>

            {/* Checkmarks Inferiores */}
            <div className="pt-6 flex items-center gap-8 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Certified Specialist
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Telemedicine Ready
              </div>
            </div>
          </div>

          {/* Coluna Direita: Composição Visual com Mockups ancorados à imagem */}
          <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
            
            {/* Contentor da Imagem Principal */}
            <div className="relative w-full max-w-sm h-full flex items-end">
              {/* Imagem do Médico (Placeholder mantido) */}
              <div className="relative z-10 w-full h-[90%] bg-gray-200 rounded-2xl overflow-hidden shadow-xl" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAft1DblIOXCDT5YXSA8rN8gi6sEBtsBH75QeiTRVlZE1YCVGuj-D97P4Ky4HyNzA5VZc3-FtttMW18fHHOfOv_hL-M7AIkZMV7hi-9e88A_i_s-oAboGORtiYV_GcauMbkKMfACIut4jlyhZ6e-73F1oTtewWsNaGYHxkZejCqmR0HlG0KQsMWy6kdzL3i-9xOiNTLo2XDeMpp8Njb4lmmK2qVu_qFIoa0hBgOYiC9cyfFt5lztssq0nmohj5GJthTFIa8dpmEmB6y" 
                  alt="Dra. Alexandra" 
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Cartão 1: Health Score (Topo Esquerda) */}
              {/* TROCADO: animate-[bounce...] por animate-float-gentle */}
              <div className="absolute top-12 -left-16 lg:-left-24 z-20 glass-panel-blue p-5 rounded-2xl text-white w-44 animate-float-gentle">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-white/20 rounded-full">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Health Score</span>
                </div>
                <div className="text-4xl font-extrabold tracking-tight">98%</div>
                <div className="text-[11px] opacity-80 mt-1 font-medium">Patient Recovery Rate</div>
              </div>

              {/* Cartão 2: Approach (Topo Direita) */}
              <div className="absolute top-32 -right-8 lg:-right-16 z-20 glass-panel p-3 rounded-2xl shadow-glass flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                  <Leaf className="w-5 h-5 text-green-500" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Approach</p>
                  <p className="text-sm font-bold text-primary">100% Natural</p>
                </div>
              </div>

              {/* Cartão 3: Dock Inferior (Fundo) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[115%] z-30 bg-white p-6 rounded-[2rem] shadow-float flex items-center justify-between border border-gray-100">
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5">
                    <span className="text-2xl font-black text-primary tracking-tight">12K</span>
                    <Plus className="w-5 h-5 text-accent" strokeWidth={3} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium mt-0.5">Sorrisos Restaurados</span>
                </div>
                
                <div className="h-10 w-px bg-gray-100 mx-4"></div>
                
                <div className="flex flex-col items-end">
                  <div className="flex gap-0.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-sm"></div> {/* Placeholder para logo Google */}
                    <span className="text-xs font-bold text-primary">4.9/5 Reviews</span>
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