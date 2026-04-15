import React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard, type CourseCardProps } from '../../components/CourseCard';
import { useCourses } from '../../hooks/useCourses';
import { AlertCircle, BookOpen } from 'lucide-react';

const CourseSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[400px] animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
      <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export const AcademyCourses: React.FC = () => {
  const { courses, loading, error } = useCourses();

  const mappedCourses: CourseCardProps[] = courses.map(course => ({
    title: course.title,
    description: course.description,
    level: course.level,
    modules: course.modules,
    price: course.price,
    image: course.image_url,
    isPopular: course.is_featured
  }));

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-gray-500">Não foi possível carregar os cursos. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!loading && mappedCourses.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-light text-lg">Nenhum curso disponível de momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pt-4 pb-12">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <CourseSkeleton key={i} />)
        ) : (
          courses.map((course) => (
            <Link key={course.id} to={`/cursos/${course.id}`} className="transition-transform duration-500 block h-full">
              <CourseCard 
                title={course.title}
                description={course.description}
                level={course.level}
                modules={course.modules}
                price={course.price}
                image={course.image_url}
                isPopular={course.is_featured}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};