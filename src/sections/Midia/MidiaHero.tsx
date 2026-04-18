import React from 'react';
import { PlayCircle } from 'lucide-react';

export const MidiaHero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 bg-[#FAFBFF] border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
            <PlayCircle size={32} />
          </div>
        </div>
        <span className="text-secondary font-bold tracking-widest uppercase text-xs">
          Presença na Comunicação
        </span>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-primary mt-4">
          Dra. Alexandra <span className="text-secondary">na Mídia</span>
        </h1>
        <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg font-light">
          Acompanhe entrevistas, participações em programas de televisão e artigos publicados em canais externos.
        </p>
      </div>
    </section>
  );
};