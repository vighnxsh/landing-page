'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-emerald-400 hover:bg-emerald-500 text-black font-semibold',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
    outline: 'border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-500 hover:text-black',
    ghost: 'text-white hover:bg-gray-800 hover:text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-none',
    md: 'px-4 py-2 text-base rounded-none',
    lg: 'px-6 py-3 text-lg rounded-none'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};




