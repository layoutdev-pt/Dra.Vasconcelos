import React from 'react';
import { MidiaHero } from '../sections/Midia/MidiaHero';
import { MidiaList } from '../sections/Midia/MidiaList';

export const Midia: React.FC = () => {
  return (
    <div className="w-full">
      <MidiaHero />
      <MidiaList />
    </div>
  );
};