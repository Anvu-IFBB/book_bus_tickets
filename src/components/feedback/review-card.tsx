import React from 'react';
import { Feedback } from '@/types/feedback';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { RatingStars } from './rating-stars';
import { formatDateVN } from '@/lib/utils/formatters';
import { ShieldCheck } from 'lucide-react';

export interface ReviewCardProps {
  review: Feedback;
  isDemo?: boolean;
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 7) {
    return `${clean.slice(0, 4)}***${clean.slice(-3)}`;
  }
  return phone;
}

export function ReviewCard({ review, isDemo = false }: ReviewCardProps) {
  return (
    <Card hover className="h-full flex flex-col justify-between">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-700 font-bold text-sm shrink-0">
              {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <h4 className="font-bold text-navy-950 text-sm leading-snug flex items-center gap-1.5">
                <span>{review.customerName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" aria-label="Khách hàng đã đi xe thực tế" />
              </h4>
              <span className="text-[11px] text-slate-500">
                {maskPhone(review.customerPhone)}
              </span>
            </div>
          </div>

          <RatingStars rating={review.rating} size="sm" />
        </div>

        {isDemo && (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 select-none">
            DỮ LIỆU THỬ NGHIỆM (DEMO DATA)
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
        <p className="text-sm text-slate-700 leading-relaxed italic">
          &ldquo;{review.content}&rdquo;
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Chuyến: {review.bookingCode}</span>
          <span>{formatDateVN(review.submittedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
