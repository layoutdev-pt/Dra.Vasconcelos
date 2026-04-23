import React from 'react';
import { BookCard } from '../../components/BookCard';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';
import { Link } from 'react-router-dom';

export const BooksSection: React.FC = () => {
  const { books, loading } = useBooks();

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  const latestBook = books[0];
  const featuredBooks = books.filter(b => b.is_featured);

  return (
    <section className="py-24 bg-white" id="catalogo">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        {/* NOVIDADE SECTION */}
        {latestBook && (
          <div className="mb-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block">
                  NOVIDADE
                </span>
                <h2 className="text-4xl font-extrabold text-primary">
                  {latestBook.title}
                </h2>
              </div>
              <Link to="/aprender" className="text-gray-600 hover:text-primary font-medium flex items-center gap-2 transition-colors text-sm">
                Ver mais
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[400px]">
                <BookCard 
                  author={latestBook.author.toUpperCase()}
                  titleLine1={latestBook.title.split(' ').slice(0, 2).join(' ')}
                  titleLine2={latestBook.title.split(' ').slice(2).join(' ')}
                  bookName={latestBook.title}
                  image={latestBook.cover_url}
                  status={latestBook.currency === 'BRL' ? `R$ ${latestBook.price?.toFixed(2).replace('.', ',')}` : latestBook.currency === 'USD' ? `$${latestBook.price?.toFixed(2).replace('.', ',')}` : `${latestBook.price?.toFixed(2).replace('.', ',')}€`}
                  theme="light"
                  isFeatured={true}
                  size="xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* BESTSELLERS / DESTAQUES SECTION */}
        {featuredBooks.length > 0 && (
          <div className="pt-20 border-t border-gray-100">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block">
                Seleção Especial
              </span>
              <h2 className="text-4xl font-extrabold text-primary">
                Os Nossos Bestsellers
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
              {featuredBooks.map((book) => (
                <div key={book.id} className="w-full max-w-[320px]">
                  <BookCard 
                    author={book.author.toUpperCase()}
                    titleLine1={book.title.split(' ').slice(0, 2).join(' ')}
                    titleLine2={book.title.split(' ').slice(2).join(' ')}
                    bookName={book.title}
                    image={book.cover_url}
                    status={book.currency === 'BRL' ? `R$ ${book.price?.toFixed(2).replace('.', ',')}` : book.currency === 'USD' ? `$${book.price?.toFixed(2).replace('.', ',')}` : `${book.price?.toFixed(2).replace('.', ',')}€`}
                    theme={book.type === 'ebook' ? 'blue' : 'dark'}
                    size="lg"
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