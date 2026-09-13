# PHASE 8.5 SECURITY AUDIT REPORT

## 1. Tóm tắt quá trình Audit
Dự án được phân tích toàn diện nhằm đánh giá bảo mật trước khi bước sang Phase 9. Việc phát hiện `"use client"` gọi trực tiếp các Service (`bookingService`, `paymentService`, `operationsService`, v.v.) cho thấy Business Logic quan trọng đang chạy hoàn toàn trên Client-side. Mặc dù `firestore.rules` có kiểm tra Role, nhưng nó không kiểm tra tính hợp lệ của Payload, cho phép Attacker dễ dàng bypass State Machine. 

Dưới đây là danh sách chi tiết các vấn đề bảo mật và kế hoạch sửa đổi.

---

## 2. Chi tiết các lổ hổng bảo mật (Vulnerabilities)

### A. Public Booking Creation (Tạo đơn hàng)
- **File**: `src/app/dat-xe/dat-xe-client.tsx`, `src/services/bookingService.ts`, `src/services/paymentService.ts`
- **Function**: `createBooking()`, `createPaymentRequest()`
- **Client/Server**: Client
- **Risk**: **HIGH**
- **Vấn đề**: Các thực thể Customer, Booking, Payment, AuditLog được ghi tuần tự bằng Firebase Client SDK. Thiếu tính nguyên tử (Atomicity). `systemSequences` bị mở `allow read, write: if true;` trên Firestore Rules.
- **Attack Scenario**: Kẻ tấn công ghi đè `systemSequences` làm sập hệ thống sinh mã; hoặc rớt mạng gây ra dữ liệu mồ côi (chỉ có Customer, không có Booking).
- **Proposed Fix**: Tạo Server Action `createBookingAction(data)`. Server sử dụng Firebase Admin SDK (bỏ qua rules client) để chạy một Firestore Transaction nguyên tử tạo tất cả dữ liệu cùng lúc.
- **Migration Impact**: Trung bình. Cần chuyển logic sinh mã và state machine sang Server.
- **Regression Risk**: Trung bình (Cần đảm bảo đúng format mã BK/HG).

### B. Public Booking Lookup (Tra cứu đơn hàng)
- **File**: `src/app/tra-cuu/page.tsx`, `src/repositories/firestore/bookingRepository.ts`
- **Function**: `lookupBooking()`, `findByCodeAndPhone()`
- **Client/Server**: Client
- **Risk**: **CRITICAL**
- **Vấn đề**: `firestore.rules` cấm Public User dùng lệnh `list`, nhưng `findByCodeAndPhone` lại sử dụng `query(..., where(...))` (bản chất là list). Cú pháp `request.query.bookingCode` trong rules là sai hoàn toàn. Khách hàng thực tế không thể tra cứu đơn hàng trên Production.
- **Attack Scenario**: Tính năng tra cứu tê liệt. Nếu mở rule, Attacker có thể scrape toàn bộ đơn hàng.
- **Proposed Fix**: Tạo Server Action `lookupBookingAction(bookingCode, phone)`. Server dùng Firebase Admin SDK query database, đối chiếu SĐT, trả về DTO ẩn thông tin nhạy cảm.
- **Migration Impact**: Thấp.
- **Regression Risk**: Thấp.

### C. Admin Booking Operations (Điều phối đơn hàng & Phân xe)
- **File**: `src/app/admin/bookings/[id]/page.tsx`, `src/services/operationsService.ts`
- **Function**: `updateBookingStatus()`, `assignVehicle()`, `assignDriver()`, `unassignVehicle()`, `unassignDriver()`
- **Client/Server**: Client
- **Risk**: **CRITICAL**
- **Vấn đề**: Client truyền trực tiếp `actorRole` và trạng thái mới cho Service. Attacker (OPERATOR) có thể gọi Firebase SDK bỏ qua `operationsService` để ép phân một chiếc xe đang bảo dưỡng (MAINTENANCE).
- **Attack Scenario**: Gán xe/tài xế không khả dụng. Chuyển trạng thái nhảy cóc (NEW -> COMPLETED).
- **Proposed Fix**: Tạo Server Actions cho các tác vụ điều phối. Server phải tự verify session, lấy Role, kiểm tra xe/tài xế trong database, sau đó mới Admin SDK update.
- **Migration Impact**: Trung bình.
- **Regression Risk**: Trung bình.

### D. Payment Confirmations (Quản lý thanh toán & Hoàn tiền)
- **File**: `src/app/admin/payments/[id]/page.tsx`, `src/services/paymentService.ts`
- **Function**: `confirmDeposit()`, `confirmPayment()`, `refundPayment()`
- **Client/Server**: Client
- **Risk**: **CRITICAL**
- **Vấn đề**: Payload thanh toán (số tiền cọc, số tiền thanh toán, số tiền còn lại) được tính ở Client. Attacker có thể sửa đổi payload để đánh dấu `PAID` mà `paidAmount = 0`.
- **Attack Scenario**: Gian lận tài chính, thay đổi công nợ trái phép.
- **Proposed Fix**: Tạo Server Action `confirmPaymentAction(paymentId, action)`. Server tự động tính toán số tiền `depositAmount`, `totalAmount` từ database thay vì nhận từ Client.
- **Migration Impact**: Trung bình.
- **Regression Risk**: Cao (Cần test kỹ số tiền).

### E. Invoice Generation (Tạo Hóa Đơn)
- **File**: `src/app/admin/payments/[id]/page.tsx`, `src/services/invoiceService.ts`
- **Function**: `generateInvoice()`
- **Client/Server**: Client
- **Risk**: **HIGH**
- **Vấn đề**: Tương tự Payment, tổng tiền trên hóa đơn đang được tạo theo payload từ Client.
- **Proposed Fix**: Server Action `generateInvoiceAction(paymentId)`.

### F. Audit Logs (Nhật ký hệ thống)
- **File**: Tất cả các files Service
- **Function**: `createAuditLog()`
- **Client/Server**: Client
- **Risk**: **CRITICAL**
- **Vấn đề**: Khách hàng, tài xế, hoặc nhân viên đều có thể tự truyền `actorRole` và nội dung ghi log giả mạo.
- **Proposed Fix**: Di chuyển việc ghi Log vào trong các Server Action tương ứng. Server tự động lấy UID, Email và Role từ Session. `firestore.rules` khóa 100% Write trên `auditLogs` từ Client.

### G. Firestore Rules & Abuse Prevention
- **File**: `firestore.rules`
- **Vấn đề**: 
  - `request.query.bookingCode` bị dùng sai cú pháp.
  - `systemSequences`: `allow read, write: if true;`
  - `payments`: `allow create: if true;`
  - `auditLogs`: `allow create: if isAuthenticated();`
- **Proposed Fix**: Cập nhật `firestore.rules`. Khóa chặt (DENY) các rule này từ phía Client. Mọi hành động Create/Update bắt buộc phải đi qua Server Actions.

---

## 3. Lộ Trình Triển Khai PHASE 8.5 (Đề xuất)

- **PHASE B**: Server Auth Core (Thiết lập các hàm Server xử lý Firebase Session Cookie, RBAC).
- **PHASE C**: Booking Server Migration (Server Actions tạo booking + giao dịch nguyên tử).
- **PHASE D**: Public Lookup (Server Actions tra cứu đơn hàng an toàn).
- **PHASE E**: Payment Server Migration (Bảo vệ tính toàn vẹn tài chính).
- **PHASE F**: Fleet Server Migration (Server Actions điều phối xe cộ).
- **PHASE G**: Invoice Server Migration (Server Actions tạo hóa đơn).
- **PHASE H & I**: Audit Log & Firestore Rules Hardening (Khóa chặt quyền ghi).
- **PHASE J**: RBAC Hardening (Phân quyền Server-side chi tiết).
- **PHASE K, L, M**: Viết kịch bản Test bảo mật (`test-phase8.5.ts`), Kiểm thử hồi quy, Chạy Production Build.
