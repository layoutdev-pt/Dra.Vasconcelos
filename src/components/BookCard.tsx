import React from 'react';
import { FlaskConical } from 'lucide-react';

export interface BookCardProps {
  author: string;
  titleLine1: string;
  titleLine2: string;
  bookName: string;
  status: string;
  theme: 'dark' | 'light' | 'blue';
  isFeatured?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  author,
  titleLine1,
  titleLine2,
  bookName,
  status,
  theme,
  isFeatured
}) => {
  const coverStyles = {
    dark: "bg-[#0f172a] border-l-4 border-gray-600 text-white",
    light: "bg-white border-l-4 border-gray-200 text-[#0f172a]",
    blue: "bg-[#2563EB] border-l-4 border-blue-400 text-white",
  };

  const renderIcon = () => {
    if (theme === 'dark') {
      return (
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mt-4">
          <FlaskConical className="w-4 h-4 text-white" />
        </div>
      );
    }
    if (theme === 'blue') {
      return (
        <div className="flex gap-1.5 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
        </div>
      );
    }
    return <div className="w-8 h-0.5 bg-[#F97316]/30 mt-2"></div>;
  };

  const titleClasses = theme === 'light'
    ? "text-2xl font-serif text-[#0f172a] mb-4"
    : "text-xl font-display text-white mb-4";

  const spanClasses = theme === 'light'
    ? "text-[#F97316] italic"
    : "text-[#2563EB]";

  return (
    <div className={`flex flex-col items-center group cursor-pointer ${isFeatured ? 'md:-translate-y-6' : ''}`}>
      <div className="relative w-48 h-72 book-3d mb-8 transition-transform duration-500 group-hover:-translate-y-4">
        <div className={`absolute inset-0 rounded-r-md shadow-2xl overflow-hidden p-6 flex flex-col justify-between ${coverStyles[theme]}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest mb-3 text-gray-400">
              {author}
            </p>
            <h3 className={`font-bold leading-tight ${titleClasses}`}>
              {titleLine1}<br />
              <span className={spanClasses}>{titleLine2}</span>
            </h3>
          </div>

          <div className="relative z-10">
            {renderIcon()}
          </div>
        </div>
      </div>

      <div className="text-center w-full min-h-[90px] flex flex-col justify-start mt-2">
        <h4 className="text-lg font-bold text-primary line-clamp-2 leading-tight">{bookName}</h4>
        <p className="text-sm text-gray-500 mt-auto pt-2">{status}</p>
      </div>
    </div>
  );
};