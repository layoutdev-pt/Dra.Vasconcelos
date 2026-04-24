import React from 'react';
import { CourseCard, type CourseCardProps } from '../../components/CourseCard';
import curso1 from '../../assets/images/curso1.jpg';
import curso2 from '../../assets/images/curso2.png';
import curso3 from '../../assets/images/curso3.webp';

export const CourseGrid: React.FC = () => {
  const courses: CourseCardProps[] = [
    {
      title: "BioReset 21® 14 dias – Parte Prática",
      description: "Programa intensivo e prático AO VIVO via Zoom para revitalizar o seu corpo.",
      level: "Todos os Níveis",
      modules: 2,
      price: 197.00,
      image: curso1,
      isPopular: true
    },
    {
      title: "Biorressonância – Pack Módulos 1 e 2",
      description: "Curso ao vivo, via Zoom ou presencial. Aprofunde os seus conhecimentos de Biorressonância.",
      level: "Avançado",
      modules: 4,
      price: 400.00,
      image: curso2,
      isPopular: false
    },
    {
      title: "O Poder do Jejum Intermitente - Curso Prático",
      description: "Sessões pré-gravadas para estudar e dominar as técnicas ao seu próprio ritmo.",
      level: "Iniciante",
      modules: 4,
      price: 297.00,
      image: curso3,
      isPopular: false
    }
  ];

  return (
    /* bg-site-bg garante que a seção mude de cor com o tema */
    <section className="py-24 bg-site-bg transition-colors duration-500">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-site-text mb-4 uppercase tracking-wider">
            Cursos
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-light">
            Programas exclusivos desenhados para elevar os seus conhecimentos e potenciar a sua saúde ao longo da vida.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-4 pb-12">
          {courses.map((course, index) => (
            <div key={index} className="transition-transform duration-500">
              <CourseCard {...course} />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  ); 
};