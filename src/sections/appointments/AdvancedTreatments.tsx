import React, { useState } from 'react';
import { Activity, Thermometer, FlaskConical, Dna, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const PRONUTRI_STEPS = [
  {
    num: '01',
    label: 'Método',
    desc: 'Bioressonância — tecnologia que mede respostas bioelétricas do organismo a frequências específicas, de forma não invasiva.',
  },
  {
    num: '02',
    label: 'Procedimento',
    desc: 'Uso de auscultadores para audição de frequência, pulseira de contacto e medição de estímulos no meridiano do pulmão.',
  },
  {
    num: '03',
    label: 'Objetivo',
    desc: 'Medir a resposta do corpo a alimentos e substâncias químicas, identificando reações tóxicas ou metabólicas com precisão.',
  },
];

const COMPLEMENTARY_EXAMS = [
  {
    icon: Activity,
    title: 'Bioequilíbrio Vitamínico',
    detail: 'Avaliação detalhada de níveis de minerais e vitaminas essenciais. Identifica carências na origem de fadiga e imunidade comprometida.',
    tags: ['Minerais', 'Vitaminas', 'Metabolismo'],
  },
  {
    icon: Activity,
    title: 'Stress Oxidativo',
    detail: 'Avaliação da capacidade antioxidante do organismo. Radicais livres em excesso aceleram o envelhecimento e promovem inflamação.',
    tags: ['Oxidação', 'Antioxidantes', 'Anti-aging'],
  },
  {
    icon: Dna,
    title: 'Exames Genéticos e Disbiose',
    detail: 'Perfis genéticos para medicina preventiva, análise da microbiota intestinal e marcadores bioquímicos de função orgânica.',
    tags: ['Genética', 'Microbiota', 'Prevenção'],
  },
];

const THERMOGRAPHY_SYSTEMS = [
  'Respiratório', 'Digestivo', 'Circulatório',
  'Endócrino', 'Ginecológico', 'Neurológico', 'Locomotor',
];

const TABS = [
  { id: 'pronutri', label: 'Bioressonância', icon: Activity },
  { id: 'thermography', label: 'Termografia', icon: Thermometer },
  { id: 'lab', label: 'Laboratório', icon: FlaskConical },
];

/* ─── Animation variants ──────────────────────────────────────────────── */

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const tabContentAnimation: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

/* ─── Component ─────────────────────────────────────────────────────────── */

export const AdvancedTreatments: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <section className="py-24 bg-surface-hero relative overflow-hidden">
      {/* Decorações de Fundo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span variants={fadeInUp} custom={0} className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
            Diagnóstico Avançado
          </motion.span>
          <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Tecnologia de Ponta para<br />
            <span className="text-secondary font-serif font-medium italic">Medicina de Precisão</span>
          </motion.h2>
          <motion.p variants={fadeInUp} custom={2} className="text-gray-500 font-light text-lg md:text-xl leading-relaxed">
            Exploramos além dos sintomas através de diagnósticos detalhados, desenhando um plano terapêutico verdadeiramente personalizado.
          </motion.p>
        </motion.div>

        {/* ── Tabs Navigation ─────────────────────────────────────────── */}
        <div className="flex justify-center mb-10 w-full overflow-x-auto pb-4 hide-scrollbar">
          <div className="inline-flex bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-secondary/15 shadow-[0_4px_20px_-5px_rgba(124,176,176,0.15)] flex-nowrap min-w-max">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-secondary hover:bg-secondary/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-primary rounded-full shadow-md"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-gray-400'}`} />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content Area ────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] border border-secondary/15 shadow-[0_12px_40px_-10px_rgba(124,176,176,0.2)] overflow-hidden min-h-[480px]">
          <AnimatePresence mode="wait">

            {/* TAB: Pronutri */}
            {activeTab === 'pronutri' && (
              <motion.div
                key="pronutri"
                variants={tabContentAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-2 p-8 md:p-14 gap-12 items-center h-full"
              >
                <div className="flex flex-col h-full justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest w-fit mb-4">
                    Bioressonância
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                    Teste de Intolerâncias <br />
                    <span className="text-gray-400 font-medium text-2xl">(Pronutri A)</span>
                  </h3>
                  <p className="text-gray-500 font-light text-lg leading-relaxed mb-8">
                    Identificamos as respostas bioelétricas do seu organismo a várias frequências de forma 100% não invasiva, sem necessidade de extração de sangue.
                  </p>
                  <div className="flex items-center gap-3 py-3 px-5 bg-secondary/5 rounded-2xl border border-secondary/10 w-fit">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    <p className="text-sm text-primary font-semibold">Tecnologia indolor de alta precisão</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {PRONUTRI_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-5 bg-surface-hero p-5 rounded-2xl border border-secondary/5 hover:border-secondary/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-secondary/10 flex items-center justify-center shrink-0">
                        <span className="text-secondary font-bold text-sm">{step.num}</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary text-base mb-1">{step.label}</p>
                        <p className="text-gray-500 font-light text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: Termografia */}
            {activeTab === 'thermography' && (
              <motion.div
                key="thermography"
                variants={tabContentAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-2 p-8 md:p-14 gap-12 items-center h-full"
              >
                <div className="flex flex-col h-full justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest w-fit mb-4">
                    Imagem Infravermelha
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                    Termografia Clínica
                  </h3>
                  <p className="text-gray-500 font-light text-lg leading-relaxed mb-6">
                    Mapeamento térmico corporal por câmara digital infravermelha de alta resolução que deteta variações de temperatura microscópicas.
                  </p>
                  <p className="text-gray-500 font-light text-lg leading-relaxed mb-8">
                    Permite o diagnóstico precoce de patologias, processos degenerativos e inflamatórios, muitas vezes meses ou anos antes do aparecimento de sintomas físicos.
                  </p>
                  <div className="flex items-center gap-3 py-3 px-5 bg-secondary/5 rounded-2xl border border-secondary/10 w-fit">
                    <Thermometer className="w-5 h-5 text-secondary shrink-0" />
                    <p className="text-sm text-primary font-semibold">100% isento de radiação nociva</p>
                  </div>
                </div>

                <div className="bg-surface-hero rounded-4xl p-8 border border-secondary/10 h-full flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-2xl rounded-full" />
                  <h4 className="font-bold text-primary text-lg mb-6 relative z-10 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-secondary" /> Monitorização de Sistemas
                  </h4>
                  <div className="flex flex-wrap gap-2.5 relative z-10">
                    {THERMOGRAPHY_SYSTEMS.map(tag => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-white border border-secondary/15 rounded-xl text-sm text-gray-600 font-medium shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-8 relative z-10 text-center uppercase tracking-widest font-semibold">
                    Visão global e preventiva do corpo
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB: Laboratório */}
            {activeTab === 'lab' && (
              <motion.div
                key="lab"
                variants={tabContentAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 lg:grid-cols-5 p-8 md:p-14 gap-12 items-center h-full"
              >
                <div className="lg:col-span-2 flex flex-col h-full justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#1e4b85]/10 text-[#1e4b85] text-xs font-bold uppercase tracking-widest w-fit mb-4">
                    Laboratório
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                    Análises Complementares
                  </h3>
                  <p className="text-gray-500 font-light text-lg leading-relaxed mb-6">
                    Um painel clínico robusto desenhado de forma individual. Cada exame tem o objetivo claro de desvendar a raiz metabólica das patologias.
                  </p>
                  <div className="flex items-center gap-3 py-3 px-5 bg-[#1e4b85]/5 rounded-2xl border border-[#1e4b85]/10 w-fit">
                    <FlaskConical className="w-5 h-5 text-[#1e4b85] shrink-0" />
                    <p className="text-sm text-primary font-semibold">Análise Celular Alvo</p>
                  </div>
                </div>

                <div className="lg:col-span-3 flex flex-col gap-4">
                  {COMPLEMENTARY_EXAMS.map((exam, i) => {
                    const Icon = exam.icon;
                    return (
                      <div key={i} className="bg-surface-hero p-5 rounded-2xl border border-secondary/5 hover:border-secondary/20 transition-colors">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-secondary/10">
                            <Icon className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-primary text-base mb-1.5">{exam.title}</h4>
                            <p className="text-gray-500 font-light text-sm leading-relaxed mb-3">{exam.detail}</p>
                            <div className="flex flex-wrap gap-2">
                              {exam.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-white border border-secondary/10 rounded-lg text-xs text-secondary font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
