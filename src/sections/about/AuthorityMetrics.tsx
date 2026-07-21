import React, { useState } from "react";
import { Award, X } from "lucide-react";

export const AuthorityMetrics: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-24 bg-site-bg relative overflow-hidden">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 z-10 relative">
          {/* Credentials Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-site-text mb-2">
              Credenciais & Reconhecimento
            </h2>
            <p className="text-site-text-muted">
              Autoridade clínica com validação científica nacional e
              internacional.
            </p>
          </div>

          {/* Grelha alterada para 2 colunas para permitir divisão matemática exata a 50% */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highlight Card - Ocupação Total (100%) */}
            <div className="md:col-span-2 bg-[#F97316] text-white rounded-3xl p-8 lg:p-10 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-64 h-full bg-white/10 -skew-x-12 translate-x-32 group-hover:translate-x-10 transition-transform duration-700" />
              <Award className="w-8 h-8 mb-6 opacity-80" />
              <h3 className="text-3xl font-extrabold mb-4">
                Especialização em Saúde Integrativa e Biológica
              </h3>
              <p className="opacity-90 max-w-md text-lg leading-relaxed">
                Mais de duas décadas de prática clínica na vanguarda da
                neurociência e abordagens integrativas avançadas focado nas
                causas profundas.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 relative z-20 bg-white text-[#F97316] hover:bg-gray-50 px-6 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer"
              >
                Ler Biografia Completa →
              </button>
            </div>

            {/* 30.000+ Card - Ocupação Parcial (50%) */}
            <div className="bg-primary text-white p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
              <h4 className="text-5xl font-black mb-2 text-secondary">
                30.000+
              </h4>
              <p className="text-white/60 font-medium uppercase tracking-widest text-xs">
                Doentes Acompanhados
              </p>
            </div>

            {/* +20 Anos Card - Ocupação Parcial (50%) */}
            <div className="bg-surface border border-surface-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-6">
              <h4 className="text-5xl lg:text-6xl font-black text-primary">
                +20
              </h4>
              <div className="flex flex-col">
                <p className="text-site-text font-bold text-lg mb-1">
                  Anos de Experiência
                </p>
                <p className="text-site-text-muted font-medium uppercase tracking-widest text-xs">
                  Prática Clínica Integrativa (Desde 2003)
                </p>
              </div>
            </div>
          </div>

          {/* Full Professional Experience List */}
          <div className="mt-20 pt-16 border-t border-surface-border">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-extrabold text-site-text">
                Carreira Clínica e Académica
              </h3>
              <p className="text-site-text-muted mt-2">
                Visão geral do trajeto de investigação, formações e filiações.
              </p>
            </div>

            {/* O SEGREDO ESTÁ AQUI: Adicionado "items-start" para evitar que os cartões estiquem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
              {[
                "Membro da SPMI (Sociedade Portuguesa de Medicina Integrativa)",
                "Pós-graduada em Adequação Nutricional e Manutenção da Homeostase — Prevenção e Tratamento de Doenças Relacionadas com a Idade, pela Academia Dr. Lair Ribeiro e pelo Centro Universitário INGA, Brasil.",
                "Especialista em Saúde Natural Integrativa",
                "Farmacêutica, Naturopata e Fitoterapeuta",
                "Master em Saúde Integrativa e Humanista - Instituto Lineo, Madrid e U. Atlântica",
                "Especialização em nutrição e saúde, micronutrição e neuronutrição pelo SIIN – França",
                "Pós-graduada em nutrição oncológica pela Universidade Católica Lisboa",
                "Master em Nutrição Ortomolecular pelo CENAC - Barcelona, Espanha",
                "Especialização em Nutrição Celular Ativa – Madrid INCA",
                "Mestre em Homeopatia Unicista e Homotoxicologia",
                "Prática clínica em Biorressonância e Saúde Integrativa e Biológica",
                "Com prática clínica, diplomada e formadora em Bioressonância e Medicina Bioreguladora.",
                "Membro da ABNPIOM (Asociación Española Prof. en Nutrición y Med. Integrativa)",
                'Autora: "Dairy Products: Impact on Prostate Cancer?" (Frontiers Front. Nutr.)',
              ].map((exp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 bg-surface rounded-xl shadow-sm border border-surface-border hover:border-secondary/60 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md hover:bg-surface-muted transition-all duration-150 group cursor-default"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2 group-hover:scale-150 transition-transform duration-150" />
                  <span className="text-site-text leading-snug group-hover:text-secondary transition-colors duration-150">
                    {exp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Biography Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-3xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-surface-border">
              <h2 className="text-2xl md:text-3xl font-extrabold text-site-text">
                Biografia Completa
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-surface-muted transition-colors text-site-text-muted hover:text-site-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="text-site-text-muted leading-relaxed font-light text-lg space-y-6">
                <p>
                  Alexandra Vasconcelos nasceu em Lisboa, em 1965. Licenciou-se
                  em Ciências Farmacêuticas pela Universidade de Lisboa em 1989
                  e, nos primeiros 15 anos da sua carreira, dedicou-se à gestão
                  e direção técnica da sua própria farmácia comunitária.
                </p>
                <p>
                  O acompanhamento próximo de doentes com patologias crónicas
                  despertou nela a necessidade de explorar novas abordagens na
                  promoção da saúde. Foi esta inquietação que a levou a
                  especializar-se em terapias complementares, naturais e
                  biológicas.
                </p>
                <p>
                  Atualmente, é mestre em Saúde Integrativa e Humanista e tem
                  pós-graduações em Nutrição Oncológica, pela Universidade
                  Católica de Lisboa, e em Adequação Nutricional e Homeostase,
                  focada na prevenção e no tratamento de doenças associadas ao
                  envelhecimento, pela Academia Dr. Lair Ribeiro e pelo Centro
                  Universitário INGA, no Brasil.
                </p>
                <p>
                  É autora de vários livros e programas dedicados à saúde e ao
                  envelhecimento saudável, nomeadamente "O Poder do Jejum
                  Intermitente", "As Receitas - O Poder do Jejum Intermitente",
                  "Energiza-te", "As Bactérias Que Nos Curam", "O Segredo para
                  se Manter Jovem e Saudável" e "Jovem e Saudável em 21 Dias",
                  através dos quais tem ajudado milhares de pessoas a recuperar
                  energia, equilíbrio e bem-estar.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 bg-surface-muted border-t border-surface-border text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};