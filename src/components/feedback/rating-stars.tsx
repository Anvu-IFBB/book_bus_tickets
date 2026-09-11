import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface RatingStarsProps {
  rating: number; // 1 -> 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4 sm:w-5 sm:h-5',
  lg: 'w-6 h-6',
};

export function RatingStars({
  rating,
  maxStars = 5,
  size = 'md',
  className,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 select-none', className)} aria-label={`Đánh giá ${rating} trên ${maxStars} sao`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        if (interactive) {
          return (
            <button
              key={index}
              type="button"
              onClick={() => onRatingChange?.(starValue)}
              aria-label={`Chọn ${starValue} sao`}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled ? 'fill-gold-500 text-gold-500' : 'text-slate-300'
                )}
              />
            </button>
          );
        }

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              isFilled ? 'fill-gold-500 text-gold-500' : 'text-slate-200'
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
