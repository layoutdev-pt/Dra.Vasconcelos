import React from 'react';
import { BookCard, type BookCardProps } from '../../components/BookCard';
import { ArrowRight } from 'lucide-react';

export const BooksSection: React.FC = () => {
  const books: BookCardProps[] = [
    {
      author: "DR. SILVA",
      titleLine1: "Gut Health",
      titleLine2: "Revolution",
      bookName: "Gut Health Revolution",
      status: "Bestseller 2023",
      theme: "dark"
    },
    {
      author: "DR. SILVA",
      titleLine1: "Mindful",
      titleLine2: "Healing",
      bookName: "Mindful Healing",
      status: "New Release",
      theme: "light",
      isFeatured: true
    },
    {
      author: "ESSENTIAL GUIDE",
      titleLine1: "Sleep",
      titleLine2: "Mastery",
      bookName: "Sleep Mastery",
      status: "Digital Edition",
      theme: "blue"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block">
              Publications
            </span>
            <h2 className="text-4xl font-extrabold text-primary">
              Novos Livros & Guias
            </h2>
          </div>
          <a href="#catalogo" className="text-gray-600 hover:text-primary font-medium flex items-center gap-2 transition-colors text-sm">
            View all publications
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-12 items-end justify-items-center mt-12">
          {books.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>

      </div>
    </section>
  );
};