import React from 'react';
import { Calendar, ArrowRight, Video, FileText, Mic } from 'lucide-react';
import type { MediaEntry } from '../types/media';

export const MidiaCard: React.FC<{ item: MediaEntry }> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'video': return <Video size={14} />;
      case 'artigo': return <FileText size={14} />;
      case 'podcast': return <Mic size={14} />;
      default: return null;
    }
  };

  const typeLabels: Record<string, string> = {
    video: 'Vídeo',
    artigo: 'Artigo Externo',
    podcast: 'Podcast',
  };

  return (
    <a 
      href={item.external_url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex flex-col group h-full bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 text-left"
    >
      {/* Imagem de Capa */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img 
          src={item.image_url || ''} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1.5">
            {getIcon()}
            {typeLabels[item.type] || item.type}
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-gray-400 text-xs mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-secondary" />
            {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Recente'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-primary mb-6 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-primary font-bold text-sm mt-auto">
          Ver Conteúdo 
          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-secondary" />
        </div>
      </div>
    </a>
  );
};
