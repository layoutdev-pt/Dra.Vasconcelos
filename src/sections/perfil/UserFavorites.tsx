import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { supabase } from '../../config/supabase';
import { CourseCard } from '../../components/CourseCard';
import { BookCard3D } from '../../components/BookCard3D';
import { BlogCard } from '../../components/BlogCard';

export const UserFavorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (favorites.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const details: any[] = [];

      // 1. COURSES - Suporte para IDs (UUID) e Títulos (Legacy)
      const courseIds = favorites.filter(f => f.item_type === 'course').map(f => f.item_id);
      if (courseIds.length > 0) {
        try {
          const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
          const uuids = courseIds.filter(isUuid);
          const titles = courseIds.filter(id => !isUuid(id));

          let query = supabase.from('courses').select('*');
          
          if (uuids.length > 0 && titles.length > 0) {
            // Se tiver ambos, usa OR
            query = query.or(`id.in.(${uuids.map(u => `"${u}"`).join(',')}),title.in.(${titles.map(t => `"${t}"`).join(',')})`);
          } else if (uuids.length > 0) {
            query = query.in('id', uuids);
          } else {
            query = query.in('title', titles);
          }

          const { data, error } = await query;
          if (error) throw error;
          if (data) details.push(...data.map(item => ({ ...item, type: 'course' })));
        } catch (err) {
          console.error("Erro ao carregar cursos favoritos:", err);
        }
      }

      // 2. BOOKS
      const bookIds = favorites.filter(f => f.item_type === 'book').map(f => f.item_id);
      if (bookIds.length > 0) {
        try {
          const { data, error } = await supabase.from('books').select('*').in('id', bookIds);
          if (error) throw error;
          if (data) details.push(...data.map(item => ({ ...item, type: 'book' })));
        } catch (err) {
          console.error("Erro ao carregar livros favoritos:", err);
        }
      }

      // 3. BLOGS
      const blogIds = favorites.filter(f => f.item_type === 'blog').map(f => f.item_id);
      if (blogIds.length > 0) {
        try {
          const { data, error } = await supabase.from('posts').select('*').in('id', blogIds);
          if (error) throw error;
          if (data) details.push(...data.map(item => ({ ...item, type: 'blog' })));
        } catch (err) {
          console.error("Erro ao carregar blogs favoritos:", err);
        }
      }

      setItems(details);
      setLoading(false);
    };

    fetchItemDetails();
  }, [favorites]);

  if (favoritesLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
        <p className="text-site-text-muted">A carregar os seus favoritos...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-surface-muted rounded-2xl border border-dashed border-surface-border transition-colors duration-500">
        <Heart className="w-12 h-12 text-site-text-muted/20 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-site-text">Ainda não guardou favoritos</h3>
        <p className="text-site-text-muted mt-2 max-w-sm mx-auto text-sm">
          Os cursos, livros ou artigos que marcar com o coração vão aparecer todos organizados aqui.
        </p>
        <button 
          onClick={() => navigate('/cursos')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
        >
          Explorar Cursos
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {items.map((item) => (
        <motion.div
          key={`${item.type}-${item.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col h-full"
        >
          {item.type === 'course' && (
            <Link to={`/cursos/${item.slug || item.id}`} className="block h-full transition-transform hover:-translate-y-1">
              <CourseCard 
                id={item.id}
                title={item.title}
                description={item.description}
                level={item.level}
                modules={item.modules}
                price={item.price}
                image={item.image_url}
                isPopular={item.is_featured}
              />
            </Link>
          )}
          {item.type === 'book' && (
            <Link to="/livros" className="block h-full">
              <div className="bg-surface rounded-2xl p-6 border border-surface-border h-full flex flex-col items-center transition-transform hover:-translate-y-1">
                  <BookCard3D book={item} index={0} />
              </div>
            </Link>
          )}
          {item.type === 'blog' && (
            <div className="transition-transform hover:-translate-y-1 h-full">
              <BlogCard post={item} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
