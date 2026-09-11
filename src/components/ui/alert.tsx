import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { IconButton } from './icon-button';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: {
    bg: 'bg-blue-50/80',
    border: 'border-blue-200',
    text: 'text-blue-900',
    icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />,
  },
  success: {
    bg: 'bg-emerald-50/80',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />,
  },
  warning: {
    bg: 'bg-amber-50/80',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />,
  },
  danger: {
    bg: 'bg-rose-50/80',
    border: 'border-rose-200',
    text: 'text-rose-900',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />,
  },
};

export function Alert({
  className,
  variant = 'info',
  title,
  children,
  onDismiss,
  ...props
}: AlertProps) {
  const config = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        'p-4 rounded-xl border flex items-start gap-3 text-sm leading-relaxed transition-all',
        config.bg,
        config.border,
        config.text,
        className
      )}
      {...props}
    >
      {config.icon}

      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold text-sm leading-tight">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>

      {onDismiss && (
        <IconButton
          aria-label="Đóng thông báo"
          size="sm"
          onClick={onDismiss}
          className="-mr-1 -mt-1 text-slate-500 hover:text-slate-800"
        >
          <X className="w-4 h-4" />
        </IconButton>
      )}
    </div>
  );
}
