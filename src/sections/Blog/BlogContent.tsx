import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import type { BlogPost } from '../../types/blog';
import { Calendar, ChevronLeft, ChevronRight, Tag, Loader2 } from 'lucide-react';
import { BlogComments } from './BlogComments';

export const BlogContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [postRes, allRes] = await Promise.all([
        supabase.from('posts').select('*').eq('slug', slug).single(),
        supabase.from('posts').select('*').eq('is_published', true).order('published_at', { ascending: false })
      ]);
      setPost(postRes.data);
      setAllPosts(allRes.data || []);
      setLoading(false);
    };
    fetchData();
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-secondary w-10 h-10" /></div>;
  if (!post) return <div className="py-40 text-center">Artigo não encontrado.</div>;

  // Determine prev/next
  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <section className="pt-32 pb-20 bg-site-bg transition-colors duration-500">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 w-full">
        <Link to="/blog" className="inline-flex items-center gap-2 text-secondary font-bold text-xs uppercase mb-8 hover:gap-3 transition-all">
          <ChevronLeft size={16} /> Voltar ao Blog
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-site-text mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-site-text-muted">
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
          className="tiptap-content text-site-text font-light leading-relaxed mb-20 [&_h1]:text-site-text [&_h2]:text-site-text [&_h3]:text-site-text [&_strong]:text-site-text [&_strong]:font-bold! [&_a]:text-secondary! [&_a]:underline! break-words w-full overflow-x-hidden"
          dangerouslySetInnerHTML={{ __html: post.content || '' }} 
        />

        {/* Article Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-16 pt-12 border-t border-surface-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous (older) */}
              {prevPost ? (
                <Link 
                  to={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-4 p-5 bg-surface hover:bg-secondary/5 border border-surface-border hover:border-secondary/30 rounded-2xl transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-site-text-muted group-hover:text-secondary transition-colors shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-site-text-muted font-bold mb-1">Artigo Anterior</p>
                    <p className="text-sm font-bold text-site-text group-hover:text-secondary transition-colors line-clamp-2">{prevPost.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {/* Next (newer) */}
              {nextPost ? (
                <Link 
                  to={`/blog/${nextPost.slug}`}
                  className="group flex items-center justify-end gap-4 p-5 bg-surface hover:bg-secondary/5 border border-surface-border hover:border-secondary/30 rounded-2xl transition-all text-right"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-site-text-muted font-bold mb-1">Artigo Seguinte</p>
                    <p className="text-sm font-bold text-site-text group-hover:text-secondary transition-colors line-clamp-2">{nextPost.title}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-site-text-muted group-hover:text-secondary transition-colors shrink-0" />
                </Link>
              ) : <div />}
            </div>
          </div>
        )}

        {/* Comment Section (Moderation & Community) */}
        <BlogComments postId={post.id} />
      </div>
    </section>
  );
};