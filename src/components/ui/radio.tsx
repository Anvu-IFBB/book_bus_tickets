import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id || generatedId;

    return (
      <div className="flex items-start gap-2.5">
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={radioId}
            className={cn(
              'w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer select-none',
              'border-slate-300 bg-white hover:border-gold-500',
              'peer-checked:border-gold-500 peer-checked:bg-white',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-1',
              'peer-disabled:bg-slate-100 peer-disabled:border-slate-200 peer-disabled:cursor-not-allowed',
              className
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
          </label>
        </div>

        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <label
                htmlFor={radioId}
                className={cn(
                  'text-sm font-medium text-slate-800 cursor-pointer select-none leading-snug',
                  disabled && 'text-slate-400 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && <p className="text-xs text-slate-500 leading-normal">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
