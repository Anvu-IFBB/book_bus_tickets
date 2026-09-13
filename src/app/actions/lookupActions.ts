/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getActiveRepositoryMode } from '@/repositories';
import { bookingService } from '@/services/bookingService';
import { Booking, BookingStatus } from '@/types/booking';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { normalizePhone } from '@/lib/utils/formatters';
import { docToEntity } from '@/repositories/firestore/helpers';
import { z } from 'zod';
import { handleActionError } from '@/lib/server/action-error';

// Helper type that represents the safe shape
export type PublicBookingSummary = Partial<Booking> & {
  id: string;
  bookingCode: string;
  serviceType: string;
  departure: string;
  destination: string;
  bookingStatus: BookingStatus;
  paymentStatus: string;
};

function sanitizePublicBooking(booking: Booking): PublicBookingSummary {
  // EXPLICIT MAPPING (Whitelist) - Prevent Data Leakage
  const safeBooking: PublicBookingSummary = {
    id: booking.id,
    bookingCode: booking.bookingCode,
    serviceType: booking.serviceType,
    departure: booking.departure,
    destination: booking.destination,
    travelDate: booking.travelDate,
    travelTime: booking.travelTime,
    returnDate: booking.returnDate,
    isRoundTrip: booking.isRoundTrip,
    passengerCount: booking.passengerCount,
    pickupAddress: booking.pickupAddress,
    dropoffAddress: booking.dropoffAddress,
    vehicleType: booking.vehicleType,
    price: booking.price,
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };

  // Only copy specific nested objects if they exist
  if (booking.cargoDetails) {
    safeBooking.cargoDetails = {
      senderName: booking.cargoDetails.senderName,
      senderPhone: booking.cargoDetails.senderPhone,
      receiverName: booking.cargoDetails.receiverName,
      receiverPhone: booking.cargoDetails.receiverPhone,
      pickupPoint: booking.cargoDetails.pickupPoint,
      dropoffPoint: booking.cargoDetails.dropoffPoint,
      cargoType: booking.cargoDetails.cargoType,
      quantity: booking.cargoDetails.quantity,
      estimatedWeightKg: booking.cargoDetails.estimatedWeightKg,
    };
  }

  if (booking.contractDetails) {
    safeBooking.contractDetails = {
      seatCount: booking.contractDetails.seatCount,
      durationDays: booking.contractDetails.durationDays,
      specialRequests: booking.contractDetails.specialRequests,
    };
  }

  if (booking.tourDetails) {
    safeBooking.tourDetails = {
      tourDestination: booking.tourDetails.tourDestination,
      returnDate: booking.tourDetails.returnDate,
      specialRequests: booking.tourDetails.specialRequests,
    };
  }

  // Sanitize statusHistory to mask internal actors
  if (booking.statusHistory && Array.isArray(booking.statusHistory)) {
    safeBooking.statusHistory = booking.statusHistory.map(history => ({
      status: history.status,
      changedAt: history.changedAt,
      note: history.note,
      // Do not expose raw internal email
      changedBy: history.changedBy.includes('@') ? 'SYSTEM_ADMIN' : history.changedBy
    }));
  }

  return safeBooking;
}

export async function lookupBookingAction(code: string, phone: string): Promise<{ success: boolean; data?: PublicBookingSummary; error?: string }> {
  try {
    const parsed = z.object({
      code: z.string().min(1),
      phone: z.string().min(1),
    }).safeParse({ code, phone });
    
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      return { success: false, error: 'Số điện thoại không hợp lệ' };
    }

    if (!code || code.trim().length === 0) {
      return { success: false, error: 'Vui lòng nhập mã đơn hàng' };
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Chế độ Memory (Test Mode)
    if (getActiveRepositoryMode() === 'memory') {
      const result = await bookingService.lookupBooking(cleanCode, cleanPhone);
      if (result) return { success: true, data: sanitizePublicBooking(result) };
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    // 2. Chế độ Firestore Production
    const db = getAdminFirestore();
    if (!db) {
      throw new Error('Firebase Admin SDK không khả dụng');
    }

    // Sử dụng Admin SDK để Query (Bypass firestore.rules)
    const bookingsRef = db.collection('bookings');
    const q = bookingsRef.where('bookingCode', '==', cleanCode).limit(1);
    
    const snapshot = await q.get();
    if (snapshot.empty) {
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    const bookingDoc = snapshot.docs[0];
    // Cast qua helper để format Timestamp thành ISO string
    const booking = docToEntity<Booking>(bookingDoc as any);
    if (!booking) {
      return { success: false, error: 'Dữ liệu đơn hàng không hợp lệ' };
    }

    // Kiểm tra bảo mật (Quyền tra cứu public: trùng SĐT khách hoặc người gửi/nhận)
    let hasAccess = false;

    if (booking.cargoDetails) {
      const sender = normalizePhone(booking.cargoDetails.senderPhone);
      const receiver = normalizePhone(booking.cargoDetails.receiverPhone);
      if (sender === cleanPhone || receiver === cleanPhone) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      // Phải nạp customer để kiểm tra SĐT
      const customerDoc = await db.collection('customers').doc(booking.customerId).get();
      if (customerDoc.exists) {
        const customerPhone = normalizePhone(customerDoc.data()?.phone || '');
        if (customerPhone === cleanPhone) {
          hasAccess = true;
        }
      }
    }

    if (!hasAccess) {
      return { success: false, error: 'Không tìm thấy đơn hàng (Sai số điện thoại)' };
    }

    // Sanitize data (Loại bỏ các thông tin nội bộ)
    return { success: true, data: sanitizePublicBooking(booking) };

  } catch (error: unknown) {
    return handleActionError(error, 'lookupBookingAction');
  }
}
