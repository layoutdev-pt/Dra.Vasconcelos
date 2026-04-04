import React from 'react';
import { AppointmentHero } from '../sections/appointments/AppointmentHero';
import { Locations } from '../sections/appointments/Locations';
import { ConsultationDetails } from '../sections/appointments/ConsultationDetails';
import { AdvancedTreatments } from '../sections/appointments/AdvancedTreatments';

export const Appointments: React.FC = () => {
  return (
    <div className="w-full">
      <AppointmentHero />
      <Locations />
      <ConsultationDetails />
      <AdvancedTreatments />
    </div>
  );
};
