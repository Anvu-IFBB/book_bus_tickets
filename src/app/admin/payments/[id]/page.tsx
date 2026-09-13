'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/admin/admin-auth-context';
import { getPaymentByIdAction } from '@/app/actions/paymentQueries';
import { Payment } from '@/types/payment';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { CheckCircle2, RotateCcw, FileText, ArrowLeft } from 'lucide-react';
import { confirmDepositAction, confirmPaymentAction, refundPaymentAction } from '@/app/actions/paymentActions';
import { generateInvoiceAction } from '@/app/actions/invoiceActions';
import Link from 'next/link';

export default function AdminPaymentDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, canManagePayments, user, role, isLoading: isAuthLoading } = useAdminAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPayment = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = await getPaymentByIdAction(params.id);
      setPayment(p);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!isAuthenticated || !canManagePayments) return;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPayment();
  }, [isAuthenticated, canManagePayments, fetchPayment]);

  const handleAction = async (action: 'confirmDeposit' | 'confirmPayment' | 'refund') => {
    if (!payment || !user || !role) return;
    try {
      let res;
      if (action === 'confirmDeposit') {
        res = await confirmDepositAction(payment.id);
      } else if (action === 'confirmPayment') {
        res = await confirmPaymentAction(payment.id);
      } else if (action === 'refund') {
        res = await refundPaymentAction(payment.id, 'Admin thực hiện hoàn tiền');
      }
      if (res && !res.success) {
        alert(res.error || 'Đã xảy ra lỗi');
      } else {
        await fetchPayment();
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleCreateInvoice = async () => {
    if (!payment || !user || !role) return;
    try {
      const res = await generateInvoiceAction(payment.id);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      router.push(`/admin/invoices/${res.data.id}`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (isAuthLoading || isLoading) return <div className="p-8">Đang tải...</div>;
  if (!isAuthenticated) return <div className="p-8 text-red-500">Bạn chưa đăng nhập.</div>;
  if (!canManagePayments) return <div className="p-8 text-red-500">Bạn không có quyền xem trang này.</div>;
  if (!payment) return <div className="p-8 text-slate-500">Không tìm thấy thông tin thanh toán.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/payments">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Trở Về
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-navy-950">Chi Tiết Thanh Toán {payment.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Thông Tin Giao Dịch</h3>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Mã Booking:</span>
              <span className="font-bold text-navy-900">{payment.bookingCode}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Trạng Thái:</span>
              <Badge variant={
                payment.status === 'PAID' ? 'success' :
                payment.status === 'DEPOSITED' ? 'warning' :
                payment.status === 'PENDING' ? 'navy' : 'danger'
              }>
                {payment.status}
              </Badge>
            </div>
            
            <div className="pt-2 border-t space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Tổng Tiền:</span>
                <span className="font-bold">{payment.totalAmount.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Cọc Yêu Cầu:</span>
                <span>{payment.depositAmount.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Đã Thanh Toán:</span>
                <span className="text-emerald-600 font-bold">{payment.paidAmount.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Còn Lại:</span>
                <span className="text-red-600 font-bold">{payment.remainingAmount.toLocaleString()} VNĐ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Thao Tác Admin</h3>
            
            <div className="space-y-3">
              {(payment.status === 'PENDING' || payment.status === 'FAILED') && (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => handleAction('confirmDeposit')}
                  className="!justify-start"
                  leftIcon={<CheckCircle2 className="w-5 h-5 text-gold-500" />}
                >
                  Xác nhận khách đã cọc
                </Button>
              )}
              
              {(payment.status === 'PENDING' || payment.status === 'DEPOSITED' || payment.status === 'FAILED') && (
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={() => handleAction('confirmPayment')}
                  className="!justify-start"
                  leftIcon={<CheckCircle2 className="w-5 h-5" />}
                >
                  Xác nhận khách thanh toán đủ
                </Button>
              )}

              {(payment.status === 'DEPOSITED' || payment.status === 'PAID') && (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => handleAction('refund')}
                  className="!justify-start text-red-600 border-red-200 hover:bg-red-50"
                  leftIcon={<RotateCcw className="w-5 h-5" />}
                >
                  Hoàn tiền (Hủy giao dịch)
                </Button>
              )}

              {(payment.status === 'DEPOSITED' || payment.status === 'PAID') && (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={handleCreateInvoice}
                  className="!justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  leftIcon={<FileText className="w-5 h-5" />}
                >
                  Tạo / Xem Hóa Đơn
                </Button>
              )}
            </div>
            
            {payment.confirmedBy && (
              <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p><strong>Cập nhật cuối bởi:</strong> {payment.confirmedBy}</p>
                <p><strong>Lúc:</strong> {payment.paidAt ? new Date(payment.paidAt).toLocaleString('vi-VN') : '-'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
