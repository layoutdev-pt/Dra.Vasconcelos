import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Download, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';
import type { Book } from '../../types/book';
import { BookCard3D } from '../../components/BookCard3D';
import { Pagination } from '../../components/Pagination';

const ITEMS_PER_PAGE = 12;

/* ─── Filter tabs ──────────────────────────────────────────────────────── */

const TABS = [
  { id: 'todos', label: 'Todos' },
  { id: 'fisico', label: 'Livros Físicos' },
  { id: 'ebook', label: 'Ebooks' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ─── Skeleton loader ───────────────────────────────────────────────────── */

const BookSkeleton: React.FC = () => (
  <div className="flex flex-col items-center gap-6 animate-pulse">
    {/* 3D Book shape */}
    <div className="relative w-[180px] h-[260px]">
      <div className="absolute inset-0 rounded-r-lg bg-surface-muted" style={{ transform: 'rotateY(-8deg) rotateX(2deg)', transformStyle: 'preserve-3d' }} />
    </div>
    <div className="text-center space-y-2 w-full">
      <div className="h-4 w-2/3 bg-surface-muted rounded-lg mx-auto" />
      <div className="h-5 w-3/4 bg-surface-muted rounded-lg mx-auto" />
    </div>
  </div>
);

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
          <div className="flex flex-wrap justify-center gap-2 bg-surface p-2 rounded-full border border-surface-border shadow-sm">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-secondary text-white shadow-md'
                    : 'text-site-text-muted hover:text-site-text hover:bg-surface-muted'
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
            <div className="w-14 h-14 bg-red-50/10 rounded-2xl flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-site-text-muted font-light">Não foi possível carregar os livros.</p>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
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
                  <div className="w-16 h-16 bg-surface-muted rounded-3xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-site-text-muted/40" />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
                    {visibleBooks.map((book, i) => (
                      <BookCard3D key={book.id} book={book} index={i} />
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
