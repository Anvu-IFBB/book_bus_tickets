'use client';

import { useState, useEffect } from 'react';
import { Feedback } from '@/types/feedback';
import { getAdminFeedbacksAction } from '@/app/actions/feedbackActions';
import Link from 'next/link';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeedbacks = async () => {
    const res = await getAdminFeedbacksAction();
    if (res.success) {
      setFeedbacks(res.feedbacks || []);
    } else {
      setError(res.error || 'Failed to load feedbacks');
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeedbacks();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Mới</span>;
      case 'IN_REVIEW':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Đang xử lý</span>;
      case 'CONTACTED':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Đã liên hệ</span>;
      case 'RESOLVED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đã giải quyết</span>;
      case 'IGNORED':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Bỏ qua</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'POSITIVE':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">Tích cực</span>;
      case 'NEUTRAL':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium">Trung lập</span>;
      case 'NEEDS_REVIEW':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold">Tiêu cực</span>;
      default:
        return null;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải danh sách đánh giá...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh Giá & Khiếu Nại</h1>
        <button onClick={loadFeedbacks} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          Làm mới
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Thời gian</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Mã chuyến đi</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Khách hàng</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-center">Đánh giá</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Phân loại</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Chưa có đánh giá nào.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb.id} className={`hover:bg-gray-50 transition-colors ${fb.category === 'NEEDS_REVIEW' && fb.status === 'NEW' ? 'bg-red-50' : ''}`}>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(fb.submittedAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 text-sm font-medium text-primary">
                      {fb.bookingCode}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{fb.customerPhone}</div>
                      <div className="text-xs text-gray-500">{fb.customerName}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center text-yellow-400">
                        <span className="font-bold mr-1">{fb.rating}</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </td>
                    <td className="p-4">
                      {getCategoryBadge(fb.category)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(fb.status)}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/feedback/${fb.id}`}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
