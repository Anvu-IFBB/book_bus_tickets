'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/components/admin/admin-auth-context';
import { getInvoiceByIdAction } from '@/app/actions/invoiceQueries';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function AdminInvoiceDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, canManageInvoices, isLoading: isAuthLoading } = useAdminAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !canManageInvoices) return;
    
    getInvoiceByIdAction(params.id)
      .then(res => setInvoice(res))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params.id, isAuthenticated, canManageInvoices]);

  if (isAuthLoading || isLoading) return <div className="p-8">Đang tải...</div>;
  if (!isAuthenticated) return <div className="p-8 text-red-500">Bạn chưa đăng nhập.</div>;
  if (!canManageInvoices) return <div className="p-8 text-red-500">Bạn không có quyền xem trang này.</div>;
  if (!invoice) return <div className="p-8 text-slate-500">Không tìm thấy hóa đơn.</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between no-print">
        <Link href={`/admin/payments/${invoice.paymentId}`}>
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Về Chi Tiết Thanh Toán
          </Button>
        </Link>
        <Button 
          variant="primary" 
          size="sm" 
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          In Hóa Đơn
        </Button>
      </div>

      <div className="bg-white p-8 sm:p-12 border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
        <div className="flex justify-between items-start border-b pb-6 mb-6 border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-navy-900 tracking-tight">HÓA ĐƠN</h1>
            <p className="text-sm text-slate-500 mt-1">Hóa Đơn Dịch Vụ</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-lg text-slate-800">LIMOUSINE EXPRESS</h2>
            <p className="text-sm text-slate-500">Mã Hóa Đơn: <span className="font-medium text-slate-900">{invoice.id}</span></p>
            <p className="text-sm text-slate-500">Ngày Xuất: {new Date(invoice.issuedAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông Tin Khách Hàng</h3>
            <p className="font-bold text-slate-800">{invoice.customerName}</p>
            <p className="text-sm text-slate-600">{invoice.customerPhone}</p>
            {invoice.customerEmail && <p className="text-sm text-slate-600">{invoice.customerEmail}</p>}
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tham Chiếu</h3>
            <p className="text-sm text-slate-600">Mã Booking: <span className="font-medium text-slate-900">{invoice.bookingCode}</span></p>
            <p className="text-sm text-slate-600">Dịch Vụ: {invoice.service}</p>
          </div>
        </div>

        <table className="w-full text-left text-sm mb-8">
          <thead className="bg-slate-50 border-y border-slate-200">
            <tr>
              <th className="py-3 px-4 font-bold text-slate-700">Mô Tả</th>
              <th className="py-3 px-4 font-bold text-slate-700 text-right">Thành Tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-4 px-4 text-slate-800">
                <p className="font-medium">{invoice.service}</p>
                {invoice.route && <p className="text-xs text-slate-500 mt-0.5">{invoice.route}</p>}
              </td>
              <td className="py-4 px-4 text-right font-medium text-slate-800">
                {invoice.subtotal.toLocaleString()} VNĐ
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/2 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tiền Hàng / Dịch Vụ:</span>
              <span className="font-medium">{invoice.subtotal.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-3 border-slate-100">
              <span className="text-slate-500">Đã Đóng Cọc:</span>
              <span className="font-medium text-slate-600">- {invoice.deposit.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-bold text-slate-800">Tổng Đã Thanh Toán:</span>
              <span className="text-lg font-black text-emerald-600">{invoice.paid.toLocaleString()} VNĐ</span>
            </div>
            {invoice.remaining > 0 && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-red-600">Còn Lại Cần Thu:</span>
                <span className="text-base font-black text-red-600">{invoice.remaining.toLocaleString()} VNĐ</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
          <p>Hóa đơn được xuất bởi {invoice.issuedBy} ({invoice.issuedByRole})</p>
        </div>
      </div>
    </div>
  );
}
