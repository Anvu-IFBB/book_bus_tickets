'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/components/admin/admin-auth-context';
import { listPaymentsAction } from '@/app/actions/paymentQueries';
import { Payment } from '@/types/payment';
import { Badge, Button } from '@/components/ui';
import { Eye } from 'lucide-react';

export default function AdminPaymentsPage() {
  const { isAuthenticated, canManagePayments, isLoading: isAuthLoading } = useAdminAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !canManagePayments) return;
    
    listPaymentsAction()
      .then(res => setPayments(res))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, canManagePayments]);

  if (isAuthLoading || isLoading) return <div className="p-8">Đang tải...</div>;
  if (!isAuthenticated) return <div className="p-8 text-red-500">Bạn chưa đăng nhập.</div>;
  if (!canManagePayments) return <div className="p-8 text-red-500">Bạn không có quyền xem trang này.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-950">Quản Lý Thanh Toán</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Mã Booking</th>
                <th className="px-4 py-3 font-medium">Khách Hàng</th>
                <th className="px-4 py-3 font-medium text-right">Tổng Tiền</th>
                <th className="px-4 py-3 font-medium text-right">Đã Thanh Toán</th>
                <th className="px-4 py-3 font-medium">Trạng Thái</th>
                <th className="px-4 py-3 font-medium">Ngày Tạo</th>
                <th className="px-4 py-3 font-medium">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Không có dữ liệu thanh toán
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{payment.bookingCode}</td>
                    <td className="px-4 py-3">{payment.customerId}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {payment.totalAmount.toLocaleString()} đ
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold">
                      {payment.paidAmount.toLocaleString()} đ
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        payment.status === 'PAID' ? 'success' :
                        payment.status === 'DEPOSITED' ? 'warning' :
                        payment.status === 'PENDING' ? 'navy' : 'danger'
                      }>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(payment.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/payments/${payment.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                          Chi Tiết
                        </Button>
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
