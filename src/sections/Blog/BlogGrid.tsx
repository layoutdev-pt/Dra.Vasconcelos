import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import type { BlogPost } from '../../types/blog';
import { BlogCard } from '../../components/BlogCard';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const POSTS_PER_PAGE = 9;

export const BlogGrid: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (!error) setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-40">
      <Loader2 className="animate-spin text-secondary w-10 h-10" />
    </div>
  );

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {visiblePosts.map(post => <BlogCard key={post.id} post={post} />)}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16">
          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-secondary hover:text-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-11 h-11 rounded-full font-bold text-sm transition-all ${
                page === currentPage
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-110'
                  : 'border border-gray-200 text-gray-500 hover:border-secondary hover:text-secondary'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-secondary hover:text-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};