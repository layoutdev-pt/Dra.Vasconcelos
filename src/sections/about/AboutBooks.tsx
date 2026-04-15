import React from 'react';
import { BookCard } from '../../components/BookCard';

export const AboutBooks: React.FC = () => {
  const books = [
    {
      author: "ALEXANDRA VASCONCELOS",
      titleLine1: "O Segredo para se",
      titleLine2: "Manter Jovem",
      bookName: "O Segredo para se Manter Jovem e Saudável",
      status: "Bestseller",
      theme: "dark" as "dark" | "light" | "blue"
    },
    {
      author: "ALEXANDRA VASCONCELOS",
      titleLine1: "O Poder do Jejum",
      titleLine2: "Intermitente",
      bookName: "O Poder do Jejum Intermitente",
      status: "Mais Vendido",
      theme: "blue" as "dark" | "light" | "blue"
    },
    {
      author: "ALEXANDRA VASCONCELOS",
      titleLine1: "Os Segredos",
      titleLine2: "da Água",
      bookName: "Os Segredos da Água que Bebemos",
      status: "Digital Edition",
      theme: "light" as "dark" | "light" | "blue"
    }
  ];

  return (
    <section className="py-24 bg-white" id="publicacoes">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 2xl:px-12">
        
        <div className="flex flex-col mb-16 gap-4 text-center">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs">
            Publicações
          </span>
          <h2 className="text-4xl font-extrabold text-primary">
            Autora de Bestsellers e Cursos Sobre Saúde
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Autora de livros que se tornaram best-sellers tais como: "O Segredo para se Manter Jovem e Saudável", "Jovem e Saudável em 21 dias – Programa para reeducar o sistema imunitário, reverter e prevenir doenças", "O Poder do Jejum Intermitente", "Os Segredos da Água que Bebemos", "As Bactérias que nos curam" e recentemente o "ENERGIZA-TE".
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start justify-items-center mt-12 pb-12">
          {books.map((book, index) => (
            <div key={index} className="transition-transform duration-500 w-full flex justify-center">
              <BookCard {...book} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
