import React from 'react';
import { MessageSquareDashed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface ReviewEmptyStateProps {
  title?: string;
  message?: string;
}

export function ReviewEmptyState({
  title = 'Chưa có đánh giá công khai',
  message = 'Hệ thống tự động thu thập phản hồi sau mỗi chuyến đi hoàn thành. Đánh giá từ hành khách sẽ được cập nhật tại đây.',
}: ReviewEmptyStateProps) {
  return (
    <Card className="p-8 sm:p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/60 max-w-xl mx-auto">
      <CardContent className="space-y-3 p-0">
        <div className="w-14 h-14 rounded-2xl bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto">
          <MessageSquareDashed className="w-7 h-7" />
        </div>
        <h4 className="text-base sm:text-lg font-bold text-navy-950">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
