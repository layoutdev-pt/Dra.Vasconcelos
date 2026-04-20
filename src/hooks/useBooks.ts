import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import type { Book } from '../types/book';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('books')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      setBooks((data as Book[]) ?? []);
      setLoading(false);
    }

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  return { books, loading, error };
}
