# NHẬT KÝ THAY ĐỔI DỰ ÁN (CHANGELOG)
**Hệ thống Booking & Quản lý Dịch vụ Limousine Quảng Ninh - Ninh Bình**

Toàn bộ các mốc phát triển, tính năng mới và các bản sửa đổi quan trọng được ghi nhận chi tiết theo từng phiên bản và giai đoạn.

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
