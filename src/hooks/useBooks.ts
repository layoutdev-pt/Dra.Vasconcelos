import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import type { Book } from '../types/book';

export function useBooks(page = 0, itemsPerPage = 20) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      const from = page * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error: err, count: rowCount } = await supabase
        .from('books')
        .select('id, title, subtitle, author, description, cover_url, type, price, currency, buy_url, is_featured, is_published, position, published_at, created_at', { count: 'estimated' })
        .eq('is_published', true)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      setBooks((data as Book[]) ?? []);
      setCount(rowCount);
      setLoading(false);
    }

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [page, itemsPerPage]);

  return { books, loading, error, count };
}
