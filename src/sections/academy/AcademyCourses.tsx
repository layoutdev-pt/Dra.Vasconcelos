import React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard, type CourseCardProps } from '../../components/CourseCard';
import { useCourses } from '../../hooks/useCourses';
import { AlertCircle, BookOpen } from 'lucide-react';

const CourseSkeleton: React.FC = () => (
  <div className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-surface-border flex flex-col animate-pulse">
    <div className="aspect-video bg-surface-muted"></div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="h-6 bg-surface-muted rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-surface-muted rounded w-full mb-2"></div>
      <div className="h-4 bg-surface-muted rounded w-5/6 mb-6"></div>
      <div className="mt-auto border-t border-surface-border pt-4 flex justify-between">
        <div className="h-4 bg-surface-muted rounded w-1/4"></div>
        <div className="h-6 bg-surface-muted rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

interface AcademyCoursesProps {
  featuredOnly?: boolean;
  showBorder?: boolean;
  title?: string;
  subtitle?: string;
}

export const AcademyCourses: React.FC<AcademyCoursesProps> = ({ 
  featuredOnly = false, 
  showBorder = false,
  title,
  subtitle
}) => {
  const { courses, loading, error } = useCourses();

  const displayCourses = featuredOnly 
    ? courses.filter(c => c.is_featured)
    : courses;

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

  if (!loading && displayCourses.length === 0) {
    if (featuredOnly) return null; // Don't show anything on home if no featured courses
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
    <section className={`w-full ${showBorder ? 'py-24 border-t border-surface-border' : ''}`}>
      {(title || subtitle) && (
        <div className="text-center mb-16 px-6">
          {subtitle && (
            <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-4xl font-extrabold text-site-text">
              {title}
            </h2>
          )}
        </div>
      )}
      
      <div className={`${showBorder ? 'max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12' : 'w-full'}`}>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12 pt-4 pb-12">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] max-w-[400px]">
                <CourseSkeleton />
              </div>
            ))
          ) : (
            displayCourses.map((course) => (
              <div key={course.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] max-w-[400px]">
                <Link to={`/cursos/${course.slug || course.id}`} className="transition-transform duration-500 hover:-translate-y-2 block h-full">
                  <CourseCard 
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    level={course.level}
                    modules={course.modules}
                    price={course.price}
                    image={course.image_url}
                    isPopular={course.is_featured}
                  />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};