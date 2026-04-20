import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import type { MediaEntry } from '../../types/media';
import { Loader2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination';
import { MidiaCard } from '../../components/MidiaCard';

const ITEMS_PER_PAGE = 6;

export const MidiaList: React.FC = () => {
  const [media, setMedia] = useState<MediaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase.from('media').select('*').order('published_at', { ascending: false });
      setMedia(data || []);
      setLoading(false);
    };
    fetchMedia();
  }, []);

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-secondary w-10 h-10" /></div>;

  const totalPages = Math.ceil(media.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleMedia = media.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {visibleMedia.map(item => (
          <MidiaCard key={item.id} item={item} />
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};