import React from 'react';
import { BookCard3D } from '../../components/BookCard3D';
import { Loader2 } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';

export const BooksSection: React.FC = () => {
  const { books, loading } = useBooks();

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center bg-site-bg">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  const featuredBooks = books.filter((b) => b.is_featured);

  return (
    <section className="py-24 bg-site-bg transition-colors duration-500" id="catalogo">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        {/* BESTSELLERS SECTION */}
        {featuredBooks.length > 0 && (
          <div className="pt-20 border-t border-surface-border">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block">
                Seleção Especial
              </span>
              <h2 className="text-4xl font-extrabold text-site-text">
                Os Nossos Bestsellers
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
              {featuredBooks.map((book, index) => (
                <div key={book.id} className="w-full max-w-[320px]">
                  <BookCard3D 
                    book={book}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
