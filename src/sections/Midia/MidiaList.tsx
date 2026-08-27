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
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchMedia = async () => {
      setLoading(true);
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from('media')
        .select('id, title, type, external_url, image_url, published_at, position, created_at', { count: 'estimated' })
        .order('position', { ascending: true })
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (isMounted) {
        if (!error) {
          setMedia(data || []);
          if (count !== null) setTotalCount(count);
        }
        setLoading(false);
      }
    };
    fetchMedia();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  if (loading && media.length === 0) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-secondary w-10 h-10" /></div>;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const visibleMedia = media;

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