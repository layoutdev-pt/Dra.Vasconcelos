import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import type { MediaEntry } from '../../types/media';
import { ExternalLink, Video, FileText, Mic, Loader2 } from 'lucide-react';

export const MidiaList: React.FC = () => {
  const [media, setMedia] = useState<MediaEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase.from('media').select('*').order('published_at', { ascending: false });
      setMedia(data || []);
      setLoading(false);
    };
    fetchMedia();
  }, []);

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-secondary w-10 h-10" /></div>;

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {media.map(item => (
          <a key={item.id} href={item.external_url} target="_blank" rel="noreferrer" className="group flex flex-col sm:flex-row bg-[#FAFBFF] rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
              <img src={item.image_url || ''} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-8 sm:w-3/5 flex flex-col justify-center">
              <span className="text-secondary font-bold text-[10px] uppercase tracking-widest mb-3">{item.type}</span>
              <h3 className="text-xl font-bold text-primary mb-4 leading-tight group-hover:text-secondary transition-colors">{item.title}</h3>
              <div className="flex items-center gap-2 text-primary font-extrabold text-sm">Ver Conteúdo <ExternalLink size={14} /></div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};