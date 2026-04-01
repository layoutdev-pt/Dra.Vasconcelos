// src/components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex justify-center items-center px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:-translate-y-1";
  
  const variants = {
    primary: "bg-[#F97316] hover:bg-[#F97316]/90 text-white shadow-xl shadow-[#F97316]/20",
    secondary: "bg-[#2563EB] hover:bg-[#2563EB]/90 text-white",
    outline: "bg-white dark:bg-gray-800 text-[#0f1729] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
    glass: "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
