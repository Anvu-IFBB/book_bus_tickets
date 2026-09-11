import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ButtonVariant } from './button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // Bắt buộc cho accessibility
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const sizeStyles = {
  sm: 'w-8 h-8 p-1.5 rounded-md min-w-[36px] min-h-[36px]',
  md: 'w-11 h-11 p-2.5 rounded-lg min-w-[44px] min-h-[44px]',
  lg: 'w-13 h-13 p-3 rounded-xl min-w-[48px] min-h-[48px]',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gold-500 text-navy-950 hover:bg-gold-600 active:bg-gold-700 shadow-sm',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 shadow-sm',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-100 active:bg-slate-200',
  goldOutline: 'border border-gold-500 text-gold-600 hover:bg-gold-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-navy-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      disabled,
      isLoading,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 shrink-0',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
