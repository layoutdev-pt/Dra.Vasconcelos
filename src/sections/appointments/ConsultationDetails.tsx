import React, { useState } from 'react';
import { Clock, BriefcaseMedical, ClipboardList, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'consulta', label: 'A Consulta' },
  { id: 'para-quem', label: 'Público-Alvo' },
  { id: 'metodologia', label: 'Metodologia' },
  { id: 'prevencao', label: 'Prevenção' }
];

/* Scroll-triggered fade-up */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const ConsultationDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <section className="py-20 bg-site-bg">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col gap-16">
          
          {/* Top Row: Visual Cards */}
          <div className="w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="text-center mb-10"
            >
              <motion.h2 variants={fadeInUp} custom={0} className="text-3xl md:text-4xl font-bold text-site-text mb-4">
                A Nossa Metodologia
              </motion.h2>
              <motion.p variants={fadeInUp} custom={1} className="text-site-text-muted font-light max-w-2xl mx-auto">
                Uma abordagem integrativa onde desenhamos a sua biologia única num plano totalmente personalizado.
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { icon: Clock, iconBg: 'bg-secondary/10', iconColor: 'text-secondary', title: 'Tempo de Qualidade', desc: 'Consultas com duração até 2 horas. Tempo dedicado para ouvir a sua história completa com total dedicação.' },
                { icon: BriefcaseMedical, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', title: 'Medicina Funcional', desc: 'Investigação profunda das raízes dos distúrbios e análise rigorosa de parâmetros e biomarcadores.' },
                { icon: ClipboardList, iconBg: 'bg-green-500/10', iconColor: 'text-green-400', title: 'Plano Personalizado', desc: 'Nutrição, suplementação e estilo de vida desenhados para as suas necessidades biofísicas exclusivas.' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  className="bg-surface p-8 rounded-4xl shadow-sm border border-surface-border flex flex-col items-center text-center group hover:shadow-md transition-shadow"
                >
                  <div className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6`}>
                    <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-xl text-site-text mb-3">{card.title}</h3>
                  <p className="text-site-text-muted font-light leading-relaxed text-sm">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Row: Tab Navigation & Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="w-full max-w-5xl mx-auto flex flex-col"
          >
            
            {/* Tabs Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-surface p-2 rounded-full border border-surface-border shadow-sm mx-auto">
              {TABS.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`px-6 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
                     activeTab === tab.id 
                       ? 'bg-secondary text-white shadow-md' 
                       : 'text-site-text-muted hover:text-site-text hover:bg-surface-muted'
                   }`}
                 >
                   {tab.label}
                 </button>
              ))}
            </div>

            {/* Tab Content Canvas */}
            <div className="bg-surface w-full p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-surface-border min-h-[480px]">
              <AnimatePresence mode="wait">
                
                {/* 1. Consulta */}
                {activeTab === 'consulta' && (
                  <motion.div
                    key="consulta"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-site-text mb-8 text-center">
                      O que deve saber sobre a consulta
                    </h3>
                    <div className="max-w-3xl mx-auto space-y-6 text-site-text-muted font-light leading-relaxed text-lg">
                      <p>
                        A consulta tem uma duração aproximada de <strong>2 horas</strong>, durante as quais serão abordados todos os fatores de risco que possam contribuir para o seu envelhecimento acelerado e para o surgimento de doenças. O principal objetivo é identificar e corrigir as causas que levam a estes distúrbios.
                      </p>
                      <p>
                        Alterações da microbiota intestinal, toxicidade, desequilíbrios emocionais, presença de agentes patogénicos e outras causas estão frequentemente correlacionadas com doenças ou sintomas desagradáveis que afetam o nosso bem-estar.
                      </p>
                      <p>
                        Na consulta, são propostas medidas e estratégias para reverter doenças e promover um envelhecimento saudável. Estas podem incluir alterações no estilo de vida e na alimentação, adaptadas à situação clínica e às necessidades específicas de cada pessoa, bem como a eliminação de fatores tóxicos.
                      </p>
                      <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20 mt-8">
                        <p className="m-0 text-site-text">
                          Também será proposto um conjunto de suplementos específicos para cada pessoa e, se necessário, alguns exames no âmbito do envelhecimento saudável personalizado, como testes genéticos, metabólicos, alimentares, de disbiose, entre outros.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Para Quem */}
                {activeTab === 'para-quem' && (
                  <motion.div
                    key="para-quem"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-site-text mb-8 text-center">
                      Para quem se dirige a consulta?
                    </h3>
                    <div className="max-w-4xl mx-auto">
                      <p className="text-site-text-muted font-light leading-relaxed mb-8 text-center text-lg">A consulta é destinada a todos os que se interessam pela sua saúde, como:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-surface-muted p-6 rounded-3xl border border-surface-border flex flex-col items-center text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mb-4" />
                          <span className="text-site-text font-medium leading-relaxed">Pessoas que estão saudáveis, mas que pretendem prevenir doenças prematuras e aumentar a longevidade.</span>
                        </div>
                        <div className="bg-surface-muted p-6 rounded-3xl border border-surface-border flex flex-col items-center text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mb-4" />
                          <span className="text-site-text font-medium leading-relaxed">Pessoas que já sentem alguns desequilíbrios e incómodos, sejam eles do foro físico ou emocional.</span>
                        </div>
                        <div className="bg-surface-muted p-6 rounded-3xl border border-surface-border flex flex-col items-center text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mb-4" />
                          <span className="text-site-text font-medium leading-relaxed">Pessoas que já estão doentes e precisam de melhorar a sua qualidade de vida e travar a evolução médica da doença.</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-site-text font-bold mb-6 text-lg">Dirige-se transversalmente a pessoas com preocupações específicas de:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {['Envelhecimento saudável', 'Menopausa', 'Equilíbrio intestinal', 'Fadiga crónica', 'Desequilíbrios hormonais', 'Peso e síndrome metabólica', 'Doenças autoimunes', 'Doença oncológica', 'Gravidez e pré/pós-parto'].map((tag) => (
                            <span key={tag} className="px-5 py-2.5 bg-surface border border-surface-border rounded-full text-sm text-site-text font-medium shadow-sm">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. Metodologia */}
                {activeTab === 'metodologia' && (
                  <motion.div
                    key="metodologia"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                      <div>
                        <h4 className="text-2xl font-bold text-site-text mb-6 border-b border-surface-border pb-4 inline-block">Em que consiste:</h4>
                        <ul className="space-y-5 text-site-text-muted font-light">
                          {['Tratamentos de desintoxicação', 'Alimentação personalizada', 'Neutralização de radicais livres', 'Aporte de nutrientes essenciais', 'Técnicas de gestão de stress', 'Reequilíbrio enzimático com minerais e vitaminas', 'Avaliação de metais pesados', 'Avaliação do microbioma intestinal e disfunções gastrointestinais', 'Diagnóstico associado por determinação de respostas obtidas por bioressonância'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0"></div>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-site-text mb-6 border-b border-surface-border pb-4 inline-block">Com determinação de:</h4>
                        <ul className="space-y-5 text-site-text-muted font-light">
                          {['Teste de Parasitas, Protozoários, Fungos, Vírus e Cândidas', 'Teste de sistemas e subsistemas de órgãos', 'Grau de inflamação e degeneração', 'Determinação da toxicidade e bloqueios no mesênquima', 'Teste de priorização', 'Medição de Adaptação e Reservas de Energia', 'Medição de Índice de DNA', 'Medição de cargas psicológicas e psiconeurológicas', 'Medição de deficiências nutricionais'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0"></div>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. Prevenção */}
                {activeTab === 'prevencao' && (
                  <motion.div
                    key="prevencao"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="text-center mb-10">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center rotate-3 mb-6 mx-auto">
                        <BriefcaseMedical className="w-8 h-8 text-blue-400 -rotate-3" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-site-text mb-3">
                        Medicina Preventiva Personalizada
                      </h3>
                      <p className="text-site-text-muted font-light max-w-2xl mx-auto">
                        Através de bioressonância e testes avançados, identificamos desequilíbrios antes que se manifestem em doença.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Avaliação de Metais Pesados', desc: 'Identificação de toxicidade por metais.' },
                        { label: 'Avaliação do Microbioma e Função Gastrointestinal', desc: 'Análise da flora intestinal e desempenho digestivo.' },
                        { label: 'Teste de Agentes Patogénicos', desc: 'Pesquisa de Parasitas, Protozoários, Bactérias, Fungos, Vírus e fatores Genéticos.' },
                        { label: 'Teste de Sistemas Endócrinos e Digestivos', desc: 'Avaliação funcional destas áreas.' },
                        { label: 'Grau de Inflamação e Degeneração', desc: 'Avaliação do estado de sistemas e órgãos.' },
                        { label: 'Toxicidade e Bloqueio no Mesênquima', desc: 'Medição da acumulação de toxinas no tecido conjuntivo.' },
                        { label: 'Teste de Desintoxicação', desc: 'Avaliação da capacidade de eliminação de resíduos.' },
                        { label: 'Oxigenação e Reserva de Energia', desc: 'Análise do metabolismo energético celular.' },
                        { label: 'Índice Biológico', desc: 'Determinação da "Idade do Mesênquima".' },
                        { label: 'Índice de DNA', desc: 'Avaliação da oxidação Biológica e Bioquímica do DNA.' },
                        { label: 'Cargas Geopatogénicas e Eletromagnéticas', desc: 'Impacto ambiental na saúde.' },
                        { label: 'Medição de Stress', desc: 'Inclui stress simpático, eletromagnético, radioativo e por metais pesados.' },
                        { label: 'Deficiências Nutricionais', desc: 'Identificação de carências de vitaminas e minerais.' },
                        { label: 'Testes Genéticos', desc: 'Análise de variações genéticas para medicina preventiva (doenças cardiovasculares, metabólicas, diabetes, neurodegenerativas e cancro).' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 bg-surface-muted rounded-2xl p-4 border border-surface-border">
                          <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-site-text text-sm leading-snug">{item.label}</p>
                            <p className="text-site-text-muted font-light text-sm leading-relaxed mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
