import React from 'react';
import { Hero } from '../sections/home/Hero';
import { BooksSection } from '../sections/home/BooksSection';
import { AcademyCourses } from '../sections/academy/AcademyCourses';
import { BioReset } from '../sections/home/BioReset';
import { LeadMagnet } from '../sections/home/LeadMagnet';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      // <BooksSection />
      <BioReset />
      <LeadMagnet />
      <AcademyCourses />
    </div>
  );
};
