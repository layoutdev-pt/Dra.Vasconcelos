import React, { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "A saúde não é apenas a ausência de doença, mas o equilíbrio pleno entre o corpo, a mente e o espírito. O método da Dra. Alexandra transformou completamente a minha vitalidade diária.",
    name: "Ana Silva",
    role: "Paciente - Programa BioReset 21",
    avatar: "https://i.pravatar.cc/150?u=person1"
  },
  {
    id: 2,
    text: "Encontrar a causa verdadeira dos meus sintomas autoimunes foi um divisor de águas. Hoje sinto-me com a mesma energia de quando tinha 20 anos, tudo graças à abordagem integrativa.",
    name: "Carlos Mendes",
    role: "Aluno de Biorressonância",
    avatar: "https://i.pravatar.cc/150?u=person2"
  },
  {
    id: 3,
    text: "Os cursos não ensinam apenas teoria, dão-nos ferramentas práticas formidáveis para a nossa saúde. É empoderamento total na longevidade e nutrição funcional.",
    name: "Marta Rocha",
    role: "Paciente & Aluna",
    avatar: "https://i.pravatar.cc/150?u=person3"
  }
];

export const TestimonialsSlider: React.FC = () => {
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(1000);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize listener para calcular TranslateZ do cubo dinamicamente
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => s + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => setStep((s) => s - 1);
  const handleNext = () => setStep((s) => s + 1);

  // Calcula o índice atual a ser mostrado nos pontos de navegação
  const currentIndex = ((step % testimonials.length) + testimonials.length) % testimonials.length;

  const handleDotClick = (idx: number) => {
    setStep((s) => s + (idx - currentIndex));
  };

  return (
    <section className="py-24 bg-site-bg text-site-text relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-site-text mb-2">
            Descobre o que os alunos dizem sobre mim
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full mt-6" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          
          {/* 3D Cube Container */}
          <div 
            ref={containerRef} 
            className="w-full relative h-[480px] md:h-[350px]" 
            style={{ perspective: '2000px' }}
          >
            <div 
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateZ(${-width / 2}px) rotateY(${step * -90}deg)`
              }}
            >
              {[0, 1, 2, 3].map((f) => {
                // Matemática para saber que testemunho injetar nesta face (0, 1, 2 ou 3)
                let diff = (f - (step % 4) + 4) % 4;
                if (diff === 3) diff = -1; // -1 significa a face esquerda, que rodamos há instantes
                
                const faceStep = step + diff;
                const tIdx = ((faceStep % testimonials.length) + testimonials.length) % testimonials.length;
                const testimonial = testimonials[tIdx];

                const rotateStyles = [
                  `rotateY(0deg)`,
                  `rotateY(90deg)`,
                  `rotateY(180deg)`,
                  `rotateY(-90deg)`
                ];

                return (
                  <div 
                    key={f}
                    className="absolute top-0 left-0 w-full h-full bg-surface border border-surface-border rounded-3xl shadow-2xl p-8 md:p-14 flex items-center justify-center flex-col"
                    style={{ 
                      transform: `${rotateStyles[f]} translateZ(${width / 2}px)`,
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <Quote className="absolute top-8 left-8 w-24 h-24 text-secondary/5" />
                    
                    <div className="relative z-10 w-full flex flex-col justify-between h-full">
                      <p className="text-lg md:text-3xl font-light italic leading-relaxed text-site-text-muted mt-4 text-center grow flex items-center justify-center">
                        "{testimonial.text}"
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 mt-6 shrink-0">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary/50 shrink-0">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-site-text text-lg leading-snug">
                            {testimonial.name}
                          </h4>
                          <p className="text-secondary tracking-widest uppercase text-xs font-semibold">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-full bg-surface-muted hover:bg-surface border border-surface-border text-site-text-muted hover:text-site-text transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
              aria-label="Testemunho anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-secondary w-6' : 'bg-site-text-muted/30 hover:bg-site-text-muted/50'
                  }`}
                  aria-label={`Ir para testemunho ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="p-3 rounded-full bg-surface-muted hover:bg-surface border border-surface-border text-site-text-muted hover:text-site-text transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
              aria-label="Próximo testemunho"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
