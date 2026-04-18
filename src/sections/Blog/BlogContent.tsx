import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import type { BlogPost } from '../../types/blog';
import { Calendar, ChevronLeft, Tag, Loader2 } from 'lucide-react';

export const BlogContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from('posts').select('*').eq('slug', slug).single();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-secondary w-10 h-10" /></div>;
  if (!post) return <div className="py-40 text-center">Artigo não encontrado.</div>;

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="max-w-[900px] mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-secondary font-bold text-xs uppercase mb-8 hover:gap-3 transition-all">
          <ChevronLeft size={16} /> Voltar ao Blog
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2"><Calendar size={16} className="text-secondary" /> {new Date(post.published_at!).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><Tag size={16} className="text-secondary" /> {post.category}</div>
          </div>
        </header>

        {post.image_url && (
          <div className="w-full h-[300px] md:h-[500px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed mb-20 prose-headings:text-primary prose-strong:text-primary prose-a:text-secondary"
          dangerouslySetInnerHTML={{ __html: post.content || '' }} 
        />
      </div>
    </section>
  );
};