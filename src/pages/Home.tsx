import React, { useEffect } from "react";
import { Hero } from "../sections/home/Hero";
import { BooksSection } from "../sections/home/BooksSection";
import { AcademyCourses } from "../sections/academy/AcademyCourses";
import { FeaturedCourseBanner } from "../components/FeaturedCourseBanner";
import { LeadMagnet } from "../sections/home/LeadMagnet";

export const Home: React.FC = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="w-full">
      <Hero />
      <BooksSection />
      <FeaturedCourseBanner />
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
