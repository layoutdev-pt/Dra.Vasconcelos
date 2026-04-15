import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Course } from '../types/course';

export const useCourses = (onlyPublished = true) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setCourses(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [onlyPublished]);

  return { courses, loading, error, refetch: fetchCourses };
};
