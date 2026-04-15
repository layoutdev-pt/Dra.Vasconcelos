import React from 'react';

// Tipagem flexível para alinhar com a BD
export interface CourseCardProps {
  title: string;
  description: string;
  level?: string | null;
  modules?: number | null;
  price?: number | null;
  image: string;
  isPopular?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  title, 
  description, 
  level, 
  modules, 
  price, 
  image, 
  isPopular 
}) => {
  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative ${isPopular ? 'shadow-md' : ''}`}>
      
      {/* Etiqueta Flutuante de Popularidade */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-20 uppercase tracking-widest">
          Em Destaque
        </div>
      )}
      
      {/* Imagem e Nível */}
      <div className="h-48 overflow-hidden relative bg-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {level && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
            {level}
          </div>
        )}
      </div>
      
      {/* Corpo do Cartão */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed font-light line-clamp-3">
          {description}
        </p>
        
        {/* Rodapé do Cartão */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          {modules ? (
            <span className="text-sm font-medium text-gray-400">{modules} Módulos</span>
          ) : (
            <span className="text-sm font-medium text-gray-400">1 Programa Completo</span>
          )}
          
          {price != null && price > 0 ? (
            <span className="text-secondary font-bold text-lg">{price.toFixed(2).replace('.', ',')}€</span>
          ) : (
            <span className="text-secondary font-bold text-lg">Gratuito</span>
          )}
        </div>
      </div>
      
    </div>
  );
};