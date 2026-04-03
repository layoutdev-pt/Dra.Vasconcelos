import React, { useState } from 'react';
import { GraduationCap, Award, Globe, X } from 'lucide-react';

export const AuthorityMetrics: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-24 bg-background-light relative overflow-hidden">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12 z-10 relative">
          
          {/* Credentials Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Credenciais & Reconhecimento</h2>
            <p className="text-gray-500">Autoridade clínica com validação científica nacional e internacional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Highlight Card */}
            <div className="lg:col-span-2 bg-[#F97316] text-white rounded-3xl p-8 lg:p-10 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-64 h-full bg-white/10 -skew-x-12 translate-x-32 group-hover:translate-x-10 transition-transform duration-700" />
              <Award className="w-8 h-8 mb-6 opacity-80" />
              <h3 className="text-3xl font-extrabold mb-4">Especialização em Medicina Integrativa</h3>
              <p className="opacity-90 max-w-md text-lg leading-relaxed">
                Mais de uma década de prática clínica na vanguarda da neurociência e abordagens integrativas avançadas focado nas causas profundas.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-8 relative z-20 bg-white text-[#F97316] hover:bg-gray-50 px-6 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer"
              >
                Ler Biografia Completa →
              </button>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <GraduationCap className="w-8 h-8 text-secondary mb-4" />
              <h4 className="text-xl font-bold text-primary mb-2">Mestrado Internacional</h4>
              <p className="text-gray-500 text-sm">Universidade de Coimbra, Portugal e Formação Avançada na Suíça.</p>
            </div>

            <div className="bg-primary text-white p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
              <h4 className="text-5xl font-black mb-2 text-secondary">15.000+</h4>
              <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Doentes Acompanhados</p>
            </div>

          </div>

          {/* Full Professional Experience List */}
          <div className="mt-20 pt-16 border-t border-gray-200">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-extrabold text-primary">Carreira Clínica e Académica</h3>
              <p className="text-gray-500 mt-2">Visão geral do trajeto de investigação, formações e filiações.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {[
                "Especialista em Medicina Natural Integrativa",
                "Farmacêutica, Naturopata e Fitoterapeuta",
                "Master em Medicina Integrativa e Humanista - Instituto Lineo, Madrid e U. Atlântica",
                "Pós-graduada em nutrição oncológica pela Universidade Católica Lisboa",
                "Master em Nutrição Ortomolecular pelo IONAC - Barcelona, Espanha",
                "Especialização em nutrição e saúde, micronutrição e neuronutrição pelo SIIN – França",
                "Especialização em Nutrição Celular Ativa – Madrid INCA",
                "Master em Homeopatia Unicista e Homotoxicologia",
                "Prática clínica em Biorressonância e medicina bioreguladora",
                "Membro da ABNPIOM (Asociación Española Prof. en Nutrición y Med. Integrativa)",
                "Membro da APMI (Associação Portuguesa de Medicina Integrativa)",
                "Autora: \"Dairy Products: Impact on Prostate Cancer?\" (Frontiers Front. Nutr.)"
              ].map((exp, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-secondary/40 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2" />
                  <span className="text-gray-700 leading-snug">{exp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Biography Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary">
                Biografia Completa
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <p className="text-gray-600 leading-relaxed font-light text-lg space-y-6">
                <span className="block italic text-gray-400 mb-6">
                  [ O conteúdo final da biografia detalhada será inserido neste espaço... ]
                </span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                <br/><br/>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 text-right">
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
