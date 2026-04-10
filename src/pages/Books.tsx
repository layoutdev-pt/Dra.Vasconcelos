import React from 'react';
import { BooksHero } from '../sections/books/BooksHero';
import { BooksMetrics } from '../sections/books/BooksMetrics';
import { BooksLeadMagnet } from '../sections/books/BooksLeadMagnet';
import { BooksGrid } from '../sections/books/BooksGrid';
import { BooksTrustBadge } from '../sections/books/BooksTrustBadge';

export const Books: React.FC = () => {
  return (
    <div className="w-full">
      <BooksHero />
      <BooksMetrics />
      <BooksLeadMagnet />
      <BooksGrid />
      <BooksTrustBadge />
    </div>
  );
};
