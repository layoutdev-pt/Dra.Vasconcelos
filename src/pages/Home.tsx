import React from 'react';
import { Hero } from '../sections/home/Hero';
import { BooksSection } from '../sections/home/BooksSection';
import { AcademyCourses } from '../sections/academy/AcademyCourses';
import { PalestraSection } from '../sections/home/PalestraSection';
import { LeadMagnet } from '../sections/home/LeadMagnet';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <BooksSection />
      <PalestraSection />
      <LeadMagnet />
      <AcademyCourses 
        featuredOnly={true} 
        showBorder={true}
        subtitle="Educação e Saúde"
        title="Cursos Online em Destaque"
      />
    </div>
  );
};
