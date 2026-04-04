// src/components/Button.tsx
import React from 'react';
import { Link } from 'react-router-dom';

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  children: React.ReactNode;
  className?: string;
};

type AsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; to?: undefined };
type AsAnchor = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };
type AsLink  = BaseProps & { to: string; href?: undefined; [key: string]: unknown };

type ButtonProps = AsButton | AsAnchor | AsLink;

const BASE = "inline-flex justify-center items-center px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:-translate-y-1";

const VARIANTS = {
  primary:   "bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20",
  secondary: "bg-[#2563EB] hover:bg-[#2563EB]/90 text-white",
  outline:   "bg-white text-[#0f1729] border border-gray-200 hover:bg-gray-50 transition-colors",
  glass:     "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all",
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;

  // Internal route link
  if ('to' in props && props.to) {
    const { to, ...rest } = props as AsLink;
    return <Link to={to} className={cls} {...(rest as object)}>{children}</Link>;
  }

  // External / anchor link
  if ('href' in props && props.href) {
    const { href, ...rest } = props as AsAnchor;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  // Default button
  return (
    <button className={cls} {...(props as AsButton)}>
      {children}
    </button>
  );
};
