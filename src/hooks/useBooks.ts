import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import type { Book } from '../types/book';

export function useBooks(page = 0, itemsPerPage = 20) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      const from = page * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Removido o { count: 'estimated' } que sobrecarrega a API e causa o 503
      const { data, error: err } = await supabase
        .from('books')
        .select('*')
        .eq('is_published', true)
        .order('position', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(from, to);

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
  }, [page, itemsPerPage]);

  return { books, loading, error, count: null };
}