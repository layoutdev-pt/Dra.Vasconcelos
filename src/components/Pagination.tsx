import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {/* Prev */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-11 h-11 rounded-full border border-surface-border flex items-center justify-center text-site-text-muted hover:border-secondary hover:text-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`w-11 h-11 rounded-full font-bold text-sm transition-all ${
            page === currentPage
              ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-110'
              : 'border border-surface-border text-site-text-muted hover:border-secondary hover:text-secondary'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-11 h-11 rounded-full border border-surface-border flex items-center justify-center text-site-text-muted hover:border-secondary hover:text-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
