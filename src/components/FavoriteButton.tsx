import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites, type FavoriteType } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface FavoriteButtonProps {
  itemId: string;
  type: FavoriteType;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ itemId, type, className = "" }) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  
  const active = isFavorite(itemId, type);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Inicie sessão para guardar favoritos');
      return;
    }

    setIsAnimating(true);
    const { error } = await toggleFavorite(itemId, type);
    
    if (error) {
      toast.error('Erro ao atualizar favoritos');
    }
    
    // Reset animation state after a short delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative flex items-center justify-center p-2 rounded-full bg-surface/80 backdrop-blur-sm border border-surface-border shadow-sm hover:scale-110 transition-all duration-300 group/fav ${className}`}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <motion.div
        animate={isAnimating ? {
          scale: [1, 1.5, 0.8, 1.2, 1],
          rotate: [0, 15, -15, 5, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <Heart 
          className={`w-5 h-5 transition-colors duration-300 ${
            active 
              ? "fill-red-500 text-red-500" 
              : "text-site-text-muted group-hover/fav:text-red-400"
          }`} 
        />
      </motion.div>

      {/* Partículas de explosão (TikTok style) */}
      <AnimatePresence>
        {isAnimating && active && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: Math.cos((i * 60) * Math.PI / 180) * 30,
                  y: Math.sin((i * 60) * Math.PI / 180) * 30
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </button>
  );
};
