# NHẬT KÝ THAY ĐỔI DỰ ÁN (CHANGELOG)
**Hệ thống Booking & Quản lý Dịch vụ Limousine Quảng Ninh - Ninh Bình**

Toàn bộ các mốc phát triển, tính năng mới và các bản sửa đổi quan trọng được ghi nhận chi tiết theo từng phiên bản và giai đoạn.

## [Phase 8: Payments & Deposits] - 11/09/2026

### Thêm Mới (Added):
- **Domain Types (`src/types/payment.ts`, `src/types/invoice.ts`)**: Mở rộng để lưu trữ thông tin giao dịch tài chính (totalAmount, depositAmount, paidAmount, remainingAmount), thông tin xuất hóa đơn và mã tham chiếu.
- **System Settings (`src/types/automation.ts`)**: Thêm cấu hình ngân hàng (bankCode, bankAccountNumber, bankAccountName) vào SystemSettings.
- **Repository Layer**: Thêm `IPaymentRepository` & `IInvoiceRepository`. Triển khai MemoryAdapter và FirestoreAdapter. Tích hợp linh hoạt vào RepositoryFactory.
- **Service Layer**: Thêm `paymentService.ts` và `invoiceService.ts` với đầy đủ logic kiểm soát thanh toán và xuất hóa đơn.
- **Client UI (Public)**: Nâng cấp component `Step5Success` để fetch thông tin Payment và thiết lập ngân hàng, hiển thị mã QR thanh toán (VietQR).
- **Admin UI (Dashboard)**:
  - Cập nhật Authentication Context phân quyền nâng cao cho Payments & Invoices.
  - Thêm trang Quản lý Danh sách Thanh Toán (`/admin/payments`).
  - Thêm trang Chi Tiết Thanh Toán (`/admin/payments/[id]`).
  - Thêm trang Chi Tiết & In Hóa Đơn (`/admin/invoices/[id]`).
- **Bảo mật**: Cập nhật `firestore.rules` khóa truy cập công khai vào collections `payments` và `invoices`.
- **Kiểm thử tự động**: Viết test script (`src/lib/test-phase8.ts`) thực thi và kiểm định luồng thanh toán hoàn hảo.

## [Phase 7: Admin Dashboard & Booking Operations] - 11/09/2026

### Thêm Mới (Added):
- **Bảng Điều Khiển Vận Hành Thực Tế (`/admin`):**
  - Tính toán 8 chỉ số KPI thời gian thực trực tiếp từ Service Layer: Tổng đơn hôm nay, Cần liên hệ (`NEW`), Đã liên hệ (`CONTACTING`), Đã chốt (`CONFIRMED`), Đã phân xe (`ASSIGNED`), Đang chạy (`IN_PROGRESS`), Hoàn thành (`COMPLETED`), Đã hủy (`CANCELLED`).
  - Banner Doanh thu thực tế (VNĐ) tính từ các đơn đã xác nhận / đang chạy / hoàn thành.
  - Cảnh báo vận hành đội xe & tài xế tức thì: Tự động phát hiện phương tiện đang bảo dưỡng (`MAINTENANCE`) và tài xế đang nghỉ ca (`OFF`).
  - Danh sách đơn cần xử lý gấp lọc các đơn `NEW` và `CONTACTING` kèm thời gian di chuyển sắp tới.
  - Danh sách các chuyến xe khởi hành hôm nay và trạng thái xuất bến.
  - Giao diện Empty State chuẩn mực khi hệ thống chưa có dữ liệu (không hiển thị số liệu giả).
- **Màn Hình Quản Lý Booking Danh Sách (`/admin/bookings`):**
  - Tìm kiếm đa trường không phân biệt hoa thường: theo Mã đơn (`BK...`/`HG...`), Số điện thoại khách hàng, Tên khách hàng, hoặc Người gửi/nhận hàng.
  - Bộ lọc đa tiêu chí linh hoạt: Lọc trạng thái (8 trạng thái), Lọc loại hình dịch vụ (4 loại), Lọc tuyến đường di chuyển, Lọc theo ngày khởi hành.
  - Cơ chế phân trang 10 đơn/trang với bộ chuyển trang trực quan và lựa chọn sắp xếp (Mới nhất, Cũ nhất, Ngày đi sớm nhất).
  - Bảng dữ liệu Desktop đầy đủ thông tin kèm trạng thái thanh toán (`PaymentStatusBadge`).
  - Layout Card cho Mobile đáp ứng chuẩn chống tràn ngang (`scrollWidth <= clientWidth`).
- **Trang Chi Tiết Booking Chuyên Sâu (`/admin/bookings/[id]`):**
  - Hiển thị đầy đủ thông tin đặt chỗ, thông tin khách hàng CRM, thông tin kiện hàng hoặc dòng xe hợp đồng.
  - Quản lý tài chính: Giá vé, phụ phí, tiền cọc, tổng tiền và trạng thái thanh toán.
  - Thông tin phân xe & tài xế phụ trách.
  - Luân chuyển trạng thái qua State Machine actions (`CONTACTING`, `CONFIRMED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
  - Timeline trực quan ghi nhận toàn bộ lịch sử trạng thái (`statusHistory`).
- **Mở Rộng Service Layer & Dữ Liệu Vận Hành (`src/services/operationsService.ts`):**
  - Cung cấp `getOperationsSummary()` tổng hợp dữ liệu thời gian thực.
  - Cung cấp `listBookingsWithDetails()` hỗ trợ tìm kiếm, lọc, phân trang và enrich thông tin khách hàng, xe, tài xế.
  - Cung cấp `getBookingDetailsWithEnrichment()`.
  - Cập nhật các hàm thay đổi trạng thái và phân công chấp nhận `actorRole` và ghi vào `AuditLog`.
- **Phân Quyền RBAC & Quản Lý Phiên (`src/components/admin/admin-auth-context.tsx`):**
  - `AdminAuthProvider` & `useAdminAuth` hook quản lý session người dùng, vai trò (`role`) và phân quyền thao tác (`canManageBookings`, `canAssignFleet`, `canModifySettings`, `canDeleteData`).
  - Hiển thị thông tin người dùng động trên `AdminSidebar` và tích hợp đăng xuất.
- **Bộ Kiểm Thử Tự Động Toàn Diện (`src/lib/test-phase7.ts`):**
  - 7 nhóm kiểm thử (A: Metrics, B: Search/Filter/Pagination, C: Detail, D: State Machine, E: Assignment & Conflicts, F: RBAC, G: Audit Log) đạt 100% PASS.

---

## [Phase 6: Database + Authentication + Production Foundation] - 11/09/2026

### Thêm Mới (Added):
- **Cấu hình & Tích Hợp Firebase Foundation (`src/lib/firebase/`):**
  - Zod validation cho Client & Admin configs (`config.ts`), cung cấp `isFirebaseConfigured()` và `isFirebaseAdminConfigured()`.
  - Firebase Client App Singleton (`client.ts`) xuất `getFirebaseAuth()` và `getFirebaseFirestore()`.
  - Firebase Admin SDK Modular Singleton (`admin.ts`) phục vụ Server-side Token verification và Firestore transactions với xử lý private key newline.
  - Cập nhật `.env.example` với `REPOSITORY_MODE="memory"` và `FIREBASE_ADMIN_PROJECT_ID`.
- **Triển Khai Firestore Repositories (`src/repositories/firestore/`):**
  - `helpers.ts`: Bộ lọc `cleanUndefined` đệ quy bảo vệ Firestore khỏi lỗi `undefined value` và chuyển đổi Timestamps sang ISO strings.
  - `bookingRepository.ts`: Triển khai đầy đủ `IBookingRepository` với Firestore Transaction trên `systemSequences/daily_{YYYYMMDD}` đảm bảo sinh mã `BK...` và `HG...` tăng dần, duy nhất, không trùng lặp.
  - `customerRepository.ts`: Tự động tìm kiếm & liên kết khách hàng theo SĐT (Customer CRM Foundation), cộng dồn thống kê với `FieldValue.increment`.
  - `fleetRepository.ts`: Quản lý 4 collections (`routes`, `vehicles`, `drivers`, `trips`).
  - `feedbackRepository.ts` & `settingsRepository.ts`: Quản lý `feedbacks`, `systemSettings/general` và `auditLogs` bất biến.
- **Repository Factory Pattern (`src/repositories/index.ts`):**
  - Cơ chế chuyển đổi trong suốt giữa In-Memory và Firestore dựa trên `REPOSITORY_MODE` và cấu hình thực tế.
  - Hỗ trợ `setRepositoryModeForTesting()` cho test tự động độc lập không phụ thuộc credentials cloud.
- **Hệ Thống Xác Thực & Bảo Vệ Route (`src/middleware.ts`, `/admin/login`, `/api/auth/session`):**
  - Mở rộng phân quyền `UserRole` (`ADMIN`, `OPERATOR`, `MANAGER`, `STAFF`, `CSKH`, `ACCOUNTANT`, `DRIVER`).
  - Next.js Middleware chặn toàn bộ truy cập trái phép vào `/admin/*`, điều hướng 307 về `/admin/login?redirect=...`.
  - API Route `/api/auth/session` cấp phát HttpOnly cookie bảo mật qua Firebase Admin Token Verification (hỗ trợ Dev bypass tiện ích).
  - Màn hình đăng nhập `/admin/login` chuẩn hoàng gia (Navy `#071A2B` & Gold `#D4AF37`) với Suspense và quick login.
  - Nút Đăng Xuất (`LogOut`) trên `AdminSidebar` xóa sạch phiên làm việc.
- **Bảo Mật & Khởi Tạo Dữ Liệu:**
  - `firestore.rules`: Bộ quy tắc **Deny-by-default** bảo vệ toàn bộ collections, cấp quyền phân tầng theo Role Token (`ADMIN` vs `OPERATOR` vs Public).
  - `firebase.json`: Cấu hình deploy rules và firestore indexes.
  - `src/lib/migration/seedData.ts`: Kịch bản nạp dữ liệu mẫu ban đầu (`npm run seed:firestore`).
- **Kiểm Thử Tự Động Toàn Diện:**
  - `src/lib/test-phase6.ts` (`npm run test:phase6`): 10 nhóm kịch bản (18 kiểm thử) bao phủ 100% các tính năng.
- **Tài Liệu Nghiệm Thu:**
  - Báo cáo hoàn thiện `PHASE_6_REPORT.md` và kế hoạch `PHASE_6_IMPLEMENTATION_PLAN.md`.

---

## [Phase 5: Operations & Fleet Management] - 11/09/2026

### Thêm Mới (Added):
- **Phân Hệ Quản Trị & Vận Hành Đội Xe (`/admin`):**
  - `/admin`: Dashboard tổng quan vận hành với 4 KPI Cards (Tổng đơn hôm nay, Cần xử lý, Hoàn thành, Chuyến đang chạy), biểu đồ phân bổ trạng thái xe/tài xế, và bảng đơn mới nhất.
  - `/admin/bookings`: Màn hình điều hành đơn booking với bộ lọc 4 tiêu chí (Trạng thái, Dịch vụ, Ngày, Từ khóa tìm kiếm), bảng dữ liệu desktop & thẻ bài responsive trên mobile, hỗ trợ deep-link `?code=...`.
  - `/admin/vehicles`: Màn hình quản lý đội xe 5-29 chỗ, chức năng đổi nhanh trạng thái (Bảo dưỡng/Sẵn sàng), modal thêm xe mới có validate.
  - `/admin/drivers`: Màn hình quản lý hồ sơ tài xế, quản lý ca trực (Sẵn sàng/Nghỉ ca), modal tạo tài xế kèm số bằng lái & SĐT.
  - `/admin/trips`: Màn hình điều phối chuyến xe, trạng thái chuyến (`PLANNED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), xuất bến/hoàn thành chuyến, modal tạo chuyến mới.
- **Components Admin Chuyên Dụng (`src/components/admin/`):**
  - `AdminSidebar` & `AdminHeader`: Điều hướng nhất quán, menu mobile drawer, hiển thị thời gian thực và nút làm mới dữ liệu.
  - `BookingDetailDrawer`: Khung trượt chi tiết hiển thị khách hàng, lộ trình đón trả, timeline luân chuyển trạng thái, và các nút điều phối nhanh.
  - `AssignVehicleModal` & `AssignDriverModal`: Cửa sổ phân công tích hợp kiểm tra xung đột thời gian thực (Real-time Conflict Checking).
  - `KpiStatCard` & `StatusBadges`: Bộ hiển thị chỉ số và huy hiệu trạng thái đồng bộ toàn hệ thống.
- **Service Layer & Conflict Detection Engine:**
  - `fleetService.ts`: CRUD xe, tài xế, chuyến và bộ máy phát hiện xung đột lịch (`detectVehicleConflict`, `detectDriverConflict`) ngăn chặn double booking, kiểm tra bảo dưỡng và ngày nghỉ.
  - `operationsService.ts`: Vận hành vòng đời booking, chuyển trạng thái theo State Machine, phân công xe & tài xế, tự động ghi nhận `statusHistory` và `AuditLog`.
- **Mở Rộng Domain & Repositories:**
  - Bổ sung trạng thái `ASSIGNED` vào `BookingStatus`, mở rộng `VehicleStatus`, `DriverStatus`, `TripStatus`.
  - Bổ sung `IFleetRepository` (với `deleteVehicle`, `deleteDriver`, `deleteTrip`) và mock data chuyến khởi tạo `INITIAL_TRIPS`.
- **Kiểm Thử Tự Động & Quality Gates:**
  - Bộ kiểm thử tự động `src/lib/test-phase5.ts` (`npm run test:phase5`) với 16 kịch bản kiểm thử bao phủ 100% các tính năng.
  - Vượt qua toàn bộ kiểm thử hồi quy `test:phase1` và `test:phase4`.
  - Không có lỗi TypeScript (`tsc --noEmit`) và ESLint (`0 errors, 0 warnings`).
  - Production build thành công 17/17 static pages.
- **Tài Liệu Nghiệm Thu:**
  - Báo cáo nghiệm thu hoàn chỉnh `PHASE_5_REPORT.md`.

---

## [Phase 4: Booking Engine & Client Flow] - 11/09/2026

### Thêm Mới (Added):
- **Bộ Máy Đặt Chỗ 5 Bước Reusable (`src/components/booking/`):**
  - Step 1: Chọn dịch vụ (Limousine VIP, Thuê xe hợp đồng, Gửi hàng hỏa tốc, Xe du lịch).
  - Step 2: Nhập thông tin chuyến đi tương ứng từng dịch vụ (Chặn ngày trong quá khứ, chọn giờ, số khách/kiện).
  - Step 3: Nhập thông tin khách hàng & địa chỉ đón/trả tận nơi chi tiết (Thông tin người gửi/nhận cho hàng hóa).
  - Step 4: Kiểm tra và rà soát thông tin trước khi xác nhận đặt chỗ.
  - Step 5: Màn hình kết quả hiển thị mã booking thật (`BK...` hoặc `HG...`), nút sao chép và chuyển nhanh sang tra cứu.
- **Trang Đặt Xe Chuyên Biệt (`src/app/dat-xe/page.tsx`):**
  - Route `/dat-xe` độc lập, hỗ trợ tham số URL query (`?service=...`, `?from=...`, `?to=...`).
  - Liên kết trực tiếp từ nút Đặt vé trên Header, Mobile Drawer, Trang chủ, Dịch vụ và Tuyến đường.
- **Kiểm Thử Tự Động Toàn Diện:**
  - Bộ kiểm thử tự động `src/lib/test-phase4.ts` (`npm run test:phase4`) xác thực 100% 4 luồng dịch vụ, mã đơn, và tra cứu bảo mật.
- **Tài Liệu Nghiệm Thu:**
  - Báo cáo chi tiết `PHASE_4_REPORT.md`.

### Cải Tiến (Improved):
- Bổ sung `dateValidator` trong `bookingSchema.ts` chặn ngày khởi hành trong quá khứ.
- Chuẩn hóa logic đếm sequence trong `MemoryBookingRepository.getNextSequenceForDate` đảm bảo mỗi booking sinh mã duy nhất tăng dần.

---

## [Phase 3: Public Website] - 11/09/2026

### Thêm Mới (Added):
- **7 Public Routes hoàn chỉnh cho khách hàng thực tế:**
  - `/` (Trang Chủ): 9 sections tiêu chuẩn (Hero, 4 dịch vụ, Lộ trình chính, Vì sao chọn chúng tôi, Booking CTA Banner, Customer Reviews architecture không bịa đặt, Contact CTA).
  - `/dich-vu` (Dịch Vụ): Chi tiết 4 dịch vụ (Vé Limousine VIP, Thuê xe hợp đồng 5-29 chỗ, Nhận gửi hàng hỏa tốc, Xe đi khu du lịch), danh sách đặc quyền, tùy chọn xe, ghi chú giá cước minh bạch.
  - `/tuyen-duong` (Tuyến Đường): Trục cao tốc 5 tỉnh thành (Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình), thẻ `RouteCard`, bảng `RouteTable`, quy định đón trả.
  - `/gioi-thieu` (Giới Thiệu): Sứ mệnh, định hướng phục vụ, đội xe 5-29 chỗ, 3 trụ cột hoạt động, thông tin nhận diện chính thức.
  - `/cam-ket` (Cam Kết Chất Lượng): 6 cam kết cốt lõi, quy trình 3 bước xử lý phản hồi/khiếu nại, câu hỏi thường gặp (FAQ).
  - `/tra-cuu` (Tra Cứu Booking): Tích hợp trực tiếp `bookingService.lookupBooking`, 6 trạng thái UI rõ ràng (`idle`, `loading`, `invalid`, `notFound`, `error`, `success`).
  - `/lien-he` (Liên Hệ): Hotline chính/phụ, Chat Zalo, Facebook Vũ Công Minh, địa chỉ văn phòng và form tiếp nhận yêu cầu tư vấn nhanh.
- **Components Mới:**
  - `RouteCard` & `RouteTable` (`src/components/routes/`).
  - `ServiceCard` (`src/components/services/`).
  - `RatingStars`, `ReviewCard`, `ReviewEmptyState`, `ReviewList` (`src/components/feedback/`).
- **Nội dung & Dữ liệu chuẩn:**
  - Cấu hình dữ liệu dịch vụ, cam kết và FAQ trong `src/lib/constants/publicContent.ts`.
- **Tài liệu Nghiệm Thu:**
  - Tạo báo cáo nghiệm thu chi tiết `PHASE_3_REPORT.md`.

---

## [Phase 2: UI Foundation & Design System] - 11/09/2026

### Thêm Mới (Added):
- **Design Tokens & Theme System:**
  - Thiết lập bảng màu chuẩn nhận diện thương hiệu Hoàng gia trong Tailwind CSS v4: Primary Navy (`#071A2B`), Primary Gold (`#D4AF37`), Nền Slate (`#F8FAFC`), Surface White (`#FFFFFF`).
  - Cấu hình font chữ Inter từ Google Fonts với tập ký tự `vietnamese` sắc nét trong `src/app/layout.tsx`.
  - Thiết lập module tokens tập trung `src/lib/constants/tokens.ts` (colors, radius, shadows, zIndex, breakpoints).
- **Bộ Reusable UI Components (`src/components/ui/`):**
  - `Button` & `IconButton`: Đầy đủ các biến thể (`primary`, `secondary`, `outline`, `goldOutline`, `ghost`, `danger`, `success`), 3 kích thước (`sm`, `md`, `lg`), trạng thái loading spinner, touch target tối thiểu 44px.
  - `Input`, `Textarea`, `Select`: Chuẩn form có nhãn, báo lỗi tiếng Việt, text trợ giúp, icon trước/sau, chuẩn A11y.
  - `Checkbox`, `Radio`: Tùy biến kiểu dáng thanh lịch theo tông màu Gold & Navy.
  - `Badge`: 8 biến thể trạng thái có hỗ trợ chấm tín hiệu động (`dot`).
  - `Card`: Bề mặt Card nổi bật với bóng đổ `shadow-card`, hiệu ứng hover nhẹ nhàng.
  - `Modal`: Hộp thoại nổi có khóa cuộn trang, đóng bằng phím Escape, responsive trượt từ dưới lên trên Mobile.
  - `Alert` & `Toast`: Hệ thống thông báo ngữ nghĩa kèm Toast Provider nhẹ nhàng.
  - `Spinner` & `Skeleton`: Các trạng thái tải dữ liệu tránh hiện tượng giật cục màn hình (CLS).
  - `Divider`, `Container`, `Section`: Quản lý lề, max-width chuẩn responsive.
- **Bố Cục Cốt Lõi (Layout Foundation):**
  - `Header`: Thanh điều hướng dính `sticky top-0` với hiệu ứng kính mờ `backdrop-blur-md`, đầy đủ menu điều hướng, hotline động `0868680944` và Drawer trượt trên Mobile.
  - `Footer`: Bố cục 4 cột cao cấp trên Desktop, xếp chồng gọn gàng trên Mobile, đầy đủ thông tin nhà xe, tuyến trọng điểm, dịch vụ, hotline và copyright.
  - `FloatingQuickActions`: Cụm tiện ích góc dưới bên phải gồm Nút gọi hotline xung kích, Nút chat Zalo và Nút cuộn lên đầu trang.
- **Trang Trưng Bày & Kiểm Thử Giao Diện:**
  - Xây dựng trang `src/app/ui-preview/page.tsx` phục vụ việc kiểm thử thị giác và responsive trực quan tất cả các thành phần.
  - Cập nhật trang chủ `src/app/page.tsx` với bố cục Hero, Card dịch vụ và Bảng lộ trình thực tế.
  - Xây dựng trang tra cứu nhanh `src/app/tra-cuu/page.tsx`.
- **Tài Liệu Kỹ Thuật:**
  - Hoàn thiện tài liệu `docs/DESIGN_SYSTEM.md`.

---

## [Phase 1: Foundation & Core Setup] - 11/09/2026

### Thêm Mới (Added):
- Khởi tạo dự án Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
- Khởi tạo Git repository và cấu hình `.gitignore` bảo vệ file môi trường `.env*`.
- Tạo mẫu biến môi trường `.env.example` và `.env.local`.
- Xây dựng 100% Type-safe interfaces cho 11 domain entities (`Booking`, `Customer`, `Vehicle`, `Driver`, `Trip`, `Route`, `Payment`, `Feedback`, `Notification`, `Settings`, `AuditLog`).
- Xây dựng bộ Zod validation schemas cho 4 hình thức đặt xe và tra cứu.
- Cài đặt Data Access Layer (Repository Pattern) với In-Memory Mock Repository phong phú.
- Xây dựng Service Layer (`BookingService`, `FeedbackService`) kiểm soát máy trạng thái chuyển đổi một chiều và tự động tính toán thời gian xin feedback.
- Xây dựng bộ kiểm thử tự động `src/lib/test-phase1.ts` (`npm run test:phase1`).
- Báo cáo kiểm định toàn diện dự án `PROJECT_AUDIT.md`.
- Tài liệu kiến trúc hệ thống `docs/ARCHITECTURE.md` và lộ trình 17 giai đoạn `ROADMAP.md`.
