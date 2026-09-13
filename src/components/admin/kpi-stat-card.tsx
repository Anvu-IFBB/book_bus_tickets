import React from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

export type KpiVariant = 'navy' | 'gold' | 'emerald' | 'amber' | 'blue' | 'rose' | 'slate';

interface KpiStatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  variant?: KpiVariant;
  onClick?: () => void;
  className?: string;
}

const variantIconStyles: Record<KpiVariant, string> = {
  navy: 'bg-navy-900 text-gold-400',
  gold: 'bg-gold-500/15 text-gold-700',
  emerald: 'bg-emerald-500/15 text-emerald-700',
  amber: 'bg-amber-500/15 text-amber-700',
  blue: 'bg-blue-500/15 text-blue-700',
  rose: 'bg-rose-500/15 text-rose-700',
  slate: 'bg-slate-200 text-slate-700',
};

export function KpiStatCard({
  title,
  value,
  icon,
  subtitle,
  variant = 'navy',
  onClick,
  className,
}: KpiStatCardProps) {
  return (
    <Card
      className={cn(
        'p-5 transition-all duration-200 flex flex-col justify-between border-slate-200/80',
        onClick && 'cursor-pointer hover:border-gold-500/50 hover:shadow-cardHover',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', variantIconStyles[variant])}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-bold font-serif text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}
