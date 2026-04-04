import React, { useState } from 'react';
import { Activity, Thermometer, FlaskConical, Dna, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const PRONUTRI_STEPS = [
  {
    num: '01',
    label: 'Método',
    desc: 'Bioressonância — tecnologia que mede respostas bioelétricas do organismo a frequências específicas, de forma totalmente não invasiva.',
  },
  {
    num: '02',
    label: 'Procedimento',
    desc: 'Uso de auscultadores para audição de frequência, pulseira de contacto e medição de estímulos no meridiano do pulmão durante a sessão.',
  },
  {
    num: '03',
    label: 'Objetivo',
    desc: 'Medir a resposta do corpo a alimentos e substâncias químicas através de mecanismos não imunológicos — identificando reações tóxicas ou metabólicas com precisão.',
  },
];

const COMPLEMENTARY_EXAMS = [
  {
    icon: Activity,
    title: 'Bioequilíbrio Vitamínico',
    teaser: 'Avaliação de níveis de minerais e vitaminas essenciais.',
    detail:
      'Avaliação detalhada de níveis de minerais e vitaminas essenciais ao equilíbrio celular e ao desempenho do organismo. Identifica carências que podem estar na origem de fadiga, imunidade comprometida ou desequilíbrios metabólicos e hormonais.',
    tags: ['Minerais', 'Vitaminas', 'Metabolismo'],
  },
  {
    icon: Activity,
    title: 'Neutralização de Radicais Livres',
    teaser: 'Avaliação do stress oxidativo e capacidade antioxidante.',
    detail:
      'Teste e avaliação do nível de stress oxidativo e da capacidade antioxidante do organismo. Radicais livres em excesso aceleram o envelhecimento celular, promovem inflamação crónica e aumentam o risco oncológico — a sua quantificação é essencial em medicina preventiva.',
    tags: ['Stress Oxidativo', 'Antioxidantes', 'Envelhecimento'],
  },
  {
    icon: Dna,
    title: 'Exames Genéticos, Bioquímicos e de Disbiose',
    teaser: 'Perfil genético, marcadores bioquímicos e análise da microbiota.',
    detail:
      'Conjunto de exames propostos conforme a situação clínica, incluindo perfis genéticos para medicina preventiva (doenças cardiovasculares, metabólicas, diabetes, neurodegenerativas e cancro), análise da microbiota intestinal e marcadores bioquímicos de função orgânica.',
    tags: ['Genética', 'Bioquímica', 'Microbiota', 'Prevenção'],
  },
];

const THERMOGRAPHY_SYSTEMS = [
  'Respiratório', 'Digestivo', 'Circulatório',
  'Endócrino', 'Ginecológico', 'Neurológico', 'Locomotor',
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export const AdvancedTreatments: React.FC = () => {
  const [openExam, setOpenExam] = useState<number | null>(null);

  const toggle = (i: number) => setOpenExam(prev => (prev === i ? null : i));

  return (
    <section className="py-20 bg-surface-hero">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
            Diagnóstico Avançado
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Testes e Tratamentos Avançados
          </h2>
          <p className="text-gray-500 font-light text-lg leading-relaxed">
            Tecnologia de ponta para um diagnóstico preciso e um plano terapêutico verdadeiramente personalizado.
          </p>
        </div>

        {/* ── Bento Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ── Card 1: Pronutri A — Numbered Steps (A) ─── */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 border border-secondary/15 shadow-sm hover:shadow-[0_8px_32px_0_rgba(124,176,176,0.18)] transition-shadow duration-300 flex flex-col">

            {/* Title row */}
            <div className="flex items-start gap-4 mb-9">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Activity className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                  Bioressonância
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-primary leading-tight">
                  Teste de Intolerâncias{' '}
                  <span className="text-gray-400 font-medium text-lg">(Pronutri A)</span>
                </h3>
              </div>
            </div>

            {/* Numbered step-flow (Idea A) */}
            <div className="flex-1">
              {PRONUTRI_STEPS.map((step, i) => (
                <div key={i} className="flex gap-5">
                  {/* Circle + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center shrink-0">
                      <span className="text-secondary font-bold text-xs tracking-wide">{step.num}</span>
                    </div>
                    {i < PRONUTRI_STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-secondary/30 to-secondary/5 my-2 min-h-[2rem]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-7 ${i === PRONUTRI_STEPS.length - 1 ? 'pb-0' : ''}`}>
                    <p className="font-bold text-primary text-sm mb-1.5">{step.label}</p>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-5 border-t border-secondary/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              <p className="text-xs text-secondary font-semibold uppercase tracking-widest">
                Método não invasivo · Sem extração de sangue
              </p>
            </div>
          </div>

          {/* ── Card 2: Termografia — Photo + Thermal Blob (A+B) ─── */}
          <div className="relative rounded-4xl overflow-hidden group min-h-[460px] flex flex-col">

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/98 via-primary/85 to-primary/60" />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-9 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                    <Thermometer className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">
                      Imagem Infravermelha
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">Termografia</h3>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-300 font-light text-sm leading-relaxed">
                    <strong className="text-white font-semibold">Método:</strong> Câmara termográfica infravermelha de alta resolução — mapeamento térmico corporal por imagem digital.
                  </p>
                  <p className="text-gray-300 font-light text-sm leading-relaxed">
                    <strong className="text-white font-semibold">Objetivo:</strong> Detetar variações de temperatura que revelam patologias antes do aparecimento de sintomas clínicos.
                  </p>
                  <p className="text-gray-300 font-light text-sm leading-relaxed">
                    <strong className="text-white font-semibold">Aplicações:</strong> Diagnóstico precoce de processos degenerativos, inflamatórios e alterações do sistema imunitário nos sistemas:
                  </p>
                </div>

                {/* System tags */}
                <div className="flex flex-wrap gap-2">
                  {THERMOGRAPHY_SYSTEMS.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs text-gray-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                <p className="text-xs text-secondary font-semibold uppercase tracking-widest">
                  Diagnóstico precoce · Sem radiação
                </p>
              </div>
            </div>
          </div>

          {/* ── Card 3: Análises Complementares — Accordion (C) ─── */}
          <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 md:p-10 border border-secondary/15 shadow-sm hover:shadow-[0_8px_32px_0_rgba(124,176,176,0.18)] transition-shadow duration-300">

            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                <FlaskConical className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                  Laboratório
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-primary">Análises Complementares de Consulta</h3>
                <p className="text-gray-500 font-light text-sm mt-1 leading-relaxed">
                  Conjunto de exames propostos em função da situação clínica individual. Expanda cada análise para conhecer os detalhes.
                </p>
              </div>
            </div>

            {/* Accordion cards (C) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COMPLEMENTARY_EXAMS.map((exam, i) => {
                const Icon = exam.icon;
                const isOpen = openExam === i;
                return (
                  <div
                    key={i}
                    className="bg-surface-hero rounded-2xl border border-secondary/10 overflow-hidden transition-shadow duration-200"
                    style={{ boxShadow: isOpen ? '0 4px 20px 0 rgba(124,176,176,0.15)' : undefined }}
                  >
                    {/* Accordion trigger */}
                    <button
                      onClick={() => toggle(i)}
                      className="w-full text-left p-5 flex items-start gap-4 group focus:outline-none"
                    >
                      <div className="w-10 h-10 bg-secondary/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-secondary/25 transition-colors duration-200">
                        <Icon className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-primary text-sm leading-snug mb-1">{exam.title}</h4>
                        <p className="text-gray-500 font-light text-xs leading-relaxed">{exam.teaser}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="shrink-0 mt-1 ml-2"
                      >
                        <ChevronDown className="w-4 h-4 text-secondary" />
                      </motion.div>
                    </button>

                    {/* Accordion expanded content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="detail"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-4 border-t border-secondary/10">
                            <p className="text-gray-600 font-light text-sm leading-relaxed mb-4">
                              {exam.detail}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {exam.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 bg-secondary/10 rounded-full text-xs text-secondary font-semibold"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
