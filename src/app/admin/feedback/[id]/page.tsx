'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Feedback, NegativeFeedbackStatus } from '@/types/feedback';
import { getFeedbackByIdAction, processNegativeFeedbackAction } from '@/app/actions/feedbackActions';

export default function AdminFeedbackDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [processing, setProcessing] = useState(false);
  const [newStatus, setNewStatus] = useState<NegativeFeedbackStatus>('NEW');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    const loadFeedback = async () => {
      const res = await getFeedbackByIdAction(params.id);
      if (res.success && res.feedback) {
        setFeedback(res.feedback);
        setNewStatus(res.feedback.status);
        setAdminNote(res.feedback.adminNote || '');
      } else {
        setError(res.error || 'Failed to load feedback');
      }
      setLoading(false);
    };

     
    loadFeedback();
  }, [params.id]);
  const handleUpdateStatus = async () => {
    if (!adminNote.trim() && newStatus !== 'NEW') {
      alert('Vui lòng nhập ghi chú xử lý khi chuyển trạng thái!');
      return;
    }

    setProcessing(true);
    const res = await processNegativeFeedbackAction(params.id, newStatus, adminNote);
    if (res.success) {
      setFeedback(res.feedback || null);
      alert('Cập nhật trạng thái thành công!');
    } else {
      alert(res.error || 'Lỗi khi cập nhật trạng thái');
    }
    setProcessing(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  if (error || !feedback) return <div className="p-8 text-center text-red-500">{error || 'Không tìm thấy dữ liệu'}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết Đánh Giá</h1>
        <button 
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          &larr; Quay lại
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* THÔNG TIN KHÁCH HÀNG & CHUYẾN ĐI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Thông tin chung</h2>
          
          <div className="space-y-4">
            <div>
              <span className="block text-sm text-gray-500">Khách hàng</span>
              <span className="font-medium text-gray-900">{feedback.customerName || 'N/A'} - {feedback.customerPhone}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Mã chuyến đi</span>
              <span className="font-bold text-primary">{feedback.bookingCode}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Thời gian gửi</span>
              <span className="font-medium text-gray-900">{new Date(feedback.submittedAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>

        {/* NỘI DUNG ĐÁNH GIÁ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Nội dung đánh giá</h2>
          
          <div className="space-y-4">
            <div>
              <span className="block text-sm text-gray-500">Xếp hạng</span>
              <div className="flex items-center text-yellow-400 mt-1">
                <span className="font-bold text-2xl mr-2">{feedback.rating}</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Nhận xét</span>
              <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {feedback.content || <i>(Không có nhận xét chi tiết)</i>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUY TRÌNH XỬ LÝ KHIẾU NẠI */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Xử lý Khiếu nại / Phản hồi</h2>
        
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái xử lý</label>
            <select 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as NegativeFeedbackStatus)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="NEW">Mới (Chưa xử lý)</option>
              <option value="IN_REVIEW">Đang kiểm tra / Điều tra</option>
              <option value="CONTACTED">Đã liên hệ với khách</option>
              <option value="RESOLVED">Đã giải quyết xong</option>
              <option value="IGNORED">Bỏ qua (Spam / Không hợp lệ)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú xử lý (Nội bộ)</label>
            <textarea
              rows={4}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Ghi chú lại quá trình làm việc với khách hàng..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>

          {feedback.processedAt && (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              Cập nhật lần cuối vào: <b>{new Date(feedback.processedAt).toLocaleString('vi-VN')}</b> bởi <b>{feedback.resolvedBy}</b>
            </div>
          )}

          <button
            onClick={handleUpdateStatus}
            disabled={processing}
            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400"
          >
            {processing ? 'Đang lưu...' : 'Lưu cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
}
