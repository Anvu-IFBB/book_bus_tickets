'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitFeedbackAction } from '@/app/actions/feedbackActions';
import { FeedbackRating } from '@/types/feedback';

export default function FeedbackPage({ params }: { params: { bookingCode: string } }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }
    if (phone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    const res = await submitFeedbackAction({
      bookingCode: params.bookingCode,
      customerPhone: phone,
      rating: rating as FeedbackRating,
      content: comment,
    });

    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Đã có lỗi xảy ra');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</h2>
          <p className="text-gray-600 mb-6">Đánh giá của bạn đã được ghi nhận. Chúc bạn một ngày tốt lành!</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Đánh giá chuyến đi</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã chuyến đi
              </label>
              <input
                type="text"
                disabled
                value={params.bookingCode}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại đặt vé <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Chất lượng dịch vụ <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                      } transition-colors`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét thêm (Tùy chọn)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Chia sẻ trải nghiệm của bạn với chúng tôi..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
