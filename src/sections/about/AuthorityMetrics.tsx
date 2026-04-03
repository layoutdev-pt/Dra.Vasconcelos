import React from 'react';
import draImg from '../../assets/images/dra_hero.png';
import { GraduationCap, Award, FileText, Globe } from 'lucide-react';

export const AuthorityMetrics: React.FC = () => {
  return (
    <section className="py-24 bg-background-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 z-10 relative">
        
        {/* Quote Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-primary text-white rounded-3xl p-10 lg:p-14 mb-20 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl mix-blend-screen" />
          
          <div className="flex items-center gap-6 mb-8 md:mb-0 z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/50 shrink-0">
              <img src={draImg} alt="Dra. Alexandra" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-light italic leading-snug">
                "A saúde não é apenas a ausência de doença, mas o <span className="font-semibold text-secondary">equilíbrio pleno</span> entre o corpo, a mente e o espírito."
              </p>
              <p className="text-secondary/80 text-sm mt-4 tracking-widest uppercase font-bold">
                Princípio Vital
              </p>
            </div>
          </div>
        </div>

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
            <button className="mt-8 bg-white text-[#F97316] hover:bg-gray-50 px-6 py-2.5 rounded-full font-bold text-sm transition-colors">
              Ler Biografia Completa →
            </button>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <GraduationCap className="w-8 h-8 text-secondary mb-4" />
            <h4 className="text-xl font-bold text-primary mb-2">Mestrado Internacional</h4>
            <p className="text-gray-500 text-sm">Universidade de Coimbra, Portugal e Formação Avançada na Suíça.</p>
          </div>

          <div className="bg-primary text-white p-8 rounded-3xl shadow-lg">
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
  );
};
