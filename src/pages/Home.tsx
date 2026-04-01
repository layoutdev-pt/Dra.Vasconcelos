import React from 'react';
import { Hero } from '../sections/home/Hero';
import { BooksSection } from '../sections/home/BooksSection';
import { CourseGrid } from '../sections/home/CourseGrid';
import { BioReset } from '../sections/home/BioReset';
import { LeadMagnet } from '../sections/home/LeadMagnet';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <BooksSection />
      <BioReset />
      <LeadMagnet />
      <CourseGrid />
    </div>
  );
};