# BÁO CÁO KIỂM TOÁN DỰ ÁN - SAU PHASE 8 (PROJECT AUDIT REPORT)

## 1. Executive Summary (Tóm tắt tổng quan)
Phase 1 đến Phase 8 đã thiết lập một nền tảng vững chắc về kiến trúc (Clean / Modular Architecture). Repository Pattern và Service Layer được phân tách rất rõ ràng, mã nguồn sạch sẽ, không có lỗi TypeScript hay Linting. Tuy nhiên, khi chuyển đổi sang Production (Firestore), thiết kế hiện tại bộc lộ nhiều lỗ hổng bảo mật nghiêm trọng (Critical Security Flaws) do Business Logic đang được thực thi 100% trên Client-side. Hệ thống **CHƯA SẴN SÀNG** cho Phase 9. Các Blocker cần được giải quyết ngay lập tức.

---

## 2. Architecture Audit (Kiểm toán Kiến trúc)
- **Clean / Modular Architecture**: Chuẩn mực. Các domain được chia theo `types`, `repositories`, `services`, `components`.
- **Repository Pattern**: Nhất quán. Cả Memory và Firestore adapter đều tuân thủ các Interfaces chung. Factory pattern hoạt động hoàn hảo.
- **Service Layer Bypass**: **[CRITICAL]** Toàn bộ Service Layer (`BookingService`, `PaymentService`, `FleetService`) đều đang được gọi trực tiếp từ Client Components (`"use client"`). Điều này đồng nghĩa Business Logic chạy trên trình duyệt của người dùng. Kẻ tấn công có thể dễ dàng bypass các ràng buộc của State Machine bằng cách sử dụng Firebase Client SDK ghi thẳng vào Firestore.

---

## 3. Booking Audit
- **Booking Code Unique**: Cơ chế `getNextSequenceForDate` an toàn vì dùng Firestore Transactions.
- **Partial Transactions / Race Condition**: Việc tạo khách hàng, tạo booking, tạo payment và ghi audit log được thực hiện tuần tự bằng nhiều lệnh ghi từ Client. Nếu mạng rớt giữa chừng, sẽ sinh ra dữ liệu mồ côi (Orphan Records).
- **Public Lookup**: **[CRITICAL]** Khách hàng vãng lai không thể tra cứu Booking trên môi trường Production! Hàm `findByCodeAndPhone` dùng `query()` (tương đương lệnh `list`), nhưng `firestore.rules` lại chỉ cho phép `allow list: if isOperator()`. 

---

## 4. Payment & Invoice Audit
- **Payment State Machine**: Được thiết kế chặt chẽ trong `PaymentService`. 
- **Security Check**: Tuy nhiên, vì logic nằm ở Client, một nhân viên (Operator) có thể thay đổi payload để set `status = 'PAID'` nhưng `paidAmount = 0` hoặc can thiệp `totalAmount`. Firestore Rules hiện tại không kiểm tra tính toàn vẹn của payload (Schema Validation).
- **Invoice**: Sinh mã tự động hoạt động tốt. Giao diện có nút in ấn phù hợp.

---

## 5. Firebase & Firestore Rules Audit
- **Rule Syntax Error**: **[CRITICAL]** Dòng 44 của `firestore.rules` sử dụng `request.query.bookingCode`. Đây là cú pháp KHÔNG HỢP LỆ trong Firestore Rules (Firestore chỉ hỗ trợ `request.query.limit`, `offset`, không hỗ trợ biến where). Khi deploy, Public Users sẽ hoàn toàn bị chặn đọc dữ liệu.
- **Quota Exhaustion / Spam**:
  - `systemSequences`: `allow read, write: if true;` -> Bất kỳ ai cũng có thể phá hỏng bộ đếm sinh mã Booking.
  - `payments`: `allow create: if true;` -> Kẻ tấn công có thể spam tạo hàng triệu bản ghi rác.
- **Audit Logs**: `allow create: if isAuthenticated();` -> Mọi user đăng nhập (dù không phải Admin/Operator) đều có thể ghi log giả mạo.

---

## 6. Admin & RBAC Audit
- **Authentication**: Được bảo vệ tốt bởi `AdminAuthContext` và Next.js Middleware. Session cookie được bảo mật.
- **Authorization**: Phân quyền (`isAdmin()`, `isOperator()`) được áp dụng đúng trên `firestore.rules`.
- **Role Granularity**: Các role như STAFF, CSKH, DRIVER chưa được bảo vệ khác biệt hoàn toàn với OPERATOR ở cấp độ Database Rules (bởi vì `firestore.rules` chỉ phân tách `Admin` và `Operator`).

---

## 7. Responsive & UI Audit
- **Responsive**: Grid và Flexbox của Tailwind được sử dụng hợp lý. Không phát hiện overflow-x nghiêm trọng.
- **Empty States**: Được thiết kế chuẩn mực trên các bảng dữ liệu.

---

## 8. Code Quality & Dependency Audit
- **Duplicate Types**: Không có. Vừa được xử lý triệt để trong Phase 8.
- **Unused Imports / Code**: Sạch sẽ. (Đã qua bài kiểm tra `npm run lint`).
- **Dependencies**: Không có dependency thừa. Khuyến nghị cập nhật cảnh báo middleware `Next.js` (Middleware to Proxy) nhưng chưa phải ưu tiên.

---

## 9. Phân Loại Vấn Đề (Issues)

### CRITICAL ISSUES (Blockers)
1. **Client-side Service Execution**: Business logic chạy trên client mở ra lỗ hổng bypass hoàn toàn quy trình duyệt đơn/thanh toán.
2. **Firestore Rules Syntax & Public Lookup**: Cú pháp `request.query.bookingCode` sai. Public User không thể tìm đơn hàng.
3. **Open Write Access**: `systemSequences` public write 100%, nguy cơ phá hoại dữ liệu.

### HIGH PRIORITY ISSUES
1. **No Atomicity across Entities**: Việc ghi Booking, Customer, Payment thiếu Transaction đồng bộ trên Server.
2. **Missing Payload Validation in Rules**: Firestore Rules chỉ chặn quyền truy cập, không kiểm tra nội dung ghi (thiếu schema rules).

---

## 10. KẾT LUẬN & ĐỀ XUẤT

**PHASE 9 NOT READY.**

Trước khi tiến hành Phase 9, đội dự án BẮT BUỘC phải thực hiện một "Security & Refactoring Sprint" (tương đương Phase 8.5) với lộ trình sửa chữa như sau:

1. **Chuyển Business Logic xuống Server**: 
   - Đưa các hàm tạo Booking, Cập nhật Payment, Phân xe vào **Next.js Server Actions** hoặc **API Routes** (chạy bằng Firebase Admin SDK).
   - Đảm bảo thực thi nguyên tử (Batch Writes) khi tạo Customer + Booking + Payment.
2. **Khắc phục tra cứu Public**:
   - Sử dụng Server Action để lookup dữ liệu bằng Admin SDK, bypass giới hạn của Firestore Rules cho tác vụ tra cứu ẩn danh (Guest Lookup).
3. **Củng cố Firestore Rules**:
   - Khóa chặt `systemSequences` và `payments` (chỉ cho phép Admin SDK / Server cập nhật).
   - Xóa bỏ cú pháp `request.query` sai lệch. 
4. **Hardening**: 
   - Không truyền `actorRole` từ UI vào Service, mà Server phải tự trích xuất role từ Session Token để đảm bảo tính xác thực.

Sau khi khắc phục xong các Blocker trên, dự án sẽ đạt chuẩn `PRODUCTION READY` thực sự và sẵn sàng triển khai Phase 9.
