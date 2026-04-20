import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Download, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';
import type { Book } from '../../types/book';
import { Pagination } from '../../components/Pagination';

const ITEMS_PER_PAGE = 12;

/* ─── Filter tabs ──────────────────────────────────────────────────────── */

const TABS = [
  { id: 'todos', label: 'Todos' },
  { id: 'fisico', label: 'Livros Físicos' },
  { id: 'ebook', label: 'Ebooks' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ─── Animation variants ───────────────────────────────────────────────── */

const cardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

/* ─── Skeleton loader ───────────────────────────────────────────────────── */

const BookSkeleton: React.FC = () => (
  <div className="flex flex-col items-center gap-6 animate-pulse">
    {/* 3D Book shape */}
    <div className="relative w-[180px] h-[260px]">
      <div className="absolute inset-0 rounded-r-lg bg-gray-100" style={{ transform: 'rotateY(-8deg) rotateX(2deg)', transformStyle: 'preserve-3d' }} />
    </div>
    <div className="text-center space-y-2 w-full">
      <div className="h-4 w-2/3 bg-gray-100 rounded-lg mx-auto" />
      <div className="h-5 w-3/4 bg-gray-100 rounded-lg mx-auto" />
    </div>
  </div>
);

/* ─── 3D Book mockup (no image) ─────────────────────────────────────────── */

const BookMockup3D: React.FC<{ book: Book }> = ({ book }) => {
  const isEbook = book.type === 'ebook';

  /* pick cover color based on type/featured */
  const bgClass = book.is_featured
    ? 'from-primary via-primary to-primary/90'
    : isEbook
      ? 'from-blue-600 via-blue-700 to-blue-800'
      : 'from-secondary via-secondary to-secondary/80';

  const accentColor = book.is_featured ? 'text-accent' : isEbook ? 'text-blue-200' : 'text-white/70';

  /* split title for two-line display */
  const words = book.title.split(' ');
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  if (isEbook) {
    /* Tablet/e-reader mockup */
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

  /* Physical book cover */
  return (
    <div
      className={`w-[180px] h-[260px] rounded-r-lg shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] overflow-hidden relative`}
      style={{ transform: 'rotateY(-8deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}
    >
      {/* Spine */}
      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/30 to-black/5 z-20" />
      {/* Cover */}
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

/* ─── Book card with image fallback → 3D mockup ─────────────────────────── */

interface BookCardProps {
  book: Book;
  index: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, index }) => {
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
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      custom={index}
      className="flex flex-col items-center w-full cursor-pointer"
    >
      {/* ── 3D floating cover ───────────────────────────────────── */}
      <div className="relative mb-7" style={{ perspective: '900px' }}>
        {/* Badges */}
        {book.is_featured && (
          <div className="absolute -top-3 -right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-white text-[9px] font-bold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-2.5 h-2.5" />
            Destaque
          </div>
        )}

        <div className="absolute -top-3 -left-3 z-30">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md ${
            isEbook ? 'bg-blue-500 text-white' : 'bg-white text-primary border border-gray-200'
          }`}>
            {isEbook ? <Download className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
            {isEbook ? 'Ebook' : 'Físico'}
          </div>
        </div>

        {/* Floating animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4 + index * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.4,
          }}
          className="transition-transform duration-500 group-hover:scale-105"
        >
          {hasImage ? (
            <div
              className={`w-[180px] h-[260px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] ${
                isEbook ? 'rounded-2xl border-4 border-gray-800' : 'rounded-r-lg'
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
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <BookMockup3D book={book} />
          )}
        </motion.div>

        {/* Ground shadow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[120px] h-[16px] bg-black/8 rounded-full blur-lg" />
      </div>

      {/* ── Card info ───────────────────────────────────────────── */}
      <div className="text-center w-full max-w-[220px] min-h-[170px] flex flex-col justify-start">
        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">{book.author}</p>
        <h3 className="text-base font-bold text-primary leading-snug mb-1 line-clamp-2">{book.title}</h3>
        {book.subtitle && (
          <p className="text-xs text-accent italic mb-2 line-clamp-1">{book.subtitle}</p>
        )}
        <p className="text-xs text-gray-500 font-light leading-relaxed mb-4 line-clamp-2">{book.description}</p>

        <div className="flex items-center justify-center gap-3 mt-auto">
          {book.price != null ? (
            <span className="text-lg font-extrabold text-primary">
              {book.price.toFixed(2).replace('.', ',')}€
            </span>
          ) : (
            <span className="text-sm font-semibold text-secondary">Gratuito</span>
          )}

          {book.buy_url ? (
            <a
              href={book.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-md ${
                isEbook
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20'
                  : 'bg-secondary hover:bg-secondary/90 text-white shadow-secondary/20'
              }`}
            >
              {isEbook ? <Download className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              {isEbook ? 'Download' : 'Comprar'}
            </a>
          ) : (
            <span className="text-xs text-gray-400">Em breve</span>
          )}
        </div>

        <span className="inline-block text-xs text-secondary hover:underline mt-4 font-medium transition-colors">
          Saber Mais →
        </span>
      </div>
    </motion.div>
    </WrapperElement>
  );
};

/* ─── Main grid section ─────────────────────────────────────────────────── */

export const AcademyBooks: React.FC = () => {
  const { books, loading, error } = useBooks();
  const [activeTab, setActiveTab] = useState<TabId>('todos');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filtered = useMemo(() => {
    if (activeTab === 'todos') return books;
    return books.filter(b => b.type === activeTab);
  }, [books, activeTab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleBooks = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full pt-4 pb-12">
      {/* Filter Tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-full border border-gray-100 shadow-sm">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-secondary text-white shadow-md'
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-gray-500 font-light">Não foi possível carregar os livros.</p>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {Array.from({ length: 4 }).map((_, i) => <BookSkeleton key={i} />)}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-light text-lg">
                    {activeTab === 'ebook'
                      ? 'Nenhum ebook disponível de momento.'
                      : activeTab === 'fisico'
                        ? 'Nenhum livro físico disponível de momento.'
                        : 'Ainda não existem publicações.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
                    {visibleBooks.map((book, i) => (
                      <BookCard key={book.id} book={book} index={i} />
                    ))}
                  </div>

                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}

    </div>
  );
};
