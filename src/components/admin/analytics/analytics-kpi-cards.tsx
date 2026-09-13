'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types/analytics';
import { Card } from '@/components/ui';
import { formatCurrencyVN } from '@/lib/utils/formatters';
import {
  Banknote,
  CreditCard,
  Receipt,
  CheckCircle2,
  XCircle,
  Ticket,
  Star,
  Truck
} from 'lucide-react';

interface AnalyticsKPICardsProps {
  summary: AnalyticsSummary;
  isLoading?: boolean;
}

export function AnalyticsKPICards({ summary, isLoading }: AnalyticsKPICardsProps) {
  const { booking, revenue, fleet, feedback } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Tổng Booking */}
      <Card className="p-4 border-slate-200/80 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng Lượng Khách (Đơn)</p>
            <h3 className="text-2xl font-bold text-navy-950 mt-1">
              {isLoading ? '...' : booking.totalBookings}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Ticket className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn thành: {isLoading ? '...' : booking.completedBookings}</span>
          </div>
          <div className="flex items-center gap-1 text-rose-600">
            <XCircle className="w-4 h-4" />
            <span>Hủy: {isLoading ? '...' : booking.cancelledBookings}</span>
          </div>
        </div>
      </Card>

      {/* 2. Tổng Doanh Thu */}
      <Card className="p-4 border-slate-200/80 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng Doanh Thu</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1 truncate">
              {isLoading ? '...' : formatCurrencyVN(revenue.totalRevenue)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Banknote className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span>Cọc: {isLoading ? '...' : formatCurrencyVN(revenue.totalDeposit)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Receipt className="w-4 h-4" />
            <span>Nợ: {isLoading ? '...' : formatCurrencyVN(revenue.totalRemaining)}</span>
          </div>
        </div>
      </Card>

      {/* 3. Hoạt động Đội Xe */}
      <Card className="p-4 border-slate-200/80 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Chuyến Xe Vận Hành</p>
            <h3 className="text-2xl font-bold text-navy-950 mt-1">
              {isLoading ? '...' : fleet.totalTrips}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Truck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Hoàn thành: {isLoading ? '...' : fleet.completedTrips}</span>
          </div>
          <div className="font-medium text-navy-800">
            Hiệu suất: {isLoading ? '...' : Math.round(fleet.fleetUtilization)}%
          </div>
        </div>
      </Card>

      {/* 4. Khách Hàng Phản Hồi */}
      <Card className="p-4 border-slate-200/80 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Đánh Giá (Rating)</p>
            <h3 className="text-2xl font-bold text-gold-600 mt-1">
              {isLoading ? '...' : feedback.averageRating > 0 ? feedback.averageRating.toFixed(1) : '0.0'}
              <span className="text-sm text-slate-400 font-normal ml-1">/ 5.0</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
            <Star className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
          <span>Tổng số lượt đánh giá:</span>
          <span className="font-bold text-navy-950">{isLoading ? '...' : feedback.totalFeedback} lượt</span>
        </div>
      </Card>
    </div>
  );
}
