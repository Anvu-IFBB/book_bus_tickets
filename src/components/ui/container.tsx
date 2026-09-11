import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full mx-auto px-4 sm:px-6 lg:px-8',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'white' | 'navy' | 'slate';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-transparent',
  white: 'bg-white',
  slate: 'bg-slate-50',
  navy: 'bg-navy-950 text-white',
};

const spacingStyles = {
  none: 'py-0',
  sm: 'py-6 sm:py-8',
  md: 'py-10 sm:py-16',
  lg: 'py-16 sm:py-24',
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', spacing = 'md', ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('w-full relative', variantStyles[variant], spacingStyles[spacing], className)}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';
