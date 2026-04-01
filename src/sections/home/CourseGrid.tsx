import React from 'react';
import { CourseCard, type CourseCardProps } from '../../components/CourseCard';

export const CourseGrid: React.FC = () => {
  // Injeção de dados validada pela interface CourseCardProps
  const courses: CourseCardProps[] = [
    {
      title: "Nutrition 101",
      description: "Understand the fundamentals of macronutrients and how to eat for sustained energy.",
      level: "Beginner",
      modules: 4,
      price: 49.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXkLWjZQJeOQTA10USTT0yWzaKRsrxAYF_q37qUOQk9MLGfeG_B6dyawbz6Ky6gRWOLZ2Xn8OwdbNH0b_1vrOi3CM9LyBf6rJcqVw7sbqC_beMn_NM8m2XKDz7w6OAkxZIuL3tkjrfmfCn7BPw_ZsEGCkV82nqMFSeH5REV0gtg_l6x6lakIPyLLX7LRn1lZsiLoZqhTzyGHsgtmseyGwuL9koo9sHa6E3uKtS5C6JbrZQNTwn6-MwR145kdjD3mPNEmFFxgX-uUt2",
      isPopular: false
    },
    {
      title: "Sleep Mastery",
      description: "A comprehensive guide to fixing your circadian rhythm and achieving deep, restorative sleep.",
      level: "Intermediate",
      modules: 6,
      price: 89.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMowGRNoZvDxK51tgdOTonbRJe8PjjZAAWdjAm37H4IlGQVz4R71UqHlnMecVEbuURTNj5240OzmGq2y8TIlnj3LIHSzDohDD2AsR5TFg-e_eBahD7DEec8TAovOWsm1K2MdTE00paMJsexZHdZsOtVDGn4ADPTqc39RdB5fX9NfcerVkDjPhwlgEtVTCQ244B7wcaxvICD_RRnNPJqNJstyrxMvYTv53q2qNZr3-SXqFkGPIab5yrSjhGVqafPIQGIR7yL1sFHSKs",
      isPopular: true
    },
    {
      title: "Stress Management",
      description: "Practical techniques including breathwork and mindfulness to lower cortisol instantly.",
      level: "All Levels",
      modules: 5,
      price: 69.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYdAdY21RTneu8RvhWZ0-o4FV1UmE5rmWjN58s6pHXY4aZeTiVLGN9P2p78Iv6tLEtNAIksSGQZq-EcBu2QJwjAyMWuawNY0J8KeUMICxEdit1pBkqT1k5ZMS-yicZzKpSAvKud6_q_qSiOW5X2Nv0xa21baNHhlrcNBd7YA0YD0xLp2BgRO6TEDTgK9CVc06EmjoR_AK6htVjlFaSAeHc03UySp6qLV8dJ2iG8xJ_iGCn1gNZR5eA8OVk8kBD728nHchrxisyrCVb",
      isPopular: false
    }
  ];

  return (
    <section className="py-24 bg-background-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Master Your Health
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
            Self-paced digital courses designed to empower you with knowledge and practical tools for lifelong wellness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch pt-4">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
        
      </div>
    </section>
  );
};