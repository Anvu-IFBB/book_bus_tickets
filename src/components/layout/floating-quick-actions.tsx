'use client';

import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '@/lib/constants/config';
import { Phone, ArrowUp, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function FloatingQuickActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-30 flex flex-col items-center gap-2.5 sm:gap-3 select-none"
      aria-label="Tiện ích liên hệ nhanh"
    >
      {/* Back to top button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Cuộn lên đầu trang"
          className={cn(
            'w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-700 shadow-md border border-slate-200',
            'flex items-center justify-center hover:bg-slate-50 hover:text-navy-950 transition-all',
            'animate-in fade-in zoom-in duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500'
          )}
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Zalo Direct Chat Button */}
      <a
        href={APP_CONFIG.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo với nhà xe"
        className={cn(
          'relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#0068FF] text-white shadow-lg flex items-center justify-center',
          'hover:scale-110 active:scale-95 transition-transform duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] focus-visible:ring-offset-2'
        )}
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
        <span className="sr-only">Nhắn tin qua Zalo</span>
      </a>

      {/* Call Hotline Button with subtle pulse effect */}
      <a
        href={`tel:${APP_CONFIG.primaryHotline}`}
        aria-label={`Gọi ngay tổng đài ${APP_CONFIG.primaryHotline}`}
        className={cn(
          'group relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gold-500 text-navy-950 shadow-xl flex items-center justify-center',
          'hover:scale-110 active:scale-95 transition-transform duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2'
        )}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full bg-gold-400 opacity-60 animate-ping"
          aria-hidden="true"
        />
        <Phone className="w-6 h-6 stroke-[2.5] relative z-10 animate-bounce group-hover:animate-none" />
        <span className="sr-only">Gọi điện hotline {APP_CONFIG.primaryHotline}</span>
      </a>
    </div>
  );
}
