import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import type { BlogPost } from '../../types/blog';
import { BlogCard } from '../../components/BlogCard';
import { Pagination } from '../../components/Pagination';
import { Loader2 } from 'lucide-react';

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

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {visiblePosts.map(post => <BlogCard key={post.id} post={post} />)}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};