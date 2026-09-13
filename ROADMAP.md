# LỘ TRÌNH PHÁT TRIỂN HỆ THỐNG (PROJECT ROADMAP)
**Hệ thống Booking & Quản lý Dịch vụ Limousine Quảng Ninh - Ninh Bình**

- **Quy tắc bất biến:** Không nhảy phase. Mỗi phase phải hoàn thành đầy đủ chu trình:
  **ANALYZE → PLAN → IMPLEMENT → TEST → REVIEW → REGRESSION TEST → DOCUMENT → STABILIZE → NEXT MODULE**
- **Tiêu chuẩn hoàn thành (DoD - Definition of Done):**
  - [x] Không lỗi TypeScript (`tsc --noEmit`)
  - [x] Không lỗi Lint (`npm run lint`)
  - [x] Build thành công (`npm run build`)
  - [x] Đã kiểm tra 11 viewport responsive (nếu có UI)
  - [x] Đã kiểm tra bảo mật và validation dữ liệu
  - [x] Báo cáo `PHASE_X_REPORT.md` được cập nhật

---

## BẢNG TỔNG QUAN CÁC GIAI ĐOẠN

| Phase | Tên Giai Đoạn | Trọng Tâm Nghiệp Vụ | Trạng Thái |
| :--- | :--- | :--- | :--- |
| **PHASE 0** | **Project Audit & Architecture** | Kiểm định hiện trạng, thiết lập tài liệu kiến trúc & quy chuẩn | **HOÀN THÀNH 100%** |
| **PHASE 1** | **Foundation & Core Setup** | Khởi tạo Next.js, TypeScript, Tailwind, Types, Repositories, Utils | **HOÀN THÀNH 100%** |
| **PHASE 2** | **UI Foundation & Design System** | Header, Footer, Theme tokens, Floating CTA, Reusable atoms | **HOÀN THÀNH 100%** |
| **PHASE 3** | **Public Website** | Trang chủ, Tuyến đường, Dịch vụ xe, Giới thiệu, Liên hệ | **HOÀN THÀNH 100%** |
| **PHASE 4** | **Booking Engine** | Đặt vé limousine, Xe hợp đồng, Gửi hàng, Tour, Sinh mã BK/HG | **HOÀN THÀNH 100%** |
| **PHASE 5** | **Operations & Fleet Management** | Quản lý Đội xe, Tài xế, Tuyến, Điều phối chuyến & Trạng thái | **HOÀN THÀNH 100%** |
| **PHASE 6** | **Database + Auth + Production Foundation** | Firestore Adapters, Repository Factory, Firebase Auth, RBAC, Route Guard | **HOÀN THÀNH 100%** |
| **PHASE 7** | **Admin Dashboard & Booking Operations** | Dashboard KPI thực tế, Quản lý Booking nâng cao, Phân xe/tài xế, RBAC | **HOÀN THÀNH 100%** |
| **PHASE 8** | **Payments & Deposit** | Quản lý tiền cọc, Thanh toán, QR Chuyển khoản, Hóa đơn | **HOÀN THÀNH 100%** |
| **PHASE 9** | **Feedback System** | Đánh giá 1-5 sao, Phân loại POSITIVE/NEUTRAL, Workflow khiếu nại | Chưa bắt đầu |
| **PHASE 10** | **Automation & Background Engine** | Scheduled Worker, Delay xin feedback, Email/SMS, Idempotency | Chưa bắt đầu |
| **PHASE 11** | **Reports & Business Analytics** | Thống kê doanh thu, Tỷ lệ hủy/hoàn thành, Báo cáo tuyến xe | Chưa bắt đầu |
| **PHASE 12** | **Security & Rules Hardening** | Security Audit, Firestore Rules, Chống Spam / Rate limiting | Chưa bắt đầu |
| **PHASE 13** | **Performance & Optimization** | Tối ưu ảnh, Caching, Bundle size, Giảm re-render | Chưa bắt đầu |
| **PHASE 14** | **SEO & Structured Data** | Meta tags, OpenGraph, Sitemap XML, Robots.txt, JSON-LD Schema | Chưa bắt đầu |
| **PHASE 15** | **Production Readiness & Deploy** | CI/CD, Production Build, Giám sát lỗi, Kế hoạch Backup | Chưa bắt đầu |

---

## CHI TIẾT TỪNG GIAI ĐOẠN

### PHASE 0: Project Audit & Architecture
* **Mục tiêu:** Kiểm tra và đánh giá toàn diện dự án hiện tại, thiết lập nền móng tài liệu kiến trúc, database, quy chuẩn code.
* **Đầu ra (Deliverables):**
  - `PROJECT_AUDIT.md`: Đã tạo xong.
  - `docs/ARCHITECTURE.md`: Đã tạo xong.
  - `ROADMAP.md`: Đã tạo xong.
  - `implementation_plan.md`: Đang trình duyệt.
* **Checkpoint:** Phê duyệt từ người dùng để bước vào Phase 1.

---

### PHASE 1: Foundation (Cơ sở hạ tầng & Core Config)
* **Mục tiêu:** Dựng bộ khung mã nguồn vững chắc, sạch sẽ, tuân thủ Clean/Modular Architecture.
* **Nhiệm vụ cụ thể:**
  - Khởi tạo Git repository (`git init`) và cấu hình `.gitignore` chuẩn.
  - Khởi tạo dự án Next.js App Router (TypeScript, Tailwind CSS, ESLint).
  - Cấu hình file biến môi trường `.env.example` và `.env.local`.
  - Thiết lập thư mục và quy ước code: `src/app`, `src/components`, `src/lib`, `src/types`, `src/services`, `src/repositories`.
  - Xây dựng 100% TypeScript interfaces & enums cho 11 domain entities (`Booking`, `Customer`, `Vehicle`, `Driver`, `Trip`, `Route`, `Payment`, `Feedback`, `Notification`, `Settings`, `AuditLog`).
  - Xây dựng Zod validation schemas tập trung tại `src/lib/validation/`.
  - Xây dựng Data Access Interfaces (Repository Pattern) và In-Memory Mock Adapter phục vụ phát triển độc lập không phụ thuộc mạng.
  - Thiết lập các bộ hàm tiện ích chuẩn (`formatCurrencyVN`, `formatDateVN`, `generateBookingCode`, `sanitizeInput`).
* **DoD Phase 1:** `npm run build` thành công, TypeScript check 100% pass, không có code thừa.

---

### PHASE 2: UI Foundation & Design System
* **Mục tiêu:** Xây dựng hệ thống giao diện chuẩn mực, sang trọng (Navy `#071A2B`, Gold `#D4AF37`, White `#FFFFFF`) và responsive hoàn hảo.
* **Nhiệm vụ cụ thể:**
  - Cấu hình Tailwind Color Tokens, Font chữ (Inter / Montserrat) sắc nét, hỗ trợ tiếng Việt có dấu hoàn hảo.
  - Xây dựng bộ Atomic UI Components: `Button`, `Input`, `Select`, `Textarea`, `Badge`, `Card`, `Modal`, `Toast`, `SkeletonLoading`.
  - Xây dựng Layout công khai:
    - `Header`: Logo Limousine đẳng cấp, Menu điều hướng, Hotline nổi bật bấm gọi ngay (`0868680944`).
    - `Footer`: Đầy đủ thông tin pháp lý, giấy phép kinh doanh, danh sách tuyến phục vụ, mạng xã hội (Facebook, Zalo), cam kết dịch vụ.
    - `FloatingQuickActions`: Nút gọi nhanh hotline và mở Zalo luôn sẵn sàng trên thiết bị di động.
* **DoD Phase 2:** Kiểm thử trực quan và xác nhận hiển thị hoàn hảo trên toàn bộ 11 viewport từ 320px đến 1920px.

---

### PHASE 3: Public Website (Trang thông tin & Giới thiệu)
* **Mục tiêu:** Trình bày chuyên nghiệp toàn bộ thế mạnh của dịch vụ xe Limousine Quảng Ninh - Ninh Bình.
* **Nhiệm vụ cụ thể:**
  - `Trang chủ (/):`
    - Hero Section ấn tượng với form tra cứu / đặt xe nhanh.
    - Giới thiệu 4 thế mạnh chính: Đón trả tận nơi, Xe đời mới massage, Đúng giờ tuyệt đối, Giá công khai minh bạch.
    - Danh sách các dòng xe (5, 7, 11, 16, 29 chỗ) với hình ảnh sắc nét và tiện nghi đi kèm.
    - Lộ trình các tuyến trọng điểm (Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình).
    - Đánh giá nổi bật từ hành khách thực tế (Testimonials 5 sao).
  - `Trang Dịch vụ & Tuyến đường:`
    - `/tuyen-duong`: Chi tiết điểm đón, thời gian chạy dự kiến, giá tham khảo từng chặng.
    - Thông tin rõ ràng chính sách hành lý và trẻ em.
* **DoD Phase 3:** Mọi trang load nhanh dưới 1.2s, ảnh tối ưu `next/image`, ngữ nghĩa HTML5 chuẩn SEO.

---

### PHASE 4: Booking Engine (Hệ thống đặt xe đa dịch vụ)
* **Mục tiêu:** Cho phép khách hàng đặt xe cực nhanh, không cần tạo tài khoản, sinh mã tức thì.
* **Nhiệm vụ cụ thể:**
  - Xây dựng 4 form đặt xe chuyên biệt (Tab selector linh hoạt):
    1. **Đặt vé Limousine liên tỉnh:** Điểm đi, điểm đến, ngày đi, giờ đi, 1 chiều/khứ hồi, số khách, điểm đón/trả tận nơi.
    2. **Thuê xe hợp đồng:** Chọn loại xe 5-29 chỗ, ngày đón, điểm đón/đến, số ngày thuê, ghi chú lộ trình.
    3. **Gửi hàng hóa liên tỉnh:** Người gửi + SĐT, Người nhận + SĐT, Điểm gửi/nhận, Loại hàng, Khối lượng.
    4. **Đặt xe du lịch:** Điểm đến du lịch (Hạ Long, Cát Bà, Tam Chúc, Tràng An...), ngày về, số khách.
  - Cơ chế sinh mã tự động an toàn không trùng lặp: `BKYYYYMMDDXXXX` (vé xe/hợp đồng/du lịch) và `HGYYYYMMDDXXXX` (hàng hóa).
  - Tự động tạo hoặc liên kết hồ sơ khách hàng theo SĐT (`customers`).
  - Giao diện xác nhận booking thành công (Booking Success Screen) với đầy đủ thông tin tóm tắt và nút chụp màn hình/lưu mã.
* **DoD Phase 4:** Test validation form toàn diện (bỏ trống, SĐT sai, ngày quá khứ, spam submit); ghi nhận vào database/repository chuẩn xác.

---

### PHASE 5: Tracking & Booking Lookup (Tra cứu đơn hàng)
* **Mục tiêu:** Hành khách có thể tự kiểm tra tình trạng xử lý đơn mọi lúc.
* **Nhiệm vụ cụ thể:**
  - Form tra cứu bảo mật: Yêu cầu nhập đúng `Mã Booking` + `Số điện thoại` đặt xe.
  - Hiển thị chi tiết tiến trình (Timeline Stepper trực quan):
    `Mới tiếp nhận` → `Đang liên hệ` → `Đã xác nhận` → `Đã đặt cọc` → `Đang di chuyển` → `Hoàn thành`.
  - Hiển thị thông tin xe được gán, tài xế và số điện thoại hỗ trợ nếu chuyến đã được điều phối.
* **DoD Phase 5:** Không lộ thông tin nếu nhập sai số điện thoại; hiển thị thân thiện trên mobile.

---

### PHASE 6: Database + Authentication + Production Foundation (Cơ sở dữ liệu & Xác thực)
* **Trạng thái:** **HOÀN THÀNH 100%** (11/09/2026)
* **Mục tiêu:** Di chuyển dữ liệu lên Google Cloud Firestore, thiết lập Firebase Authentication, phân quyền RBAC và bảo vệ phân hệ quản trị.
* **Nhiệm vụ đã hoàn thành:**
  - Tích hợp Firebase Client SDK & Firebase Admin SDK (Zod validation, Singleton, modular imports).
  - Triển khai toàn diện Firestore Repositories (`booking`, `customer`, `fleet`, `feedback`, `settings`).
  - Xây dựng Repository Factory Pattern chuyển đổi linh hoạt Firestore / In-Memory qua biến môi trường.
  - Tích hợp Transaction nguyên tử sinh mã booking (`BK...`, `HG...`) không trùng lặp và CRM Deduplication theo SĐT.
  - Trang đăng nhập Admin an toàn `/admin/login`, API cấp session cookie `/api/auth/session`, nút Đăng Xuất trên Sidebar.
  - Xây dựng Next.js Middleware chặn toàn bộ truy cập chưa xác thực vào `/admin/*` (chuyển hướng 307).
  - Triển khai `firestore.rules` (Deny-by-default, RBAC phân tầng) và seed data script `npm run seed:firestore`.
  - Bộ test tự động `npm run test:phase6` (18/18 test cases PASS), 100% Quality Gates (TypeScript 0 lỗi, Lint 0 lỗi).
* **DoD Phase 6:** Phiên làm việc được mã hóa an toàn qua HttpOnly cookie; dữ liệu Firestore sẵn sàng cho production; toàn bộ hệ thống tương thích ngược 100%.

---

### PHASE 7: Admin Dashboard & Booking Operations (HOÀN THÀNH 100%)
* **Mục tiêu:** Trung tâm điều hành kinh doanh trực quan cho chủ xe và quản trị viên dựa trên 100% dữ liệu thực tế.
* **Nhiệm vụ đã hoàn thành:**
  - Dashboard tổng quan (`/admin`): 8 chỉ số KPI thời gian thực, Doanh thu thực tế (VNĐ), Cảnh báo phương tiện bảo dưỡng & tài xế nghỉ ca, Danh sách đơn cần xử lý gấp (`NEW`, `CONTACTING`), Danh sách chuyến hôm nay, Empty State chuẩn mực.
  - Quản lý Booking danh sách (`/admin/bookings`): Tìm kiếm đa trường (Mã, SĐT, Tên, Kiện hàng), bộ lọc đa tiêu chí (Trạng thái, Dịch vụ, Tuyến, Ngày), phân trang 10 mục/trang, sắp xếp linh hoạt, layout chống tràn trên thiết bị di động (`scrollWidth <= clientWidth`).
  - Màn hình chi tiết Booking (`/admin/bookings/[id]`): Thông tin khách hàng & CRM, thông tin kiện hàng / hợp đồng, tổng kết tài chính, phân xe & tài xế, timeline lịch sử trạng thái, State Machine actions.
  - Tích hợp RBAC & Audit Log: Kiểm soát phân quyền người dùng (`ADMIN`, `OPERATOR`, `MANAGER`, `STAFF`, v.v.), ghi nhận `actorRole` trên từng thay đổi trạng thái và phân công.
* **DoD Phase 7:** 100% kiểm thử tự động đạt chuẩn (`npm run test:phase7`), TypeScript 0 lỗi, Lint 0 warnings, build thành công, không tràn ngang layout.

---

### PHASE 8: Payments & Deposit Management
* **Trạng thái:** **HOÀN THÀNH 100%** (11/09/2026)
* **Mục tiêu:** Kiểm soát dòng tiền, tiền đặt cọc và thanh toán minh bạch.
* **Nhiệm vụ cụ thể:**
  - Ghi nhận trạng thái thanh toán (`PENDING`, `DEPOSITED`, `PAID`, `FAILED`, `REFUNDED`).
  - Hỗ trợ các phương thức: Tiền mặt (`CASH`), Chuyển khoản ngân hàng (`BANK_TRANSFER`), Mã QR (`QR`).
  - Hiển thị QR thanh toán chuẩn VietQR có sẵn số tiền và cú pháp `[Mã Booking]` cho khách.
  - Lịch sử giao dịch chi tiết cho từng booking, kết nối Invoice Service.
* **DoD Phase 8:** Tính toán công nợ và số tiền còn lại chuẩn xác; tạo Invoice, xuất hóa đơn in ấn. Báo cáo hoàn tất.

---

### PHASE 9: Feedback System & Xử lý Khiếu nại
* **Mục tiêu:** Thu thập đánh giá minh bạch và quy trình xử lý phản hồi tiêu cực chuyên nghiệp.
* **Nhiệm vụ cụ thể:**
  - Trang đánh giá công khai `/feedback/[bookingCode]`: Chấm điểm sao (1 - 5 sao), gửi nhận xét, thái độ tài xế, chất lượng xe.
  - Cơ chế phân loại:
    - 4 - 5 sao: `POSITIVE` (Được phép hiển thị lên mục đánh giá nổi bật, gợi ý nút bấm đánh giá Google Review).
    - 3 sao: `NEUTRAL`.
    - 1 - 2 sao: `NEEDS_REVIEW` (Tự động chuyển vào danh sách cảnh báo khẩn của Admin).
  - Quy trình xử lý phản hồi tiêu cực cho Admin: `NEW` → `IN_REVIEW` → `CONTACTED` → `RESOLVED` (kèm ghi chú cách giải quyết và nhân viên xử lý).
* **DoD Phase 9:** Đánh giá xấu không tự động hiển thị ra ngoài; có quy trình khép kín giải quyết khiếu nại.

---

### PHASE 10: Automation & Background Engine
* **Mục tiêu:** Tự động hóa các tác vụ chăm sóc khách hàng và vận hành sau chuyến đi.
* **Nhiệm vụ cụ thể:**
  - Event Trigger: Khi booking chuyển sang `COMPLETED`, tự động tạo yêu cầu gửi link feedback với độ trễ `feedbackDelayHours` (mặc định 2 giờ).
  - Scheduled Background Worker: Quét và gửi thông báo theo hàng đợi.
  - Cơ chế **Idempotency**: Tuyệt đối không gửi trùng lặp yêu cầu đánh giá cho cùng 1 đơn hoàn thành.
  - Cơ chế **Retry & Error Logging**: Tự động thử lại tối đa 3 lần nếu kết nối gặp sự cố mạng, ghi log lỗi chi tiết.
* **DoD Phase 10:** Chạy lặp lại cron không sinh dữ liệu trùng; trạng thái job (`PENDING`, `SENT`, `FAILED`) rõ ràng.

---

### PHASE 11: Reports & Business Analytics
* **Mục tiêu:** Cung cấp số liệu thống kê giúp chủ doanh nghiệp ra quyết định kinh doanh.
* **Nhiệm vụ cụ thể:**
  - Báo cáo Doanh thu theo ngày/tuần/tháng.
  - Báo cáo Sản lượng: Số vé đặt, số chuyến chạy, tỷ lệ hủy đơn.
  - Báo cáo Tuyến xe: Tuyến nào đông khách nhất, khung giờ nào cao điểm.
  - Báo cáo Chất lượng dịch vụ: Điểm đánh giá trung bình theo xe, theo tài xế, tỷ lệ giải quyết khiếu nại.
* **DoD Phase 11:** Biểu đồ trực trực quan, số liệu khớp chính xác 100% với bảng thanh toán và booking.

---

### PHASE 12: Security Hardening & Spam Protection
* **Mục tiêu:** Đảm bảo an toàn tuyệt đối cho hệ thống trước các cuộc tấn công và spam đơn ảo.
* **Nhiệm vụ cụ thể:**
  - Thiết lập Firestore Security Rules nghiêm ngặt (chặn đọc toàn bộ danh sách từ public).
  - Thêm Honeypot fields và IP/Phone Rate Limiting cho form đặt xe và form đánh giá.
  - XSS & Input Sanitization cho toàn bộ dữ liệu người dùng nhập.
  - Rà soát toàn bộ source code đảm bảo không có bất kỳ API secret hay private key nào bị lọt.
* **DoD Phase 12:** Security audit report sạch; không thể spam gửi đơn hàng loạt.

---

### PHASE 13: Performance & Optimization
* **Mục tiêu:** Tối ưu hóa tốc độ tải trang nhanh dưới 1.5s trên mạng 4G di động.
* **Nhiệm vụ cụ thể:**
  - Chuyển đổi định dạng ảnh sang WebP/AVIF tối ưu.
  - Áp dụng Server Components tối đa, phân tách Code-splitting cho Admin bundle.
  - Tối ưu hóa các truy vấn Firestore (chỉ lấy đúng trường cần thiết, đánh index đầy đủ).
* **DoD Phase 13:** Điểm Google Lighthouse Performance đạt trên 90 điểm trên cả Mobile và Desktop.

---

### PHASE 14: SEO & Open Graph
* **Mục tiêu:** Tối ưu hiển thị tìm kiếm Google cho các từ khóa xe Limousine tuyến trọng điểm.
* **Nhiệm vụ cụ thể:**
  - Thiết lập Meta Title, Meta Description chuẩn cho từng tuyến xe và dịch vụ.
  - Cấu hình OpenGraph và Twitter Card (ảnh xem trước đẹp mắt khi gửi link qua Zalo/Facebook).
  - Tự động sinh `sitemap.xml` và `robots.txt`.
  - Bổ sung Structured Data (`Schema.org: LocalBusiness, TransportationService`).
* **DoD Phase 14:** Kiểm tra hợp lệ trên Google Rich Results Test.

---

### PHASE 15: Production Build & Deployment
* **Mục tiêu:** Đóng gói và đưa hệ thống lên môi trường production sẵn sàng đón khách hàng thực tế.
* **Nhiệm vụ cụ thể:**
  - Kiểm tra Production Build (`npm run build`) không có bất kỳ warning nghiêm trọng nào.
  - Cấu hình CI/CD GitHub Actions kiểm tra tự động trước khi merge.
  - Thiết lập kịch bản sao lưu dữ liệu (Scheduled Database Backup ra file JSON/CSV).
  - Thiết lập tài liệu hướng dẫn vận hành và bàn giao (`docs/DEPLOYMENT.md`).
* **DoD Phase 15:** Hệ thống hoạt động ổn định trên hosting production (Cloudflare Pages / Vercel), đầy đủ HTTPS và domain chính thức.
