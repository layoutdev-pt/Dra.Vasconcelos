import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import type { Course } from '../types/course';

export const useCourses = (onlyPublished = true, page = 0, itemsPerPage = 20) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    const from = page * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = supabase
      .from('courses')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCourses((data as Course[]) ?? []);
    }

    setLoading(false);
  }, [onlyPublished, page, itemsPerPage]);

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      if (isMounted) {
        await fetchCourses();
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchCourses]);

  return { courses, loading, error, count: null, refetch: fetchCourses };
};