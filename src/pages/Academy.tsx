import React from 'react';
import { AcademyHero } from '../sections/academy/AcademyHero';
import { AcademyMetrics } from '../sections/academy/AcademyMetrics';
import { AcademyLeadMagnet } from '../sections/academy/AcademyLeadMagnet';
import { AcademyTrustBadge } from '../sections/academy/AcademyTrustBadge';
import { AcademyTabs } from '../sections/academy/AcademyTabs';

export const Academy: React.FC = () => {
  return (
    <div className="w-full">
      <AcademyHero />
      <AcademyMetrics />
      <AcademyTabs />
      <AcademyLeadMagnet />
      <AcademyTrustBadge />
    </div>
  );
};
