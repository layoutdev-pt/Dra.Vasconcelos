import React from 'react';
import { AboutHero } from '../sections/about/AboutHero';
import { AboutBio } from '../sections/about/AboutBio';
import { JourneyTimeline } from '../sections/about/JourneyTimeline';
import { TestimonialsSlider } from '../sections/about/TestimonialsSlider';
import { AuthorityMetrics } from '../sections/about/AuthorityMetrics';
import { AboutBooks } from '../sections/about/AboutBooks';

export const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AboutHero />
      <AboutBio />
      <JourneyTimeline />
      <TestimonialsSlider />
      <AuthorityMetrics />
      <AboutBooks />
    </div>
  );
};
