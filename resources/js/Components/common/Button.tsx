/**
 * Button — reusable button component (Phase 2)
 *
 * Usage:
 *   <Button>Click me</Button>
 *   <Button variant="outline" size="lg">Outline</Button>
 */
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:  'bg-primary text-white hover:bg-primary-500 shadow-sm hover:shadow-md',
    outline:  'border-2 border-primary text-primary hover:bg-primary-50',
    ghost:    'text-muted hover:bg-light-100 hover:text-dark',
    danger:   'bg-danger text-white hover:bg-red-600',
    success:  'bg-success text-white hover:bg-success-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-caption',
    md: 'px-5 py-2.5 text-body',
    lg: 'px-7 py-3 text-body-lg',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
