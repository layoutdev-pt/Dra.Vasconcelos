import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import type { Course } from '../types/course';

export const useCourses = (onlyPublished = true, page = 0, itemsPerPage = 20) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    const from = page * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = supabase
      .from('courses')
      .select('id, title, subtitle, slug, description, image_url, secondary_image_url, type, level, modules, price, buy_url, is_featured, is_published, published_at, enrollment_closes_at, position, created_at', { count: 'estimated' })
      .order('position', { ascending: true })
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error: fetchError, count: rowCount } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCourses((data as Course[]) ?? []);
      setCount(rowCount);
    }

    setLoading(false);
  }, [onlyPublished, page, itemsPerPage]);

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      // Isolar a execução assegura que as mutações de estado ocorrem 
      // num ciclo assíncrono, resolvendo o 'set-state-in-effect'
      if (isMounted) {
        await fetchCourses();
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchCourses]);

  return { courses, loading, error, count, refetch: fetchCourses };
};