import React from "react";
import { Button } from "../../components/Button";
import { CheckCircle2, Heart, Leaf } from "lucide-react";
import draHero from "../../assets/images/dra_hero.png";
import { OptimizedImage } from "../../components/OptimizedImage";

export const Hero: React.FC = () => {
  return (
    /* bg-hero-bg muda automaticamente via CSS */
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-hero-bg transition-colors duration-500">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8 relative z-10 lg:pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Bem-vindo à Clínica
            </div>

            {/* NOVA HEADLINE FIXA - QUEBRAS CONTROLADAS */}
            <h1 className="text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold text-site-text leading-[1.1] tracking-tight mb-4">
              Descubra como melhorar <br className="hidden xl:block" />
              a sua <span className="text-secondary">saúde e vitalidade</span> <br className="hidden lg:block" />
              com uma abordagem integrativa
            </h1>

            <p className="text-lg text-site-text-muted max-w-lg leading-relaxed font-light">
              Todas as vezes que vai ao médico acredita que está a cuidar da sua
              saúde. Mas tratar sintomas não é o mesmo que tratar a causa. A
              Saúde Integrativa e Biológica procura compreender a origem da doença e
              restaurar a saúde a partir da biologia celular.
            </p>

            <div className="pt-2">
              <Button
                to="/consultas"
                variant="primary"
                className="shadow-lg shadow-accent/30 w-full max-w-md py-3 md:py-4 px-12 rounded-full font-bold"
              >
                AGENDE JÁ A SUA CONSULTA
              </Button>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-4 md:gap-8 text-sm text-site-text-muted font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /> Saúde Integrativa e Biológica 
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /> Abordagem Individual 
              </div>
            </div>
          </div>

          {/* Imagem e Painéis flutuantes */}
          <div className="relative w-full h-[550px] lg:h-[700px] flex items-center justify-center mt-12 lg:mt-0">
            <div className="relative w-full max-w-md lg:max-w-[500px] h-full flex items-end">
              <div
                className="relative z-10 w-full h-full rounded-2xl overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 85%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 85%, transparent 100%)",
                }}
              >
                <OptimizedImage
                  src={draHero}
                  alt="Dra. Alexandra"
                  className="w-full h-full object-cover object-top transform scale-105"
                />
              </div>

              {/* Painel: Abordagem Personalizada */}
              <div className="absolute top-48 md:top-12 -left-4 md:-left-8 z-20 glass-panel-brand p-4 rounded-2xl text-white w-48 animate-float-gentle">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 fill-white shrink-0" />
                  <span className="text-sm font-bold leading-snug">
                    Abordagem personalizada e integrativa
                  </span>
                </div>
              </div>

              {/* Painel: Estratégias Naturais */}
              <div className="absolute top-72 md:top-32 -right-4 md:-right-8 z-20 glass-panel p-4 rounded-2xl shadow-glass flex items-center gap-3 w-56">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                  <Leaf className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-sm font-bold text-site-text leading-snug">
                  Estratégias naturais e baseadas no estilo de vida
                </span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};