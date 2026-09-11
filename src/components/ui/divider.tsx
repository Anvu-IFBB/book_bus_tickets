import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
}

export function Divider({
  className,
  orientation = 'horizontal',
  label,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-slate-200', className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center my-4', className)}
        {...props}
      >
        <div className="flex-1 border-t border-slate-200" />
        <span className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider select-none">
          {label}
        </span>
        <div className="flex-1 border-t border-slate-200" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full border-t border-slate-200 my-4', className)}
      {...props}
    />
  );
}
