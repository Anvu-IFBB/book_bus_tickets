import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'goldOutline';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gold-500 text-navy-950 font-semibold shadow-sm hover:bg-gold-600 active:bg-gold-700 hover:shadow-md focus-visible:ring-gold-500 border border-gold-400',
  secondary:
    'bg-navy-900 text-white font-medium hover:bg-navy-800 active:bg-navy-950 hover:shadow-md focus-visible:ring-navy-500 border border-navy-800',
  outline:
    'bg-transparent text-slate-800 font-medium border border-slate-300 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
  goldOutline:
    'bg-transparent text-gold-600 font-medium border border-gold-500/70 hover:bg-gold-50 active:bg-gold-100 focus-visible:ring-gold-500',
  ghost:
    'bg-transparent text-slate-700 font-medium hover:bg-slate-100 hover:text-navy-900 active:bg-slate-200 focus-visible:ring-slate-400',
  danger:
    'bg-rose-600 text-white font-medium hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 border border-rose-600',
  success:
    'bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500 border border-emerald-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 rounded-md min-h-[36px]',
  md: 'text-sm px-4 py-2.5 h-11 gap-2 rounded-lg min-h-[44px]', // Chuẩn tap-target tối thiểu 44px
  lg: 'text-base px-6 py-3.5 h-13 gap-2.5 rounded-xl min-h-[48px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center select-none transition-all duration-150 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0 leading-none">{leftIcon}</span>
        )}
        <span className="truncate leading-normal">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0 leading-none">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
