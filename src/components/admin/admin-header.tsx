'use client';

import React from 'react';
import { Menu, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui';

interface AdminHeaderProps {
  title: string;
  description?: string;
  onMenuClick: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: React.ReactNode;
}

export function AdminHeader({
  title,
  description,
  onMenuClick,
  onRefresh,
  isRefreshing = false,
  actions,
}: AdminHeaderProps) {
  const [currentDateTime, setCurrentDateTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Mở menu điều hướng quản trị"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg lg:text-xl font-bold font-serif text-navy-950 truncate tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="hidden sm:block text-xs text-slate-500 truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {currentDateTime && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-gold-600" />
            <span>{currentDateTime}</span>
          </div>
        )}

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="min-h-[40px] px-3 text-xs"
            aria-label="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
        )}

        {actions}
      </div>
    </header>
  );
}
