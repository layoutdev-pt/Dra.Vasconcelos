import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import type { BlogPost } from '../../types/blog';
import { BlogCard } from '../../components/BlogCard';
import { Loader2 } from 'lucide-react';

export const BlogGrid: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
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

  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map(post => <BlogCard key={post.id} post={post} />)}
      </div>
    </section>
  );
};