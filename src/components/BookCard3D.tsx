import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Download, BookOpen, Sparkles } from 'lucide-react';
import type { Book } from '../types/book';

interface BookCard3DProps {
  book: Book;
  index: number;
}

/* ─── 3D Book mockup (no image) ─────────────────────────────────────────── */
const BookMockup3D: React.FC<{ book: Book }> = ({ book }) => {
  const isEbook = book.type === 'ebook';

  const bgClass = book.is_featured
    ? 'from-primary via-primary to-primary/90'
    : isEbook
      ? 'from-blue-600 via-blue-700 to-blue-800'
      : 'from-secondary via-secondary to-secondary/80';

  const accentColor = book.is_featured ? 'text-accent' : isEbook ? 'text-blue-200' : 'text-white/70';

  const words = book.title.split(' ');
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  if (isEbook) {
    return (
      <div
        className="w-[180px] h-[260px] rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] overflow-hidden border-4 border-gray-800 bg-gray-900"
        style={{ transform: 'rotateY(5deg) rotateX(-2deg)', transformStyle: 'preserve-3d' }}
      >
        <div className={`w-full h-full bg-gradient-to-br ${bgClass} flex flex-col justify-between p-5`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className={`text-[8px] uppercase tracking-[0.2em] ${accentColor} mb-2`}>{book.author}</p>
            <h4 className="text-sm font-bold text-white leading-tight">{line1}<br />{line2}</h4>
          </div>
          <div className="relative z-10 flex items-center gap-1.5">
            <Download className="w-3 h-3 text-white/60" />
            <span className="text-[8px] text-white/60 uppercase tracking-wider">Digital</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-[180px] h-[260px] rounded-r-lg shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] overflow-hidden relative`}
      style={{ transform: 'rotateY(-8deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/30 to-black/5 z-20" />
      <div className={`absolute inset-0 bg-gradient-to-br ${bgClass}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 p-5 pl-7 flex flex-col justify-between h-full">
          <div>
            <p className={`text-[8px] uppercase tracking-[0.2em] ${accentColor} mb-3`}>{book.author}</p>
            <h4 className="text-sm md:text-base font-bold text-white leading-tight">
              {line1}<br />
              <span className="text-accent/90 italic">{line2}</span>
            </h4>
          </div>
          <div className="w-8 h-0.5 bg-white/20" />
        </div>
      </div>
    </div>
  );
};

export const BookCard3D: React.FC<BookCard3DProps> = ({ book, index }) => {
  const [imgError, setImgError] = useState(false);
  const isEbook = book.type === 'ebook';
  const hasImage = !!book.cover_url && !imgError;

  const WrapperElement = book.buy_url ? 'a' : 'div';
  const wrapperProps = book.buy_url
    ? { href: book.buy_url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <WrapperElement {...wrapperProps} className="flex flex-col items-center group">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="flex flex-col items-center w-full cursor-pointer"
      >
        <div className="relative mb-7" style={{ perspective: '900px' }}>
          {book.is_featured && (
            <div className="absolute -top-3 -right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-white text-[9px] font-bold uppercase tracking-widest shadow-lg">
              <Sparkles className="w-2.5 h-2.5" />
              Destaque
            </div>
          )}

          <div className="absolute -top-3 -left-3 z-30">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md ${
              isEbook ? 'bg-blue-600 text-white' : 'bg-surface text-site-text border border-surface-border'
            }`}>
              {isEbook ? <Download className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
              {isEbook ? 'Ebook' : 'Físico'}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4 + index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.4,
            }}
            className="transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]"
          >
            {hasImage ? (
              <div
                className={`w-[180px] h-[260px] ${
                  isEbook ? 'rounded-2xl border-4 border-gray-800 overflow-hidden' : 'rounded-r-lg'
                }`}
                style={{
                  transform: isEbook ? 'rotateY(5deg) rotateX(-2deg)' : 'rotateY(-8deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
            ) : (
              <BookMockup3D book={book} />
            )}
          </motion.div>

          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[120px] h-[16px] bg-black/8 rounded-full blur-lg" />
        </div>

        <div className="text-center w-full max-w-[220px] min-h-[170px] flex flex-col justify-start">
          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{book.author}</p>
          <h3 className="text-base font-bold text-site-text leading-snug mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-xs text-secondary font-light leading-relaxed mb-4 line-clamp-2">{book.subtitle || 'Livro Alexandra Vasconcelos'}</p>

          <div className="flex items-center justify-center gap-3 mt-auto">
            {book.price != null ? (
              <span className="text-lg font-extrabold text-site-text">
                {book.currency === 'BRL' ? `R$ ${book.price.toFixed(2).replace('.', ',')}` : 
                 book.currency === 'USD' ? `$${book.price.toFixed(2).replace('.', ',')}` :
                 `${book.price.toFixed(2).replace('.', ',')}€`}
              </span>
            ) : (
              <span className="text-sm font-semibold text-secondary">Gratuito</span>
            )}

            {book.buy_url ? (
              <div
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 group-hover:-translate-y-0.5 shadow-md ${
                  isEbook
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    : 'bg-secondary hover:bg-secondary/90 text-white shadow-secondary/20'
                }`}
              >
                {isEbook ? <Download className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                {isEbook ? 'Download' : 'Comprar'}
              </div>
            ) : (
              <span className="text-xs text-site-text-muted">Em breve</span>
            )}
          </div>

          <span className="inline-block text-xs text-secondary group-hover:underline mt-4 font-medium transition-colors">
            Saber Mais →
          </span>
        </div>
      </motion.div>
    </WrapperElement>
  );
};
