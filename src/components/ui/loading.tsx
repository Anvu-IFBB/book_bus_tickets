import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gold' | 'navy' | 'white' | 'slate';
}

const spinnerSizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
};

const spinnerColors = {
  gold: 'border-gold-500 border-t-transparent',
  navy: 'border-navy-900 border-t-transparent',
  white: 'border-white border-t-transparent',
  slate: 'border-slate-400 border-t-transparent',
};

export function Spinner({ size = 'md', variant = 'gold', className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Đang tải dữ liệu"
      className={cn(
        'inline-block rounded-full animate-spin shrink-0',
        spinnerSizes[size],
        spinnerColors[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
}

export function Skeleton({
  variant = 'text',
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-slate-200/80',
        variant === 'text' && 'h-4 w-full rounded-md',
        variant === 'rectangular' && 'rounded-xl',
        variant === 'circular' && 'rounded-full shrink-0',
        className
      )}
      {...props}
    />
  );
}
