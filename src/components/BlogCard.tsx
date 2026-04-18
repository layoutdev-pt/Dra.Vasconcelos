import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../types/blog';

export const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Link 
      to={`/blog/${post.slug}`} 
      className="flex flex-col group h-full bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Imagem de Capa */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={post.image_url || 'https://via.placeholder.com/400x300'} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {post.category}
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
          <Calendar size={14} className="text-secondary" />
          {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recente'}
        </div>

        <h3 className="text-xl font-bold text-primary mb-3 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-500 text-sm font-light line-clamp-3 mb-6 flex-grow">
          {post.summary}
        </p>

        <div className="flex items-center gap-2 text-primary font-bold text-sm mt-auto">
          Ler Artigo 
          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-secondary" />
        </div>
      </div>
    </Link>
  );
};