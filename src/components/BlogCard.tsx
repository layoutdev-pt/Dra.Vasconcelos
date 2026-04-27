import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import type { BlogPost } from '../types/blog';

export const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  // Utility to extract plain text from HTML content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const displayText = post.summary?.trim() 
    ? post.summary 
    : stripHtml(post.content || '').substring(0, 300);

  return (
    <Link 
      to={`/blog/${post.slug}`} 
      className="flex flex-col group h-full bg-surface rounded-[2.5rem] overflow-hidden border border-surface-border shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Imagem de Capa */}
      {post.image_url && (
        <div className="relative h-64 overflow-hidden shrink-0">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute top-4 left-4 z-30">
            <span className="bg-surface/90 backdrop-blur-sm text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
              {post.category}
            </span>
          </div>
        </div>
      )}

      {/* Conteúdo do Card */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-site-text-muted text-xs mb-4">
          {!post.image_url && (
            <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {post.category}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-secondary" />
            {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recente'}
          </span>
        </div>

        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-xl font-bold text-site-text leading-tight group-hover:text-secondary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <FavoriteButton 
            itemId={post.id} 
            type="blog" 
            className="shrink-0 -mt-1" 
          />
        </div>

        <p className="text-site-text-muted text-sm font-light line-clamp-3 mb-6 flex-grow">
          {displayText}
        </p>

        <div className="flex items-center gap-2 text-site-text font-bold text-sm mt-auto">
          Ler Artigo 
          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-secondary" />
        </div>
      </div>
    </Link>
  );
};