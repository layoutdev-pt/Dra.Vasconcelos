import React from 'react';
import { Mail, Send } from 'lucide-react';

export const BlogNewsletter: React.FC = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 lg:p-16 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-secondary mb-4">
              <Mail className="w-6 h-6" />
              <span className="font-bold tracking-widest uppercase text-sm">Newsletter</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Receba conteúdos de saúde diretamente no seu e-mail.
            </h2>
            <p className="text-blue-100/60 text-lg font-light">
              Assine para não perder os novos artigos sobre longevidade e medicina integrativa.
            </p>
          </div>

          <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="px-8 py-5 rounded-2xl bg-white text-primary outline-none min-w-[300px] focus:ring-2 focus:ring-secondary transition-all"
            />
            <button className="bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-5 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg shadow-black/20">
              Subscrever <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};