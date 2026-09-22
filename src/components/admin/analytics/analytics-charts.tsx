'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types/analytics';
import { Card } from '@/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrencyVN } from '@/lib/utils/formatters';

interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
  isLoading?: boolean;
}

const COLORS = ['#0f172a', '#0284c7', '#059669', '#d97706', '#e11d48', '#8b5cf6'];
const STATUS_COLORS: Record<string, string> = {
  'COMPLETED': '#059669',
  'CANCELLED': '#e11d48',
  'NEW': '#3b82f6',
  'CONFIRMED': '#2563eb',
  'IN_PROGRESS': '#d97706',
  'ASSIGNED': '#8b5cf6',
  'CONTACTING': '#475569',
};

export function AnalyticsCharts({ summary, isLoading }: AnalyticsChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-80 bg-slate-100 animate-pulse border-slate-200" />
        <Card className="p-6 h-80 bg-slate-100 animate-pulse border-slate-200" />
      </div>
    );
  }

  // 1. Prepare Daily Revenue Data
  const revenueData = summary.revenue.dailyRevenue.map(item => ({
    date: item.date.split('-').slice(1).join('/'), // format MM/DD
    amount: item.amount,
  }));

  // 2. Prepare Booking Status Data for Donut
  const statusData = Object.entries(summary.booking.statusDistribution).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // 3. Prepare Route Distribution Data for Bar Chart
  const routeData = Object.entries(summary.booking.routeDistribution)
    .sort((a, b) => b[1] - a[1]) // Sort descending
    .slice(0, 5) // Top 5
    .map(([route, count]) => ({
      name: route.length > 20 ? route.substring(0, 20) + '...' : route, // Truncate long names
      'Số lượng': count,
      fullName: route,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* Doanh thu theo ngày */}
      <Card className="p-5 border-slate-200/80 bg-white">
        <h3 className="text-sm font-bold text-navy-950 font-serif mb-4 border-b border-slate-100 pb-2">
          Biểu Đồ Doanh Thu
        </h3>
        {revenueData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  formatter={(value: unknown) => [formatCurrencyVN(value as number), 'Doanh thu']}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: '#059669', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
            Chưa có dữ liệu doanh thu
          </div>
        )}
      </Card>

      {/* Trạng thái đơn hàng */}
      <Card className="p-5 border-slate-200/80 bg-white">
        <h3 className="text-sm font-bold text-navy-950 font-serif mb-4 border-b border-slate-100 pb-2">
          Tỷ Lệ Trạng Thái Đơn Hàng
        </h3>
        {statusData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: unknown) => [`${value} đơn`, 'Số lượng']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
            Chưa có dữ liệu trạng thái
          </div>
        )}
      </Card>

      {/* Top Tuyến Đường */}
      <Card className="p-5 border-slate-200/80 bg-white lg:col-span-2">
        <h3 className="text-sm font-bold text-navy-950 font-serif mb-4 border-b border-slate-100 pb-2">
          Top Tuyến Đường Đặt Chuyến Nhiều Nhất
        </h3>
        {routeData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value: unknown) => [`${value} đơn`, 'Số lượng']}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Số lượng" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={32}>
                  {routeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
            Chưa có dữ liệu tuyến đường
          </div>
        )}
      </Card>

    </div>
  );
}
