import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export type FavoriteType = 'course' | 'book' | 'blog';

export interface FavoriteItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: FavoriteType;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', user.id);
    
    if (!error && data) {
      setFavorites(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = (itemId: string, type: FavoriteType) => {
    return favorites.some(f => f.item_id === itemId && f.item_type === type);
  };

  const toggleFavorite = async (itemId: string, type: FavoriteType) => {
    if (!user) return { error: 'Inicie sessão para guardar favoritos' };

    const existing = favorites.find(f => f.item_id === itemId && f.item_type === type);

    if (existing) {
      // Remove
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id);
      
      if (!error) {
        setFavorites(prev => prev.filter(f => f.id !== existing.id));
      }
      return { error: error?.message || null };
    } else {
      // Add
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{
          user_id: user.id,
          item_id: itemId,
          item_type: type
        }])
        .select()
        .single();
      
      if (!error && data) {
        setFavorites(prev => [...prev, data]);
      }
      return { error: error?.message || null };
    }
  };

  return { favorites, loading, isFavorite, toggleFavorite, refetch: fetchFavorites };
};
