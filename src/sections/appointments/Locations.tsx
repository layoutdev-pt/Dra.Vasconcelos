import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

const LOCATIONS = [
  {
    id: 'lisboa',
    city: 'Lisboa',
    address: 'Avenida Sérgio Vieira de Mello, 17A\n1750-344 Lisboa',
    embedQuery: 'Avenida+Sérgio+Vieira+de+Mello+17A+Lisboa',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+S%C3%A9rgio+Vieira+de+Mello+17A+Lisboa',
  },
  {
    id: 'braga',
    city: 'Braga',
    address: 'Avenida do Cávado, 235 Palmeira\n4700-690 Braga',
    embedQuery: 'Avenida+do+Cávado+235+Palmeira+Braga',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+do+C%C3%A1vado+235+Palmeira+Braga',
  },
  {
    id: 'gaia',
    city: 'Vila Nova de Gaia',
    address: 'Rua António Luís Gomes, 168 R/C Dtº Frente\n4400-125 Vila Nova de Gaia',
    embedQuery: 'Rua+António+Luís+Gomes+168+Vila+Nova+de+Gaia',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Ant%C3%B3nio+Lu%C3%ADs+Gomes+168+Vila+Nova+de+Gaia',
  },
  {
    id: 'vilamoura',
    city: 'Vilamoura',
    address: 'Avenida Tivoli Edifício Alcharb\nFração e R/C, 8125-410 Vilamoura',
    embedQuery: 'Avenida+Tivoli+Edifício+Alcharb+Vilamoura',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+Tivoli+Edif%C3%ADcio+Alcharb+Vilamoura',
  },
];

const EMBED_BASE = 'https://maps.google.com/maps?q=';
const EMBED_SUFFIX = '&output=embed&z=16';

export const Locations: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-5">
            Onde Estamos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            As Nossas Localizações
          </h2>
          <p className="text-gray-500 font-light text-lg">
            Consultas presenciais em 4 locais em Portugal, com primeira consulta exclusivamente online.
          </p>
        </div>

        {/* 4-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_8px_32px_0_rgba(124,176,176,0.18)] transition-shadow duration-300 flex flex-col group"
            >
              {/* Map embed */}
              <div className="relative h-[250px] overflow-hidden">
                <iframe
                  src={`${EMBED_BASE}${loc.embedQuery}${EMBED_SUFFIX}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa da clínica em ${loc.city}`}
                />
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col grow">
                {/* City heading */}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-secondary shrink-0" />
                  <h3 className="font-bold text-base text-primary leading-tight">{loc.city}</h3>
                </div>

                {/* Address */}
                <p className="text-secondary text-sm font-medium leading-relaxed whitespace-pre-line mb-4">
                  {loc.address}
                </p>


              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
