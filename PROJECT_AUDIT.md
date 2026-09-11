# BÁO CÁO PHÂN TÍCH TOÀN DIỆN DỰ ÁN (PROJECT AUDIT REPORT)
**Hệ thống Booking & Quản lý Dịch vụ Limousine Quảng Ninh - Ninh Bình**

- **Ngày kiểm định:** 11/09/2026
- **Vai trò thực hiện:** Senior Full-Stack Engineer + Software Architect + QA Engineer + DevOps Engineer
- **Phiên bản tài liệu:** 1.0.0
- **Trạng thái dự án:** Khởi tạo từ đặc tả kỹ thuật (Greenfield Project from System Specification)

---

## 1. Stack Hiện Tại
* **Mã nguồn thực tế trong thư mục gốc:**
  - Hiện tại dự án chỉ có duy nhất 01 file: `README.md` (dung lượng 36.7 KB, 2030 dòng).
  - Chưa có `package.json`, chưa có `node_modules`.
  - Chưa có mã nguồn ứng dụng (`src/`, `public/`, `app/`, `components/`).
  - Chưa có kho lưu trữ Git (`.git` chưa được khởi tạo).
* **Môi trường máy phát triển (Host Environment):**
  - Hệ điều hành: Windows
  - Node.js: `v22.18.0` (LTS tương thích tốt với Next.js 14/15)
  - npm: `10.9.3`
  - Git: `git version 2.53.0.windows.2`
* **Công nghệ được xác lập theo đặc tả (`README.md`):**
  - **Frontend:** Next.js (App Router), React 18/19, TypeScript, Tailwind CSS, Radix UI / Lucide React icons.
  - **Backend / Database:** Firebase (Firebase Authentication, Cloud Firestore, Firebase Storage) kết hợp Next.js API Routes / Server Actions + Firebase Admin SDK cho các tác vụ đặc quyền và server-side validation.
  - **Automation & Scheduling:** Next.js API cron/worker handlers kết hợp Cloudflare Workers / cron triggers hoặc Vercel Cron, Resend (Transactional Email).
  - **Design System:** Tông màu sang trọng (Navy `#071A2B`, Gold `#D4AF37`, White `#FFFFFF`).

---

## 2. Kiến Trúc Hiện Tại
* **Mô tả kiến trúc:**
  - Dự án đang ở giai đoạn **Specification & Architecture Blueprint**. Chưa có mã nguồn thực thi, kiến trúc hệ thống hiện tại được định nghĩa qua mô hình phân tầng trong `README.md`.
* **Phân tầng đề xuất theo đặc tả:**
  ```text
                               KHÁCH HÀNG / USER
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
             Public Website     Booking Engine    Feedback Engine
                   │                  │                  │
                   └──────────────────┬──────────────────┘
                                      ▼
                               NEXT.JS APP ROUTER
                    (Presentation Layer: UI Components, Forms)
                                      │
                                      ▼
                            SERVICE / DOMAIN LAYER
              (BookingService, CustomerService, NotificationService,
               TripService, FeedbackService, PaymentService, RBAC)
                                      │
                                      ▼
                           REPOSITORY / DATA ACCESS
                (Firestore Adapter / Mock Adapter / Admin SDK)
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
              Cloud Firestore     Firebase Auth     Cloud Storage
                   │
                   ▼
          AUTOMATION & CRON ENGINE
       (Job queue, Event triggers, Email/SMS, Retries, Idempotent Worker)
  ```
* **Đánh giá kiến trúc:**
  - Việc phân tách rõ Public Web, Admin CRM, Automation và Data Layer là hoàn toàn đúng đắn.
  - Cần áp dụng triệt để **Repository Pattern** và **Service Layer** để tránh việc component UI gọi trực tiếp Firestore SDK, bảo đảm khả năng test unit, mock data khi chạy offline/local, và dễ dàng chuyển đổi database nếu quy mô lớn mà không phá vỡ UI.

---

## 3. Những Gì Đã Hoàn Thành
- [x] Tài liệu đặc tả hệ thống toàn diện (`README.md`): Chi tiết 57 mục, bao gồm đầy đủ luồng nghiệp vụ, định dạng mã booking (`BKYYYYMMDDXXXX`), mã vận đơn gửi hàng (`HGYYYYMMDDXXXX`), quy chuẩn trạng thái booking, phân loại đánh giá 5 sao, RBAC 3 cấp (ADMIN, MANAGER, STAFF), thiết kế 11 collections Firestore, quy trình responsive và roadmap 16 phase.
- [x] Xác định rõ ràng các hotline và thông tin kinh doanh: `0868680944` - `0866834442`, tuyến dịch vụ chính Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình.
- [x] Định hình bảng màu nhận diện thương hiệu: Navy `#071A2B`, Gold `#D4AF37`, White `#FFFFFF`.
- [x] Kiểm tra môi trường Node.js và Git trên máy tính sẵn sàng cho việc khởi tạo dự án.

---

## 4. Những Gì Chưa Hoàn Thành
- [ ] Khởi tạo Git repository (`git init`) và cấu hình `.gitignore`.
- [ ] Thiết lập dự án Next.js (TypeScript, Tailwind CSS, ESLint).
- [ ] Tạo cấu trúc thư mục chuẩn theo Clean/Modular Architecture (`src/app`, `src/components`, `src/lib`, `src/services`, `src/repositories`, `src/types`, `src/hooks`, `src/config`).
- [ ] Thiết lập hệ thống biến môi trường (`.env.example`, `.env.local`).
- [ ] Hệ thống Types & Interfaces đầy đủ cho 11 domain entities.
- [ ] Lớp Data Access & Services (Repository Pattern) hỗ trợ cả chế độ Firestore thật và In-Memory/Local Fallback khi chưa cấu hình key.
- [ ] Giao diện người dùng Public (Trang chủ, Booking xe limousine, Đặt xe hợp đồng, Đặt xe du lịch, Gửi hàng hóa, Tra cứu booking, Đánh giá feedback).
- [ ] Authentication & RBAC (Login, Session, Route Protection, Role verification).
- [ ] Admin Portal & CRM (Dashboard, Quản lý Booking, Khách hàng, Tuyến xe, Xe, Tài xế, Chuyến xe, Thanh toán, Phản hồi tiêu cực, Cài đặt).
- [ ] Automation & Background Engine (Event bus, Feedback delay scheduler, Idempotent workers, Logs, Retries).
- [ ] Hệ thống Báo cáo & Thống kê doanh thu, tuyến xe, đánh giá.
- [ ] Kiểm thử tự động (Unit test, Integration test, E2E flow test).
- [ ] SEO, Metadata, Sitemap, Robots, Open Graph.

---

## 5. Những Phần Đang Lỗi (Current Bugs)
* **Hiện trạng:** Không có lỗi runtime do dự án chưa có mã nguồn thực thi.
* **Lưu ý cấu hình môi trường:** Thư mục hiện tại chưa có Git tracking. Nếu không khởi tạo Git ngay từ đầu, sẽ mất khả năng theo dõi lịch sử commit và rollback khi cần thiết.

---

## 6. Những Phần Có Nguy Cơ Lỗi (High Risk Areas)
1. **Phụ thuộc cứng vào Firebase ngay từ bước đầu (Hard Dependency Lock-in):**
   - Nếu viết code UI gọi trực tiếp `getDocs(collection(db, 'bookings'))` thì khi dev local chưa có credentials Firebase, toàn bộ trang web sẽ crash hoặc vướng lỗi cấu hình.
   - *Biện pháp phòng ngừa:* Tạo Data Adapter Layer (Repository Pattern) với In-Memory Mock Data cho chế độ Development khi thiếu biến môi trường Firebase, kèm log cảnh báo rõ ràng.
2. **Xung đột mã Booking khi gửi đồng thời (Concurrency / Race Condition):**
   - Định dạng `BKYYYYMMDDXXXX` yêu cầu 4 chữ số tăng tuần tự trong ngày. Nếu 2 khách bấm đặt xe cùng một giây, việc tính số thứ tự có thể bị trùng nếu không dùng Firestore Transaction hoặc Atomic Counter.
   - *Biện pháp phòng ngừa:* Sử dụng Firestore Distributed Counter / Transaction hoặc kết hợp timestamp mili-giây / mã ngẫu nhiên bảo đảm tính duy nhất tuyệt đối.
3. **Lỗ hổng Firestore Security Rules:**
   - Dữ liệu `customers` và `bookings` chứa số điện thoại, địa chỉ đón/trả. Nếu để public read thì sẽ lộ thông tin cá nhân khách hàng.
   - *Biện pháp phòng ngừa:* Cấu hình Firestore Security Rules chặt chẽ: Public chỉ được tạo (`create`) với validation schema; tra cứu booking phải thông qua Server Action / API Route xác thực cặp `(bookingCode, phone)`.
4. **Vỡ Layout Responsive giữa Desktop và Mobile:**
   - Các bảng dữ liệu phức tạp trong Admin (Booking table, Trip schedule) và Form booking nhiều bước dễ bị tràn viền (horizontal overflow) trên màn hình 320px - 375px.
   - *Biện pháp phòng ngừa:* Thiết kế Mobile-first; trên mobile chuyển Data Table thành dạng Card View; kiểm thử tự động trên toàn bộ 11 viewport yêu cầu.
5. **Gửi trùng lặp thông báo/feedback trong Automation (Duplicate Automation Trigger):**
   - Nếu cron job chạy mỗi 5 phút quét các booking hoàn thành để xin feedback, nếu không có cơ chế khoá trạng thái (`PENDING` -> `PROCESSING` -> `SENT`), một booking có thể bị gửi nhiều lần.
   - *Biện pháp phòng ngừa:* Đảm bảo tính Idempotency, ghi nhận timestamp `feedbackSentAt` và transaction lock trạng thái trước khi gửi.

---

## 7. Database Hiện Tại
* **Hiện trạng:** Chưa tạo instance database vật lý.
* **Schema dự kiến (11 Entities theo đặc tả):**
  1. `customers`: Khách hàng, số lần đặt, chi tiêu, điểm đón quen thuộc.
  2. `bookings`: Vé limousine, hợp đồng xe, tour du lịch, hàng hóa, trạng thái, mã tra cứu.
  3. `routes`: Danh mục tuyến đường cố định và liên tỉnh.
  4. `vehicles`: Xe 5, 7, 11, 16, 29 chỗ, biển số, trạng thái (AVAILABLE, ASSIGNED, MAINTENANCE, INACTIVE).
  5. `drivers`: Danh sách tài xế, GPLX, trạng thái hoạt động.
  6. `trips`: Chuyến xe được điều phối từ Tuyến + Xe + Tài xế + Thời gian.
  7. `payments`: Ghi nhận cọc, thanh toán đủ, hình thức (CASH, BANK_TRANSFER, QR).
  8. `feedback`: Đánh giá 1-5 sao, phân loại POSITIVE/NEUTRAL/NEEDS_REVIEW, quy trình xử lý phản hồi tiêu cực.
  9. `notifications`: Lịch sử thông báo qua Web/Email/SMS.
  10. `settings`: Cấu hình hệ thống (Hotline, địa chỉ, URL Zalo/FB, feedbackDelayHours).
  11. `auditLogs`: Nhật ký thay đổi trạng thái booking, điều xe, huỷ chuyến, đăng nhập admin.

---

## 8. API Hiện Tại
* **Hiện trạng:** Chưa có API nào được xây dựng.
* **Kế hoạch triển khai:**
  - Public API / Server Actions:
    - `POST /api/bookings`: Tiếp nhận đặt xe & sinh mã `BK...` / gửi hàng `HG...`.
    - `POST /api/tracking`: Tra cứu booking bằng `bookingCode` + `phone`.
    - `POST /api/feedback`: Tiếp nhận đánh giá sau chuyến đi.
    - `GET /api/public/routes`: Lấy danh sách tuyến công khai đang kích hoạt.
  - Admin Protected API / Server Actions:
    - CRUD Bookings, Customers, Routes, Vehicles, Drivers, Trips, Payments, Feedback, Settings.
    - Thống kê doanh thu, tỷ lệ hoàn thành, SLA xử lý khiếu nại.
  - Automation & Cron API:
    - `GET /api/cron/process-feedback`: Quét các booking hoàn thành đã đủ độ trễ `feedbackDelayHours` để gửi link đánh giá.
    - `GET /api/cron/daily-summary`: Tổng hợp báo cáo chuyến đi hàng ngày.

---

## 9. Authentication Hiện Tại
* **Hiện trạng:** Chưa triển khai.
* **Thiết kế phân quyền RBAC:**
  - Khách vãng lai: Không cần tạo tài khoản để đặt xe hay tra cứu (chỉ cần mã booking + SĐT).
  - Admin Portal: Xác thực qua Firebase Authentication (Email/Password), kiểm tra Role qua Custom Claims hoặc bảng phân quyền Firestore (`ADMIN`, `MANAGER`, `STAFF`).

---

## 10. UI & Responsive Hiện Tại
* **Hiện trạng:** Chưa có mã nguồn UI.
* **Quy chuẩn cần tuân thủ khi xây dựng:**
  - Theme: Navy (`#071A2B`), Gold (`#D4AF37`), White (`#FFFFFF`), Slate Gray cho text phụ.
  - Viewports bắt buộc kiểm tra: `320px`, `360px`, `375px`, `390px`, `414px`, `768px`, `1024px`, `1280px`, `1366px`, `1440px`, `1920px`.
  - Không để xảy ra horizontal scroll trên thiết bị di động; tap targets đạt tối thiểu `44x44px`.

---

## 11. Dependencies & Package Analysis
* **Hiện trạng:** Trắng (Greenfield).
* **Danh mục dependencies tối ưu cần cài đặt:**
  - Core: `next` (v14/15), `react`, `react-dom`, `typescript`, `@types/react`, `@types/node`.
  - UI / Styling: `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`, `lucide-react`.
  - Validation: `zod` (Xác thực dữ liệu form & API payload an toàn, type-safe).
  - Backend / Data: `firebase`, `firebase-admin` (cho server-side security).
  - Date utils: `date-fns` (xử lý ngày giờ, định dạng lịch chuyến).

---

## 12. Code Trùng Lặp & Code Không Còn Sử Dụng
* **Hiện trạng:** 0% code trùng lặp, 0% dead code (chưa có mã nguồn).

---

## 13. Technical Debt
* **Hiện trạng:** Chưa có nợ kỹ thuật tồn đọng.
* **Biện pháp ngăn ngừa Technical Debt mới:**
  - Không hardcode chuỗi trạng thái, sử dụng TypeScript `enum` hoặc `const as const` (`BookingStatus`, `PaymentStatus`, `VehicleStatus`, `FeedbackRating`).
  - Không phân bổ logic xác thực form rải rác trong component; tập trung tại `src/lib/validation/`.
  - Không gọi trực tiếp SDK Firebase trong UI; bọc qua `src/services/`.

---

## 14. Vấn Đề Bảo Mật (Security Concerns)
1. **Kiểm soát thông tin nhạy cảm:** Không lưu số thẻ ngân hàng, CVV, mật khẩu plain-text.
2. **Chống Spam Booking:** Form đặt vé công khai phải có debounce, honeypot field, rate limiting để ngăn bot spam đơn ảo.
3. **Phân quyền truy cập API Admin:** Tất cả route `/admin` và API Admin phải xác thực token phiên đăng nhập và role hợp lệ, chặn truy cập trái phép.
4. **Bảo mật file môi trường:** Tạo file `.env.example` mẫu, đưa `.env`, `.env.local` vào `.gitignore` ngay lập tức.

---

## 15. Hiệu Năng (Performance Considerations)
- Sử dụng Next.js Server Components cho các trang tĩnh và semi-static (Trang chủ, Danh sách dịch vụ, Giới thiệu, Tuyến đường) để tối ưu First Contentful Paint (FCP) và SEO.
- Client Components chỉ dùng ở nơi tương tác (Form booking đa bước, Modal điều phối, Admin interactive tables).
- Tối ưu hóa ảnh với `next/image`, kích thước hình ảnh xe và banner chuẩn webp.

---

## 16. Khả Năng Mở Rộng (Scalability)
- **Kiến trúc Modular:** Mỗi phân hệ nghiệp vụ (`booking`, `customer`, `fleet`, `trip`, `feedback`, `report`) độc lập về mặt domain logic, tương tác qua service interface.
- **Khả năng chuyển dịch DB:** Nhờ Repository Pattern, hệ thống có thể chuyển từ Firestore sang Supabase/PostgreSQL trong tương lai mà không phải viết lại UI.
- **Tích hợp kênh ngoài:** Thiết kế sẵn Interface `NotificationProvider` (WebNotification, EmailNotification qua Resend, ZaloNotification qua Zalo OA API khi có tài khoản chính thức).

---

## 17. Khả Năng Automation
- Hệ thống được thiết kế theo mô hình **Event-Driven**:
  - Khi booking chuyển sang `COMPLETED` -> Kích hoạt job tạo `FeedbackRequest` với `feedbackAvailableAt = completedAt + feedbackDelayHours`.
  - Background Worker chạy theo lịch trình quét và gửi thông báo, có trường `status: PENDING | SENT | FAILED | COMPLETED`, bảo đảm **Idempotent** (chạy lại không gửi trùng).
  - Tự động phân loại đánh giá: 1-2 sao (NEEDS_REVIEW - đưa vào hàng đợi cảnh báo khẩn cấp cho Quản trị viên), 3 sao (NEUTRAL), 4-5 sao (POSITIVE - gợi ý hiển thị Testimonial).

---

## 18. Những Phần KHÔNG Nên Sửa
- **File `README.md` gốc:** Đây là tài liệu quy chuẩn cấp hệ thống và định hướng kinh doanh của chủ sở hữu. Cần duy trì tính toàn vẹn và coi là kim chỉ nam tham chiếu.
- **Mã quy ước nghiệp vụ:**
  - Quy ước mã booking: `BKYYYYMMDDXXXX`
  - Quy ước mã gửi hàng: `HGYYYYMMDDXXXX`
  - Hotline dịch vụ: `0868680944` - `0866834442`
  - Bảng màu: Navy `#071A2B`, Gold `#D4AF37`, White `#FFFFFF`.

---

## 19. Những Phần Nên Refactor
- Hiện tại chưa có mã nguồn nên không có phần nào cần refactor code. Tuy nhiên, khi khởi tạo, cần bảo đảm tuân thủ nghiêm ngặt quy tắc Modular và Repository Pattern ngay từ Phase 1, tránh việc viết code monolithic vào 1-2 file lớn.

---

## 20. Những Phần Cần Xây Mới
1. **Core Foundation & Project Setup:**
   - Khởi tạo Git repository và cấu hình `.gitignore`.
   - Khởi tạo Next.js App Router với TypeScript và Tailwind CSS.
   - Cấu hình Design System Tokens (màu sắc, typography, spacing).
   - Hệ thống Types, Validation Schemas (`zod`), Repository Interfaces, In-Memory Mock Data Adapter cho local testing.
2. **Public Interface (Web Khách hàng):**
   - Layout chung: Header với Hotline, Navigation, Footer, Floating Fast Action Buttons (Gọi điện, Zalo, Đặt vé).
   - Trang chủ giới thiệu tuyến limousine, các dòng xe (5-29 chỗ), đánh giá nổi bật.
   - Trang & Form đặt xe limousine: Điểm đi, điểm đến, ngày giờ, số khách, một chiều/khứ hồi, đón trả tận nơi.
   - Form thuê xe hợp đồng (5, 7, 11, 16, 29 chỗ).
   - Form gửi hàng hóa (người gửi, người nhận, loại hàng, khối lượng).
   - Form đặt xe du lịch.
   - Trang tra cứu booking (Lookup by code + phone).
   - Trang đánh giá chuyến đi `/feedback/[bookingCode]`.
3. **Admin Portal (Quản trị & CRM):**
   - Đăng nhập bảo mật & quản lý phân quyền (RBAC).
   - Dashboard tổng quan số liệu booking, doanh thu, xe, tài xế, feedback cần xử lý.
   - Quản lý Booking (Xem chi tiết, đổi trạng thái có kiểm soát, gán xe/tài xế, hủy, hoàn thành).
   - Quản lý Khách hàng (CRM mini, lịch sử đi xe, tổng tiền, ghi chú).
   - Quản lý Tuyến xe, Đội xe (Vehicles), Tài xế (Drivers), Chuyến xe (Trips).
   - Quản lý Thanh toán & Đặt cọc.
   - Quản lý Đánh giá & Xử lý phản hồi tiêu cực (Quy trình: NEW -> IN_REVIEW -> CONTACTED -> RESOLVED).
   - Cài đặt hệ thống (Hotline, cấu hình trễ feedback, link mạng xã hội).
4. **Automation & Background Engine:**
   - Worker endpoint & Scheduler logic.
   - Cơ chế logging, retry và bảo đảm tính idempotent.

---

## 21. Kết Luận Audit & Khuyến Nghị Tiếp Theo
- Dự án có nền tảng đặc tả nghiệp vụ xuất sắc và cực kỳ đầy đủ.
- Toàn bộ cơ sở hạ tầng code hiện tại là sạch (Greenfield), không có nợ kỹ thuật tồn đọng.
- Bắt đầu ngay theo quy trình chuẩn:
  1. Hoàn thiện tài liệu `docs/ARCHITECTURE.md` và `ROADMAP.md`.
  2. Lập `implementation_plan.md` cho Phase 0 (Foundation) và Phase 1 (Core Setup & Domain Layer).
  3. Tiến hành khởi tạo dự án sau khi người dùng phê duyệt kế hoạch.
