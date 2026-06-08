import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * The className applied to the wrapper element.
   * If not provided, it falls back to the same className passed to the image,
   * which allows standard sizing classes (e.g. w-24 h-24 rounded-full) to shape the skeleton container.
   */
  wrapperClassName?: string;
  /**
   * Controls how the image fits within its container. Defaults to 'object-cover'.
   */
  objectFit?: 'object-cover' | 'object-contain' | 'object-fill' | 'object-none' | 'object-scale-down';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  wrapperClassName,
  objectFit = 'object-cover',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use the provided wrapperClassName or fallback to the image className
  const containerClass = wrapperClassName !== undefined ? wrapperClassName : className;

  if (!src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${containerClass}`}>
        <span className="text-gray-400 text-xs">Sem Imagem</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClass}`}>
      {/* Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Fallback for Broken Images */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Erro</span>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={`w-full h-full ${objectFit} transition-opacity duration-300 ${isLoaded && !hasError ? 'opacity-100' : 'opacity-0'} ${wrapperClassName !== undefined ? className : ''}`}
        {...props}
      />
    </div>
  );
};
