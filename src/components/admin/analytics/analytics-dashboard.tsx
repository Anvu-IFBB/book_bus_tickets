'use client';

import React, { useState, useCallback } from 'react';
import { AnalyticsFilter, AnalyticsSummary, AnalyticsDateRange } from '@/types/analytics';
import { getAnalyticsSummaryAction } from '@/app/actions/analyticsActions';
import { AnalyticsFilters } from './analytics-filters';
import { AnalyticsKPICards } from './analytics-kpi-cards';
import { AnalyticsCharts } from './analytics-charts';
import { useToast } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface AnalyticsDashboardProps {
  initialSummary?: AnalyticsSummary;
  initialFilter?: AnalyticsFilter;
}

export function AnalyticsDashboard({ initialSummary, initialFilter = 'THIS_MONTH' }: AnalyticsDashboardProps) {
  const [filter, setFilter] = useState<AnalyticsFilter>(initialFilter);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(initialSummary || null);
  const [loading, setLoading] = useState<boolean>(!initialSummary);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { error: showErrorToast } = useToast();

  const fetchAnalytics = useCallback(async (selectedFilter: AnalyticsFilter, customRange?: AnalyticsDateRange) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Validate CUSTOM early
      if (selectedFilter === 'CUSTOM') {
        if (!customRange?.startDate || !customRange?.endDate) {
          throw new Error('Vui lòng chọn ngày bắt đầu và ngày kết thúc');
        }
      }
      const res = await getAnalyticsSummaryAction({ filter: selectedFilter, customRange });
      if (res.success && res.data) {
        setSummary(res.data);
      } else {
        throw new Error(res.error || 'Lỗi khi tải dữ liệu thống kê');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setErrorMsg(error.message || 'Lỗi hệ thống');
      showErrorToast(error.message || 'Lỗi hệ thống', 'Lỗi Analytics');
    } finally {
      setLoading(false);
    }
  }, [showErrorToast]);

  // Handle changing filter
  const handleFilterChange = (newFilter: AnalyticsFilter, customRange?: AnalyticsDateRange) => {
    // If selecting CUSTOM without full range (just toggled to show inputs), don't fetch yet
    if (newFilter === 'CUSTOM' && (!customRange?.startDate || !customRange?.endDate)) {
      setFilter(newFilter);
      return; 
    }
    
    // Check if duplicate fetch
    if (newFilter === filter && newFilter !== 'CUSTOM') return;
    
    setFilter(newFilter);
    fetchAnalytics(newFilter, customRange);
  };

  return (
    <div className="w-full">
      <AnalyticsFilters 
        currentFilter={filter} 
        onFilterChange={handleFilterChange} 
        isLoading={loading} 
      />

      {errorMsg ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-red-900 font-bold mb-1">Không thể tải báo cáo</h3>
          <p className="text-sm text-red-700">{errorMsg}</p>
          <button 
            onClick={() => fetchAnalytics(filter)}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      ) : summary ? (
        <>
          <AnalyticsKPICards summary={summary} isLoading={loading} />
          <AnalyticsCharts summary={summary} isLoading={loading} />
        </>
      ) : (
        loading && (
          <div className="p-12 text-center text-slate-500 text-sm animate-pulse">
            Đang tải dữ liệu báo cáo thống kê...
          </div>
        )
      )}
    </div>
  );
}
