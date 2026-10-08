import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Evita prender o utilizador ou expulsá-lo do site se não houver entradas prévias
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 py-20 text-center animate-fade-in">
      <h1 className="text-8xl md:text-9xl font-bold tracking-tight text-secondary select-none animate-float-gentle">
        404
      </h1>

      <h2 className="mt-6 text-2xl font-bold text-site-text md:text-3xl">
        Página não encontrada
      </h2>

      <p className="max-w-md mt-4 text-site-text-muted text-lg">
        O endereço que tentou aceder não existe, foi removido ou está temporariamente indisponível.
      </p>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-secondary rounded-full hover:bg-secondary-light shadow-glass hover:shadow-float cursor-pointer"
        >
          Voltar à página anterior
        </button>
      </div>
    </div>
  );
};