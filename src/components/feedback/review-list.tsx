import React from 'react';
import { Feedback } from '@/types/feedback';
import { ReviewCard } from './review-card';
import { ReviewEmptyState } from './review-empty-state';

export interface ReviewListProps {
  reviews: Feedback[];
  isDemo?: boolean;
}

export function ReviewList({ reviews, isDemo = false }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return <ReviewEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} isDemo={isDemo} />
      ))}
    </div>
  );
}
