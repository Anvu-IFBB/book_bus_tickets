'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { IconButton } from './icon-button';

export type ToastType = 'success' | 'danger' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const typeConfig: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    bg: 'bg-white',
    border: 'border-emerald-200',
    text: 'text-slate-800',
  },
  danger: {
    icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    bg: 'bg-white',
    border: 'border-rose-200',
    text: 'text-slate-800',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    bg: 'bg-white',
    border: 'border-amber-200',
    text: 'text-slate-800',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    bg: 'bg-white',
    border: 'border-blue-200',
    text: 'text-slate-800',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => toast({ type: 'success', message, title }),
    [toast]
  );
  const error = useCallback(
    (message: string, title?: string) => toast({ type: 'danger', message, title }),
    [toast]
  );
  const info = useCallback(
    (message: string, title?: string) => toast({ type: 'info', message, title }),
    [toast]
  );
  const warning = useCallback(
    (message: string, title?: string) => toast({ type: 'warning', message, title }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}

      {/* Floating Toast Viewport */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const conf = typeConfig[t.type];
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all',
                'animate-in slide-in-from-top-3 fade-in-50 duration-200',
                conf.bg,
                conf.border,
                conf.text
              )}
            >
              {conf.icon}
              <div className="flex-1 space-y-0.5 min-w-0">
                {t.title && <h6 className="text-sm font-semibold leading-tight truncate">{t.title}</h6>}
                <p className="text-xs text-slate-600 leading-snug break-words">{t.message}</p>
              </div>
              <IconButton
                aria-label="Đóng thông báo"
                size="sm"
                onClick={() => removeToast(t.id)}
                className="-mr-1.5 -mt-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </IconButton>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
