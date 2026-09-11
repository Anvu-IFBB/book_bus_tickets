# HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM SPECIFICATION)
**Limousine VIP Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình**

- **Phiên bản:** 1.0.0
- **Trạng thái:** Hoàn thiện Phase 2 (UI Foundation & Design System)
- **Tác giả:** Senior Full-Stack & UI/UX Architect

---

## 1. BẢNG MÀU NHẬN DIỆN THƯƠNG HIỆU (COLOR TOKENS)

Hệ thống màu sắc được thiết kế theo phong cách Hoàng gia cao cấp, tạo cảm giác sang trọng, an tâm và chuyên nghiệp cho dịch vụ vận tải hành khách VIP.

### 1.1. Màu chủ đạo (Brand Primary Colors)
* **Navy Hoàng Gia (Primary Brand Navy):** `#071A2B`
  - Biểu trưng cho sự vững chãi, uy tín và chuẩn mực cao cấp.
  - Sử dụng cho: Header, Hero banner, Footer, các nút thứ cấp và typography tiêu đề chính.
  - Bảng sắc thái:
    - `navy-950`: `#030C14` (Deepest Navy - Nền tối nhất)
    - `navy-900`: `#071A2B` (Brand Primary)
    - `navy-800`: `#0E2841` (Surface hover)
    - `navy-700`: `#16385B` (Viền & Dividers đậm)
    - `navy-50`: `#F0F5FC` (Nền dịu)
* **Vàng Kim Sang Trọng (Primary Brand Gold):** `#D4AF37`
  - Biểu trưng cho dịch vụ cao cấp 5 sao, ghế massage hạng thương gia.
  - Sử dụng cho: Nút CTA đặt vé chính, huy hiệu VIP, viền nhấn, icon nổi bật.
  - Bảng sắc thái:
    - `gold-900`: `#735B0F`
    - `gold-600`: `#C29B27` (Hover state)
    - `gold-500`: `#D4AF37` (Brand Gold)
    - `gold-400`: `#E0C25E` (Gradient stop)
    - `gold-100`: `#FAF4DF` (Badge background)
    - `gold-50`: `#FDFBF2`

### 1.2. Màu trung tính (Neutrals)
* `slate-50`: `#F8FAFC` (Canvas background nền toàn trang)
* `white`: `#FFFFFF` (Bề mặt Card, Modal dialog, Input backgrounds)
* `slate-200`: `#E2E8F0` (Viền Card, Input borders)
* `slate-600`: `#475569` (Màu chữ phụ, mô tả dịch vụ)
* `slate-900`: `#0F172A` (Màu chữ chính cho body text)

### 1.3. Màu trạng thái (Semantic Colors)
* **Success (`#16A34A`):** Chuyến hoàn thành, đã thanh toán, đã xác nhận.
* **Warning (`#D97706`):** Đang liên hệ, chờ đặt cọc, cảnh báo thời tiết.
* **Danger (`#DC2626`):** Hủy chuyến, lỗi form, phản hồi khiếu nại 1-2 sao.
* **Info (`#2563EB`):** Mới tiếp nhận, thông báo hành trình.

---

## 2. HỆ THỐNG KIỂU CHỮ (TYPOGRAPHY SYSTEM)

Sử dụng bộ font **Inter** chuẩn quốc tế từ Google Fonts, nạp tập ký tự `vietnamese` bảo đảm hiển thị dấu tiếng Việt sắc nét và không lỗi chân chữ.

| Cấp Bậc | Cỡ Chữ (Mobile / Desktop) | Trọng Lượng (Weight) | Dùng Cho |
| :--- | :--- | :--- | :--- |
| **Display / Hero** | `32px / 56px` | 900 (Black) | Tiêu đề lớn tại Hero Section |
| **H1 Heading** | `24px / 36px` | 800 (Extrabold) | Tiêu đề trang, trang tra cứu |
| **H2 Section** | `20px / 28px` | 700 (Bold) | Tiêu đề các phân mục dịch vụ, lộ trình |
| **H3 Card Title** | `18px / 20px` | 700 (Bold) | Tiêu đề thẻ xe, thẻ dịch vụ, modal |
| **Body Regular** | `14px / 16px` | 400 (Regular) | Nội dung đoạn văn, chi tiết lộ trình |
| **Caption / Helper**| `11px / 12px` | 400 / 500 (Medium) | Ghi chú, văn bản phụ, thời gian |
| **Button Text** | `14px / 16px` | 600 (Semibold) | Nhãn nút bấm thao tác |

---

## 3. DANH MỤC CÁC THÀNH PHẦN GIAO DIỆN (UI COMPONENTS)

Tất cả component nằm tại `src/components/ui/` và export tập trung tại `src/components/ui/index.ts`.

### 3.1. Nút Bấm (`Button`, `IconButton`)
- **Biến thể (Variants):** `primary` (Gold), `secondary` (Navy), `outline`, `goldOutline`, `ghost`, `danger`, `success`.
- **Kích thước (Sizes):** `sm` (36px), `md` (44px chuẩn touch-target), `lg` (48px).
- **Trạng thái:** Tích hợp sẵn `isLoading` (Spinner tự xoay), `disabled`, `leftIcon`, `rightIcon`, `fullWidth`.
- **IconButton:** Yêu cầu bắt buộc thuộc tính `aria-label` đảm bảo trợ năng (A11y).

### 3.2. Nhập Liệu Form (`Input`, `Textarea`, `Select`, `Checkbox`, `Radio`)
- Thiết kế chuẩn Mobile-first, chiều cao tối thiểu 44px dễ dàng bấm trên màn hình cảm ứng.
- Có đầy đủ các trạng thái: `label`, `error` (thông báo lỗi tiếng Việt màu đỏ), `helperText`, `required` (dấu sao đỏ), `leftIcon`, `rightIcon`.
- Select có icon mũi tên `ChevronDown` tinh tế, không phụ thuộc giao diện mặc định thô kệch của trình duyệt.
- Tự động gán `id`, `aria-invalid`, `aria-describedby` chuẩn accessibility.

### 3.3. Bề Mặt & Thẻ (`Card`, `Modal`, `Container`, `Section`)
- **Card:** Bề mặt trắng nổi bật trên nền Slate `#F8FAFC`, bóng đổ thanh lịch `shadow-card`, hiệu ứng nhấc thẻ mượt mà khi hover.
- **Modal:** Hộp thoại nổi có khóa cuộn trang (`body scroll lock`), phím tắt `Escape` tự đóng, lớp nền làm mờ `backdrop-blur-sm`, responsive dạng Sheet trượt từ dưới lên trên Mobile.
- **Container:** Quản lý lề và max-width (Mobile: 16px padding, Tablet: 24px, Desktop: 32px, max 1280px).
- **Section:** Phân chia các khối nội dung theo chiều dọc với các biến thể màu nền (`navy`, `white`, `slate`).

### 3.4. Thông Báo & Trạng Thái (`Badge`, `Alert`, `Toast`, `Spinner`, `Skeleton`, `Divider`)
- **Badge:** Đầy đủ các nhãn màu cho 8 trạng thái booking, xe và tài xế; hỗ trợ chấm tín hiệu động (`dot={true}`).
- **Alert:** Thông báo khối trong trang với icon ngữ nghĩa.
- **Toast:** Hệ thống thông báo nổi góc màn hình nhẹ nhàng (`useToast().success(...)`, `useToast().error(...)`).
- **Skeleton & Spinner:** Trạng thái chờ tải dữ liệu giúp tránh hiện tượng giật cục màn hình (Layout Shift).

---

## 4. BỐ CỤC ĐIỀU HƯỚNG CỐT LÕI (LAYOUT FOUNDATION)

### 4.1. Header (`src/components/layout/header.tsx`)
- Thanh điều hướng dính trên đầu trang (`sticky top-0`) với hiệu ứng mờ kính `backdrop-blur-md bg-navy-950/95`.
- **Desktop:**
  - Logo Limousine VIP + Điểm đến Quảng Ninh ⇄ Ninh Bình.
  - Danh mục điều hướng: Trang chủ, Tuyến đường, Dịch vụ, Tra cứu đơn, Đánh giá, Liên hệ.
  - Nút gọi nhanh hotline nổi bật `0868680944`.
  - Nút CTA "Đặt Vé Nhanh".
- **Mobile:**
  - Nút gọi hotline tức thì thu gọn thành icon 44px.
  - Nút Menu Hamburger mở Drawer toàn màn hình có hiệu ứng trượt mượt mà.
  - Không tràn chiều ngang dù ở màn hình 320px hẹp nhất.

### 4.2. Footer (`src/components/layout/footer.tsx`)
- Nền Navy Hoàng gia sang trọng `#071A2B` với 4 cột thông tin rõ ràng:
  1. Giới thiệu nhà xe, địa chỉ văn phòng, giờ đón khách.
  2. Bảng các tuyến trọng điểm và giá vé tham khảo.
  3. Danh mục các dịch vụ cung cấp.
  4. Hotline đặt xe 24/7 (`0868680944` - `0866834442`), Facebook Vũ Công Minh, Zalo hỗ trợ.
- Thanh bản quyền chân trang có liên kết nhanh đến Trang tra cứu, UI Showcase và Cổng quản trị viên (`/admin/login`).

### 4.3. Tiện Ích Liên Hệ Nổi (`FloatingQuickActions`)
- Cố định tại góc dưới bên phải màn hình:
  - **Nút Gọi Hotline:** Màu vàng kim với vòng tròn sóng xung kích nổi bật, nhấn là gọi ngay.
  - **Nút Chat Zalo:** Màu xanh Zalo chính thức, kết nối trực tiếp tài khoản hỗ trợ.
  - **Nút Cuộn Lên Đầu Trang (Back to top):** Tự động xuất hiện mượt mà khi người dùng cuộn xuống quá 300px.
- Đảm bảo vị trí an toàn không che khuất các nút bấm chính hoặc bàn phím trên điện thoại.

---

## 5. QUY CHUẨN RESPONSIVE TRÊN 11 VIEWPORTS

| Viewport | Thiết Bị Đại Diện | Quy Chuẩn Hiển Thị |
| :--- | :--- | :--- |
| **320px** | iPhone SE đời cũ, màn hình cực hẹp | Header co gọn, typography 28px, nút full width, menu drawer |
| **360px** | Samsung Galaxy A, Android phổ thông | Layout 1 cột, padding 16px, thẻ Card co giãn tự nhiên |
| **375px** | iPhone X / 11 / 12 mini | Khoảng cách chuẩn, tap target >= 44px |
| **390px - 414px**| iPhone 13/14/15 Pro Max, Android lớn | Grid 2 cột cho các thông số và tính năng nhỏ |
| **768px** | iPad / Tablet portrait | Grid 2 cột cho danh sách thẻ dịch vụ, Header hiển thị gọn |
| **1024px** | iPad Pro / Laptop nhỏ | Bắt đầu hiển thị thanh menu ngang Desktop đầy đủ |
| **1280px - 1440px**| Màn hình Desktop / Laptop tiêu chuẩn | Bố cục hoàn chỉnh 4 cột, Hero banner căn lề 2 bên rộng rãi |
| **1920px** | Màn hình Full HD / Siêu rộng | Khóa max-width `max-w-7xl` căn giữa, không kéo dãn vỡ tỷ lệ |

---

## 6. QUY CHUẨN ACCESSIBILITY (A11Y)
1. Tất cả nút chỉ có icon bắt buộc phải có thuộc tính `aria-label`.
2. Trường nhập liệu bắt buộc liên kết với nhãn qua `htmlFor` và `id`.
3. Modal Dialog phải có thuộc tính `role="dialog"`, `aria-modal="true"`, và đóng được bằng phím `Escape`.
4. Hỗ trợ đầy đủ `prefers-reduced-motion` để vô hiệu hóa animation đối với người dùng nhạy cảm với chuyển động.
