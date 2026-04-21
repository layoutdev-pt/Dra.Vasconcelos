import React from 'react';
import { BookCard } from '../../components/BookCard';
import { useBooks } from '../../hooks/useBooks';
import { Loader2 } from 'lucide-react';

export const AboutBooks: React.FC = () => {
  const { books, loading } = useBooks();

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  const featuredBooks = books.filter(b => b.is_featured);

  return (
    <section className="py-24 bg-white" id="publicacoes">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        <div className="flex flex-col mb-16 gap-4 text-center">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs">
            Publicações
          </span>
          <h2 className="text-4xl font-extrabold text-primary">
            Autora de Bestsellers e Cursos Sobre Saúde
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {featuredBooks.length > 0 
              ? `Autora de livros que se tornaram best-sellers tais como: ${featuredBooks.map(b => `"${b.title}"`).join(', ')}.`
              : 'Autora de livros que se tornaram best-sellers, transformando a vida de milhares de pessoas.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start justify-items-center mt-12 pb-12">
          {featuredBooks.map((book) => (
            <div key={book.id} className="transition-transform duration-500 w-full flex justify-center">
              <BookCard 
                author={book.author.toUpperCase()}
                titleLine1={book.title.split(' ').slice(0, 2).join(' ')}
                titleLine2={book.title.split(' ').slice(2).join(' ')}
                bookName={book.title}
                image={book.cover_url}
                status={book.currency === 'BRL' ? `R$ ${book.price?.toFixed(2).replace('.', ',')}` : book.currency === 'USD' ? `$${book.price?.toFixed(2).replace('.', ',')}` : `${book.price?.toFixed(2).replace('.', ',')}€`}
                theme={book.type === 'ebook' ? 'blue' : 'dark'}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
