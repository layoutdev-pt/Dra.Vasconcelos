import React from 'react';
import { useParams } from 'react-router-dom';
import { BlogHero } from '../sections/Blog/BlogHero';
import { BlogGrid } from '../sections/Blog/BlogGrid';
import { BlogContent } from '../sections/Blog/BlogContent';
import { BlogNewsletter } from '../sections/Blog/BlogNewsletter';

export const Blog: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="w-full bg-white">
      {slug ? (
        <BlogContent />
      ) : (
        <>
          <BlogHero />
          <BlogGrid />
        </>
      )}
      <BlogNewsletter />
    </div>
  );
};