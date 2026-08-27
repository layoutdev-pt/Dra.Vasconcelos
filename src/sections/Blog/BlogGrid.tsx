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
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const query = supabase
        .from('blog_posts')
        .select('id, title, slug, summary, category, image_url, is_published, published_at, position, created_at', { count: 'estimated' })
        .eq('is_published', true)
        .order('position', { ascending: true })
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data, count, error } = await query;
      
      if (isMounted) {
        if (!error) {
          setPosts((data as BlogPost[]) || []);
          if (count !== null) setTotalCount(count);
        }
        setLoading(false);
      }
    };
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  if (loading && posts.length === 0) return (
    <div className="flex justify-center py-40">
      <Loader2 className="animate-spin text-secondary w-10 h-10" />
    </div>
  );

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  const visiblePosts = posts;

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