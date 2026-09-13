'use client';

import React, { useState } from 'react';
import { AnalyticsFilter, AnalyticsDateRange } from '@/types/analytics';
import { Card } from '@/components/ui';

interface AnalyticsFiltersProps {
  currentFilter: AnalyticsFilter;
  onFilterChange: (filter: AnalyticsFilter, customRange?: AnalyticsDateRange) => void;
  isLoading?: boolean;
}

const FILTER_OPTIONS: { value: AnalyticsFilter; label: string }[] = [
  { value: 'TODAY', label: 'Hôm nay' },
  { value: 'YESTERDAY', label: 'Hôm qua' },
  { value: 'LAST_7_DAYS', label: '7 ngày qua' },
  { value: 'LAST_30_DAYS', label: '30 ngày qua' },
  { value: 'THIS_MONTH', label: 'Tháng này' },
  { value: 'PREVIOUS_MONTH', label: 'Tháng trước' },
  { value: 'CUSTOM', label: 'Tùy chỉnh' },
];

export function AnalyticsFilters({ currentFilter, onFilterChange, isLoading }: AnalyticsFiltersProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customError, setCustomError] = useState('');

  const handleSelect = (val: AnalyticsFilter) => {
    if (val !== 'CUSTOM') {
      onFilterChange(val);
      setCustomError('');
    } else {
      // Just visually switch to custom, don't trigger fetch yet
      onFilterChange('CUSTOM', { startDate, endDate }); // this will fail validation if empty, which is handled in parent
    }
  };

  const handleApplyCustom = () => {
    setCustomError('');
    if (!startDate || !endDate) {
      setCustomError('Vui lòng chọn ngày bắt đầu và ngày kết thúc');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setCustomError('Ngày bắt đầu không được lớn hơn ngày kết thúc');
      return;
    }
    onFilterChange('CUSTOM', { startDate, endDate });
  };

  return (
    <Card className="p-4 border-slate-200/80 mb-6 bg-white overflow-hidden">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-navy-950 font-serif">Bộ Lọc Thời Gian</h2>
          <p className="text-xs text-slate-500 mt-1">Chọn khoảng thời gian để xem báo cáo thống kê</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                disabled={isLoading && currentFilter !== 'CUSTOM'}
                onClick={() => handleSelect(opt.value)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-full transition-colors
                  ${currentFilter === opt.value
                    ? 'bg-gold-500 text-white shadow-sm border border-gold-600'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {currentFilter === 'CUSTOM' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                disabled={isLoading}
                className="text-xs px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
              <span className="text-slate-400 text-xs hidden sm:block">-</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                disabled={isLoading}
                className="text-xs px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
              <button
                onClick={handleApplyCustom}
                disabled={isLoading}
                className="px-3 py-1.5 bg-navy-900 text-white text-xs font-medium rounded-lg hover:bg-navy-800 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                Áp dụng
              </button>
            </div>
          )}
        </div>
      </div>
      {customError && currentFilter === 'CUSTOM' && (
        <div className="mt-2 text-xs text-red-500 font-medium text-right">{customError}</div>
      )}
    </Card>
  );
}
