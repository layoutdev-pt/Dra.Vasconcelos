import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import type { Course } from '../types/course';

export const useCourses = (onlyPublished = true) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('courses')
      .select('*')
      .order('position', { ascending: true })
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false });

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCourses(data ?? []);
    }

    setLoading(false);
  }, [onlyPublished]);

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

  return { courses, loading, error, refetch: fetchCourses };
};