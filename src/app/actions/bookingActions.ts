
'use server';

import { getActiveRepositoryMode } from '@/repositories';
import { bookingService } from '@/services/bookingService';
import { CreateBookingDTO, Booking, BookingStatusHistoryItem, BookingStatus } from '@/types/booking';
import { Customer } from '@/types/customer';
import { Payment } from '@/types/payment';
import { AuditLog } from '@/types/automation';
import { normalizePhone } from '@/lib/utils/formatters';
import { generateBookingCode, generateCargoCode } from '@/lib/utils/codeGenerator';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { createBookingDTOSchema, updateBookingStatusSchema } from '@/lib/validation/bookingSchema';
import { handleActionError } from '@/lib/server/action-error';
export async function createBookingAction(dto: CreateBookingDTO): Promise<{ success: boolean; data?: Booking; error?: string }> {
  try {
    const parsedDTO = createBookingDTOSchema.safeParse(dto);
    if (!parsedDTO.success) {
      return { success: false, error: 'Dữ liệu không hợp lệ' };
    }

    const cleanPhone = normalizePhone(dto.customerPhone);
    if (!cleanPhone) {
      return { success: false, error: 'Số điện thoại không hợp lệ' };
    }

    if (!dto.customerName || dto.customerName.trim().length === 0) {
      return { success: false, error: 'Vui lòng nhập tên khách hàng' };
    }

    // Nếu chạy Memory Mode phục vụ Test, fallback về Client Service logic (nhưng chạy trên Server)
    if (getActiveRepositoryMode() === 'memory') {
      const saved = await bookingService.createBooking(dto);
      return { success: true, data: saved };
    }

    // Chế độ Production Firestore: Dùng Admin SDK Batch / Transaction để đảm bảo tính nguyên tử
    const db = getAdminFirestore();
    if (!db) {
      throw new Error('Firebase Admin SDK không khả dụng');
    }

    const nowIso = new Date().toISOString();
    const todayYmd = nowIso.slice(0, 10).replace(/-/g, '');

    // Thực thi nguyên tử
    const result = await db.runTransaction(async (transaction) => {
      // 1. Tìm hoặc tạo Customer
      const customersRef = db.collection('customers');
      const customerQuery = await transaction.get(customersRef.where('phone', '==', cleanPhone).limit(1));
      
      let customerData: Customer;
      let customerRef: FirebaseFirestore.DocumentReference;

      if (!customerQuery.empty) {
        customerRef = customerQuery.docs[0].ref;
        customerData = customerQuery.docs[0].data() as Customer;
        // Tăng stats
        transaction.update(customerRef, {
          totalBookings: (customerData.totalBookings || 0) + 1,
          updatedAt: nowIso
        });
      } else {
        const newId = `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        customerRef = customersRef.doc(newId);
        customerData = {
          id: newId,
          name: dto.customerName.trim(),
          phone: cleanPhone,
          email: dto.customerEmail?.trim(),
          address: dto.pickupAddress,
          totalBookings: 1,
          completedBookings: 0,
          cancelledBookings: 0,
          totalSpent: 0,
          favoritePickupAddress: dto.pickupAddress,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        transaction.set(customerRef, customerData);
      }

      // 2. Sinh mã Booking an toàn (Sequence)
      const seqRef = db.collection('systemSequences').doc(`daily_${todayYmd}`);
      const seqDoc = await transaction.get(seqRef);
      
      let seq = 1;
      if (seqDoc.exists) {
        seq = (seqDoc.data()?.currentSequence || 0) + 1;
        transaction.update(seqRef, { currentSequence: seq, updatedAt: nowIso });
      } else {
        transaction.set(seqRef, { dateStr: todayYmd, currentSequence: 1, updatedAt: nowIso });
      }

      const bookingCode = dto.serviceType === 'CARGO' 
        ? generateCargoCode(new Date(), seq) 
        : generateBookingCode(new Date(), seq);

      // 3. Tạo Booking
      const bookingId = `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const bookingRef = db.collection('bookings').doc(bookingId);
      
      const initialHistory: BookingStatusHistoryItem = {
        status: 'NEW',
        changedAt: nowIso,
        changedBy: 'CUSTOMER',
        note: 'Khách gửi yêu cầu từ website',
      };

      const bookingData: Booking = {
        id: bookingId,
        bookingCode,
        customerId: customerData.id,
        serviceType: dto.serviceType,
        departure: dto.departure,
        destination: dto.destination,
        travelDate: dto.travelDate,
        travelTime: dto.travelTime,
        returnDate: dto.returnDate,
        isRoundTrip: dto.isRoundTrip || false,
        passengerCount: dto.passengerCount || 1,
        pickupAddress: dto.pickupAddress,
        dropoffAddress: dto.dropoffAddress,
        vehicleType: dto.vehicleType,
        price: 0, // Admin sẽ xác nhận
        deposit: 0,
        paymentStatus: 'UNPAID',
        bookingStatus: 'NEW',
        note: dto.note,
        cargoDetails: dto.cargoDetails,
        contractDetails: dto.contractDetails,
        tourDetails: dto.tourDetails,
        statusHistory: [initialHistory],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      transaction.set(bookingRef, bookingData);

      // 4. Tạo Payment (UNPAID/PENDING)
      const paymentId = `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const paymentRef = db.collection('payments').doc(paymentId);
      const paymentData: Payment = {
        id: paymentId,
        bookingId: bookingData.id,
        bookingCode: bookingData.bookingCode,
        customerId: customerData.id,
        status: 'PENDING',
        totalAmount: 0,
        paidAmount: 0,
        depositAmount: 0,
        remainingAmount: 0,
        paymentMethod: 'BANK_TRANSFER',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      transaction.set(paymentRef, paymentData);

      // 5. Ghi Audit Log
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      const auditData: AuditLog = {
        id: auditLogId,
        userId: customerData.id,
        userEmail: customerData.email || customerData.phone,
        actorRole: 'CUSTOMER', // Khách vãng lai tự tạo
        action: 'BOOKING_CREATED',
        entityType: 'BOOKING',
        entityId: bookingData.id,
        toState: 'NEW',
        metadata: { bookingCode: bookingData.bookingCode, serviceType: bookingData.serviceType },
        createdAt: nowIso,
      };

      transaction.set(auditRef, auditData);

      return bookingData;
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    return handleActionError(error, 'createBookingAction');
  }
}

export async function updateBookingStatusAction(bookingId: string, newStatus: BookingStatus, note?: string): Promise<{ success: boolean; data?: Booking; error?: string }> {
  try {
    const parsed = updateBookingStatusSchema.safeParse({ bookingId, newStatus, note });
    if (!parsed.success) {
      return { success: false, error: 'Dữ liệu không hợp lệ' };
    }

    const { requirePermission } = await import('@/lib/server/auth/requireAuth');
    const { Permissions } = await import('@/lib/server/auth/permissions');
    const user = await requirePermission(Permissions.canManageBookings);

    if (getActiveRepositoryMode() === 'memory') {
      const updated = await bookingService.updateStatus(bookingId, newStatus, user.email, note, user.role);
      return { success: true, data: updated };
    }

    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK khng kh? d?ng');

    const result = await db.runTransaction(async (transaction) => {
      const bookingRef = db.collection('bookings').doc(bookingId);
      const bookingDoc = await transaction.get(bookingRef);
      if (!bookingDoc.exists) throw new Error('Khng tm th?y don d?t ch?');
      
      const booking = bookingDoc.data() as Booking;

      const nowIso = new Date().toISOString();
      const historyItem = {
        status: newStatus,
        changedAt: nowIso,
        changedBy: user.email,
        note: note || `Chuyển trạng thái sang ${newStatus}`,
      };

      const updates: Partial<Booking> = {
        bookingStatus: newStatus,
        statusHistory: [...(booking.statusHistory || []), historyItem],
        updatedAt: nowIso,
      };

      transaction.update(bookingRef, updates);

      // Audit Log
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'BOOKING_STATUS_UPDATED',
        entityType: 'BOOKING',
        entityId: bookingId,
        fromState: booking.bookingStatus,
        toState: newStatus,
        createdAt: nowIso,
      });

      return { ...booking, ...updates } as Booking;
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    return handleActionError(error, 'updateBookingStatusAction');
  }
}

