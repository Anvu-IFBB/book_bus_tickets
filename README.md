# 🚐 Hệ thống Booking & Quản lý dịch vụ Limousine

> **Tên hệ thống:** Limousine Quảng Ninh -- Hải Phòng -- Thái Bình --
> Nam Định -- Ninh Bình\
> **Mục tiêu:** Xây dựng website booking, quản lý khách hàng, quản lý
> chuyến xe, nhận gửi hàng, xe hợp đồng và tự động thu thập đánh
> giá/phản hồi khách hàng.\
> **Định hướng:** Website sử dụng thực tế cho hoạt động kinh doanh, ưu
> tiên chi phí vận hành thấp, dễ bảo trì, responsive trên
> Desktop/Tablet/Mobile và có khả năng mở rộng.

------------------------------------------------------------------------

## 1. Tổng quan

Hệ thống được xây dựng dựa trên thông tin dịch vụ:

-   Limousine tuyến **Quảng Ninh -- Hải Phòng -- Thái Bình -- Nam Định
    -- Ninh Bình và ngược lại**.
-   Nhận gửi hàng hóa quanh các tỉnh miền Bắc và miền Trung.
-   Nhận hợp đồng xe **5 -- 7 -- 11 -- 16 -- 29 chỗ**.
-   Booking vé xe đi các khu du lịch.
-   Hotline: **0868680944 -- 0866834442**.
-   Facebook: **Vũ Công Minh**.

Hệ thống không chỉ là website giới thiệu mà là một **mini CRM + Booking
Management + Feedback Management System**.

### Mục tiêu chính

1.  Cho khách đặt xe nhanh mà không cần tạo tài khoản.
2.  Tạo mã booking tự động.
3.  Cho khách tra cứu tình trạng booking.
4.  Cho quản trị viên tiếp nhận và xử lý booking.
5.  Quản lý khách hàng.
6.  Quản lý tuyến, xe, tài xế và chuyến.
7.  Quản lý gửi hàng.
8.  Quản lý xe hợp đồng.
9.  Tự động gửi yêu cầu đánh giá sau khi chuyến hoàn thành.
10. Phân loại đánh giá tốt/xấu để xử lý.
11. Thống kê booking, doanh thu và chất lượng dịch vụ.
12. Có khả năng mở rộng sang email, Zalo OA, Google Business Profile và
    các dịch vụ API chính thức.

------------------------------------------------------------------------

# 2. Phạm vi hệ thống

## 2.1. Website khách hàng

Khách có thể:

-   Xem thông tin dịch vụ.
-   Xem tuyến xe.
-   Xem loại xe.
-   Đặt vé.
-   Yêu cầu thuê xe hợp đồng.
-   Gửi yêu cầu vận chuyển hàng hóa.
-   Booking xe đi khu du lịch.
-   Tra cứu booking.
-   Gửi đánh giá.
-   Xem thông tin liên hệ.
-   Gọi hotline.
-   Mở Facebook/Zalo.
-   Xem các đánh giá nổi bật.

## 2.2. Admin Dashboard

Quản trị viên có thể:

-   Đăng nhập.
-   Xem dashboard.
-   Quản lý booking.
-   Quản lý khách hàng.
-   Quản lý tuyến.
-   Quản lý xe.
-   Quản lý tài xế.
-   Quản lý chuyến.
-   Quản lý thanh toán/đặt cọc.
-   Quản lý đánh giá.
-   Xử lý phản hồi tiêu cực.
-   Xem báo cáo.
-   Quản lý nội dung website.
-   Quản lý cấu hình hệ thống.

------------------------------------------------------------------------

# 3. Kiến trúc tổng thể

``` text
                           KHÁCH HÀNG
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
          Website            Booking           Feedback
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                         FRONTEND WEB
                               │
                               ▼
                         BACKEND / API
                               │
              ┌────────────────┼────────────────┐
              │                │                │
          Database          Storage         Automation
              │                │                │
              ▼                ▼                ▼
         Booking/CRM       Hình ảnh        Cron/Email
              │
              ▼
        ADMIN DASHBOARD
```

------------------------------------------------------------------------

# 4. Công nghệ đề xuất

## Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Lucide Icons

## Backend / Database

### Phương án ưu tiên

-   Firebase Authentication
-   Firebase Firestore
-   Firebase Storage
-   Firebase Hosting hoặc Cloudflare Pages

### Phương án thay thế

-   Supabase
-   PostgreSQL
-   Supabase Auth
-   Supabase Storage
-   Edge Functions

Không triển khai đồng thời hai backend ở phiên bản đầu tiên.

## Automation

-   Cloudflare Workers
-   Cloudflare Cron Triggers
-   Resend cho email transactional nếu cần
-   API chính thức của bên thứ ba khi có nhu cầu.

## Source control

-   Git
-   GitHub

## AI Development

-   Antigravity

------------------------------------------------------------------------

# 5. Nguyên tắc phát triển với Antigravity

Antigravity phải làm việc theo từng phase, không được tự ý xây toàn bộ
hệ thống trong một lần.

### Quy tắc bắt buộc

1.  Đọc toàn bộ project trước khi sửa.
2.  Không xóa code đang hoạt động nếu chưa xác định cần thay thế.
3.  Không thay đổi database schema tùy tiện.
4.  Không thay đổi API contract mà không cập nhật tài liệu.
5.  Không hard-code dữ liệu nghiệp vụ quan trọng.
6.  Không đưa secret/API key vào source code.
7.  Không commit file `.env`.
8.  Mọi thay đổi lớn phải được kiểm tra lại các module liên quan.
9.  Sau mỗi phase phải chạy build/test.
10. Sau mỗi thay đổi UI phải kiểm tra responsive.
11. Không sửa một lỗi responsive bằng cách phá layout ở màn hình khác.
12. Ưu tiên backward compatibility.
13. Không dùng automation giả lập đăng nhập Facebook/Zalo cá nhân.
14. Chỉ tích hợp API chính thức khi có quyền và tài liệu phù hợp.

------------------------------------------------------------------------

# 6. Cấu trúc project đề xuất

``` text
project-root/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── booking/
│   │   ├── tracking/
│   │   ├── feedback/
│   │   ├── services/
│   │   ├── routes/
│   │   │
│   │   └── admin/
│   │       ├── login/
│   │       ├── dashboard/
│   │       ├── bookings/
│   │       ├── customers/
│   │       ├── vehicles/
│   │       ├── drivers/
│   │       ├── routes/
│   │       ├── trips/
│   │       ├── payments/
│   │       ├── feedback/
│   │       └── reports/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── booking/
│   │   ├── admin/
│   │   ├── feedback/
│   │   └── layout/
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── feedback/
│   │   ├── notifications/
│   │   └── utils/
│   │
│   ├── hooks/
│   ├── types/
│   └── styles/
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   └── deployment.md
│
├── .env.local
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

------------------------------------------------------------------------

# 7. Sitemap

``` text
/
├── Trang chủ
├── Dịch vụ
│   ├── Booking vé xe
│   ├── Thuê xe hợp đồng
│   ├── Gửi hàng
│   └── Xe đi khu du lịch
├── Tuyến xe
├── Tra cứu booking
├── Đánh giá
├── Giới thiệu
└── Liên hệ

/admin
├── Login
├── Dashboard
├── Booking
├── Khách hàng
├── Tuyến xe
├── Xe
├── Tài xế
├── Chuyến xe
├── Thanh toán
├── Đánh giá
├── Báo cáo
└── Cài đặt
```

------------------------------------------------------------------------

# 8. Trang chủ

Trang chủ phải truyền tải ngay 4 giá trị:

### 1. Tuyến phục vụ

**Quảng Ninh -- Hải Phòng -- Thái Bình -- Nam Định -- Ninh Bình và ngược
lại.**

### 2. Dịch vụ

-   Booking vé xe.
-   Thuê xe hợp đồng.
-   Nhận gửi hàng.
-   Booking khu du lịch.

### 3. Loại xe

-   5 chỗ.
-   7 chỗ.
-   11 chỗ.
-   16 chỗ.
-   29 chỗ.

### 4. Liên hệ

-   Hotline: 0868680944.
-   Hotline: 0866834442.
-   Facebook: Vũ Công Minh.
-   Có thể bổ sung Zalo khi có link chính thức.

------------------------------------------------------------------------

# 9. Thiết kế giao diện

## Màu chủ đạo

-   Navy: `#071A2B`
-   Gold: `#D4AF37`
-   White: `#FFFFFF`

## Phong cách

-   Sang trọng.
-   Tin cậy.
-   Dịch vụ vận tải cao cấp.
-   Ít hiệu ứng thừa.
-   CTA rõ ràng.
-   Ưu tiên khả năng đặt xe nhanh.

## Responsive

Phải kiểm tra tối thiểu:

-   Mobile 320px.
-   Mobile 360px.
-   Mobile 375px.
-   Mobile 390px.
-   Mobile 414px.
-   Tablet.
-   Laptop 1366px.
-   Desktop 1440px.
-   Desktop lớn 1920px.

Không được chỉ kiểm tra bằng cách thu nhỏ cửa sổ desktop.

------------------------------------------------------------------------

# 10. Module Booking

## 10.1. Booking vé xe

Form:

``` text
Loại dịch vụ
Điểm đi
Điểm đến
Ngày đi
Giờ đi
Một chiều / Khứ hồi
Số lượng khách
Điểm đón
Tên khách
Số điện thoại
Ghi chú
```

### Validation

-   Tên không được rỗng.
-   Số điện thoại phải hợp lệ.
-   Điểm đi không được trùng điểm đến.
-   Ngày đi không được ở quá khứ.
-   Số khách \>= 1.
-   Các trường bắt buộc phải có dữ liệu.

------------------------------------------------------------------------

# 11. Thuê xe hợp đồng

Loại xe:

``` text
5 chỗ
7 chỗ
11 chỗ
16 chỗ
29 chỗ
```

Thông tin:

``` text
Loại xe
Ngày thuê
Giờ đón
Điểm đón
Điểm đến
Số ngày
Số khách
Tên khách
Số điện thoại
Yêu cầu đặc biệt
Ghi chú
```

Giá có thể:

-   Nhập thủ công bởi admin.
-   Hoặc cấu hình bảng giá sau này.

Không hard-code giá vào frontend.

------------------------------------------------------------------------

# 12. Gửi hàng

Form:

``` text
Người gửi
Số điện thoại người gửi

Người nhận
Số điện thoại người nhận

Điểm gửi
Điểm nhận

Loại hàng
Số lượng
Khối lượng dự kiến
Ngày gửi
Ghi chú
```

Hệ thống tạo mã yêu cầu riêng.

Ví dụ:

``` text
HG202609110001
```

------------------------------------------------------------------------

# 13. Booking khu du lịch

Khách nhập:

``` text
Địa điểm/khu du lịch
Ngày đi
Ngày về
Số khách
Loại xe
Điểm đón
Tên
Số điện thoại
Ghi chú
```

Admin nhận yêu cầu và báo giá/xác nhận thủ công ở phiên bản đầu.

------------------------------------------------------------------------

# 14. Mã booking

Mỗi booking phải có mã duy nhất.

Ví dụ:

``` text
BK202609110001
BK202609110002
BK202609110003
```

Không dùng ID database trực tiếp làm mã hiển thị cho khách.

------------------------------------------------------------------------

# 15. Trạng thái booking

``` text
NEW
CONTACTING
CONFIRMED
DEPOSIT_PAID
PAID
IN_PROGRESS
COMPLETED
CANCELLED
```

Hiển thị tiếng Việt:

  Code           Hiển thị
  -------------- ----------------
  NEW            Mới
  CONTACTING     Đang liên hệ
  CONFIRMED      Đã xác nhận
  DEPOSIT_PAID   Đã đặt cọc
  PAID           Đã thanh toán
  IN_PROGRESS    Đang thực hiện
  COMPLETED      Hoàn thành
  CANCELLED      Đã hủy

Mọi thay đổi trạng thái quan trọng nên có lịch sử.

------------------------------------------------------------------------

# 16. Tra cứu booking

Khách nhập:

``` text
Mã booking
+
Số điện thoại
```

Sau khi xác thực, hiển thị:

``` text
Mã booking
Dịch vụ
Điểm đi
Điểm đến
Ngày
Giờ
Số khách
Xe
Trạng thái
Thông tin liên hệ
```

Không hiển thị dữ liệu nhạy cảm không cần thiết.

------------------------------------------------------------------------

# 17. Database

## customers

``` text
id
name
phone
email
address
note
totalBookings
completedBookings
cancelledBookings
totalSpent
createdAt
updatedAt
```

## bookings

``` text
id
bookingCode
customerId
serviceType
departure
destination
travelDate
travelTime
returnDate
passengerCount
pickupAddress
dropoffAddress
vehicleType
vehicleId
driverId
tripId
price
deposit
paymentStatus
bookingStatus
note
createdAt
updatedAt
completedAt
```

## routes

``` text
id
departure
destination
active
note
createdAt
updatedAt
```

## vehicles

``` text
id
name
licensePlate
seatCount
vehicleType
status
note
createdAt
updatedAt
```

## drivers

``` text
id
name
phone
licenseNumber
vehicleId
status
note
createdAt
updatedAt
```

## trips

``` text
id
routeId
vehicleId
driverId
departureTime
arrivalTime
status
note
createdAt
updatedAt
```

## payments

``` text
id
bookingId
amount
type
method
status
transactionCode
paidAt
note
```

## feedback

``` text
id
bookingId
customerId
rating
content
category
status
adminNote
submittedAt
processedAt
```

## notifications

``` text
id
bookingId
customerId
type
channel
status
sentAt
error
```

## settings

``` text
hotline
facebookUrl
zaloUrl
companyName
address
workingHours
feedbackDelayHours
```

------------------------------------------------------------------------

# 18. Admin Dashboard

Dashboard phải có:

### Tổng quan

-   Booking hôm nay.
-   Booking chờ xử lý.
-   Booking đã xác nhận.
-   Chuyến hôm nay.
-   Doanh thu.
-   Đánh giá trung bình.
-   Feedback cần xử lý.

### Booking mới

Hiển thị:

``` text
Mã
Khách
SĐT
Dịch vụ
Tuyến
Ngày
Trạng thái
Thao tác
```

Thao tác:

``` text
Xem
Sửa
Xác nhận
Hủy
Đánh dấu hoàn thành
```

------------------------------------------------------------------------

# 19. Quản lý khách hàng

Admin có thể:

-   Xem danh sách.
-   Tìm kiếm.
-   Lọc.
-   Xem lịch sử booking.
-   Xem tổng tiền.
-   Xem số lần đặt.
-   Xem đánh giá.
-   Thêm ghi chú.

### Customer Detail

``` text
Nguyễn Văn A

SĐT: 09xxxxxxxx

Booking: 8
Hoàn thành: 7
Hủy: 1

Tổng tiền: x.xxx.xxxđ

Lịch sử:
BK001
BK005
BK010
...
```

------------------------------------------------------------------------

# 20. Quản lý xe

Thông tin:

``` text
Tên xe
Biển số
Số chỗ
Loại xe
Trạng thái
Ghi chú
```

Trạng thái:

``` text
AVAILABLE
ASSIGNED
MAINTENANCE
INACTIVE
```

Không cho phép gán xe đang bảo dưỡng vào chuyến mới.

------------------------------------------------------------------------

# 21. Quản lý tài xế

Thông tin:

``` text
Họ tên
Số điện thoại
GPLX
Xe phụ trách
Trạng thái
Ghi chú
```

Không cho phép gán tài xế không hoạt động vào chuyến.

------------------------------------------------------------------------

# 22. Quản lý tuyến

Admin có thể:

-   Thêm tuyến.
-   Sửa tuyến.
-   Bật/tắt tuyến.
-   Tìm kiếm.
-   Sắp xếp.

Ví dụ:

``` text
Quảng Ninh → Hải Phòng
Hải Phòng → Quảng Ninh

Hải Phòng → Thái Bình
Thái Bình → Hải Phòng

Thái Bình → Nam Định
Nam Định → Thái Bình

Nam Định → Ninh Bình
Ninh Bình → Nam Định

Ninh Bình → Quảng Ninh
Quảng Ninh → Ninh Bình
```

Danh sách thực tế phải cho phép admin thay đổi.

------------------------------------------------------------------------

# 23. Quản lý chuyến

Mỗi chuyến gồm:

``` text
Tuyến
Ngày
Giờ
Xe
Tài xế
Số khách
Booking
Trạng thái
```

Trạng thái:

``` text
PLANNED
CONFIRMED
DEPARTED
COMPLETED
CANCELLED
```

Có thể hiển thị dạng:

-   Danh sách.
-   Calendar.
-   Theo ngày.
-   Theo xe.
-   Theo tài xế.

------------------------------------------------------------------------

# 24. Thanh toán

Phiên bản đầu:

-   Admin nhập số tiền.
-   Ghi nhận đặt cọc.
-   Ghi nhận thanh toán.
-   Nhập phương thức.
-   Ghi chú.

Phương thức:

``` text
CASH
BANK_TRANSFER
QR
OTHER
```

Không lưu số thẻ ngân hàng hoặc thông tin tài chính nhạy cảm.

Nếu sử dụng QR ngân hàng, chỉ lưu:

-   Ảnh QR công khai của doanh nghiệp.
-   Nội dung chuyển khoản.
-   Trạng thái thanh toán.
-   Mã giao dịch nếu có.

------------------------------------------------------------------------

# 25. Hệ thống Feedback

Đây là module quan trọng.

Khi booking:

``` text
bookingStatus = COMPLETED
```

hệ thống tạo feedback request.

Ví dụ link:

``` text
/feedback/BK202609110001
```

Khách đánh giá:

``` text
⭐⭐⭐⭐⭐
```

và nhập:

``` text
Tên
Số điện thoại
Nội dung
```

------------------------------------------------------------------------

# 26. Phân loại đánh giá

### 5 sao

``` text
POSITIVE
```

Có thể hiển thị trong khu vực:

> Khách hàng nói gì về chúng tôi

và mời khách chia sẻ sang nền tảng bên ngoài.

### 4 sao

``` text
POSITIVE
```

### 3 sao

``` text
NEUTRAL
```

### 1--2 sao

``` text
NEEDS_REVIEW
```

Đánh giá 1--3 sao không tự động đưa ra khu vực testimonial công khai nếu
chưa được admin kiểm tra.

------------------------------------------------------------------------

# 27. Xử lý feedback tiêu cực

Admin thấy:

``` text
⚠️ Feedback cần xử lý

Khách: Nguyễn Văn A
Booking: BK001
Rating: ⭐⭐

Nội dung:
...
```

Thao tác:

``` text
Liên hệ khách
Thêm ghi chú
Đánh dấu đang xử lý
Đánh dấu đã xử lý
```

Trạng thái:

``` text
NEW
IN_REVIEW
CONTACTED
RESOLVED
IGNORED
```

------------------------------------------------------------------------

# 28. Automation Flow

## Booking mới

``` text
Khách gửi form
      ↓
Validate
      ↓
Tạo customer
      ↓
Tạo booking
      ↓
Sinh bookingCode
      ↓
Thông báo admin
      ↓
Hiển thị kết quả cho khách
```

## Booking xác nhận

``` text
Admin CONFIRMED
      ↓
Lưu trạng thái
      ↓
Ghi lịch sử
      ↓
Thông báo khách nếu đã cấu hình kênh gửi
```

## Booking hoàn thành

``` text
COMPLETED
      ↓
Chờ feedbackDelayHours
      ↓
Tạo feedback request
      ↓
Gửi email/thông báo
      ↓
Khách đánh giá
```

## Feedback

``` text
5 sao ───────→ Positive
4 sao ───────→ Positive
3 sao ───────→ Neutral
1-2 sao ─────→ Needs Review
```

------------------------------------------------------------------------

# 29. Cron Jobs

Có thể chạy định kỳ:

``` text
Mỗi ngày 08:00
    ↓
Kiểm tra booking hôm nay

Mỗi giờ
    ↓
Kiểm tra feedback cần gửi

Mỗi ngày
    ↓
Kiểm tra booking quá hạn xử lý

Mỗi tuần
    ↓
Tạo báo cáo
```

Cron phải idempotent: chạy lại không được tạo bản ghi/trạng thái trùng.

------------------------------------------------------------------------

# 30. Email

Email chỉ là kênh tùy chọn.

Các email có thể có:

``` text
Booking Received
Booking Confirmed
Booking Cancelled
Trip Reminder
Feedback Request
```

Không gửi email hàng loạt nếu chưa có cơ chế chống spam và giới hạn gửi.

------------------------------------------------------------------------

# 31. Zalo / Facebook

Không xây bot tự động đăng nhập tài khoản Facebook/Zalo cá nhân.

Ưu tiên:

``` text
Website
   ↓
Nút Facebook
Nút Zalo
Nút Gọi điện
```

Nếu cần automation:

-   Dùng API/OA chính thức.
-   Có quyền truy cập hợp lệ.
-   Tuân thủ chính sách nền tảng.
-   Không lưu mật khẩu tài khoản cá nhân.

------------------------------------------------------------------------

# 32. Google Review

Phiên bản đầu:

``` text
Website Feedback
       ↓
Khách đánh giá
       ↓
Nếu tích cực
       ↓
Hiển thị nút "Đánh giá Google"
```

Phiên bản nâng cao có thể nghiên cứu tích hợp Google Business Profile
API.

Không tự động tạo đánh giá giả.

Không ép khách phải đánh giá 5 sao.

------------------------------------------------------------------------

# 33. Bảo mật

## Admin Authentication

-   Email/password hoặc phương thức xác thực phù hợp.
-   Role-based access.
-   Không lưu password dạng plain text.

## Phân quyền

``` text
ADMIN
MANAGER
STAFF
```

Ví dụ:

### ADMIN

Toàn quyền.

### MANAGER

Quản lý booking, khách, chuyến, feedback.

### STAFF

Xem/xử lý booking theo quyền được cấp.

------------------------------------------------------------------------

# 34. Environment Variables

Tạo:

``` text
.env.local
.env.example
```

Ví dụ:

``` env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

RESEND_API_KEY=
```

Không commit:

``` text
.env.local
```

`.env.example` chỉ chứa tên biến, không chứa secret thật.

------------------------------------------------------------------------

# 35. Firestore Security

Không được để database ở chế độ:

``` text
allow read, write: if true;
```

Phải có rule:

-   Public chỉ tạo booking/feedback ở mức cần thiết.
-   Public không được đọc toàn bộ customers.
-   Public không được đọc toàn bộ bookings.
-   Admin mới được đọc dữ liệu quản trị.
-   Kiểm tra quyền ở server/backend khi phù hợp.

------------------------------------------------------------------------

# 36. Chống spam

Booking public phải có:

-   Validation.
-   Rate limiting.
-   Honeypot hoặc CAPTCHA khi cần.
-   Giới hạn request.
-   Chống submit liên tục.
-   Sanitization input.

Feedback cũng cần cơ chế chống spam.

------------------------------------------------------------------------

# 37. SEO

Trang public phải có:

-   Title.
-   Meta description.
-   Open Graph.
-   Favicon.
-   Sitemap.
-   Robots.
-   Structured data phù hợp.
-   URL thân thiện.

Ví dụ:

``` text
/
/dich-vu
/dich-vu/booking-ve
/dich-vu/thue-xe
/dich-vu/gui-hang
/tuyen-xe
/tra-cuu
```

Không dùng URL:

``` text
/page?id=123
```

cho các trang public nếu có thể tránh.

------------------------------------------------------------------------

# 38. Responsive Checklist

## Mobile

Kiểm tra:

-   Header.
-   Menu.
-   Hero.
-   Form booking.
-   Input.
-   Select.
-   Button.
-   Table.
-   Modal.
-   Toast.
-   Dashboard.
-   Calendar.
-   Footer.
-   Floating call button.

## Desktop

Kiểm tra:

-   Container.
-   Grid.
-   Sidebar.
-   Dashboard cards.
-   Data table.
-   Modal.
-   Chart.
-   Navigation.

### Quy tắc

Một sửa lỗi mobile không được làm hỏng:

-   Desktop.
-   Tablet.
-   Các component khác.
-   Logic booking.
-   Database.
-   Admin.

------------------------------------------------------------------------

# 39. Accessibility

Cần có:

-   Label cho input.
-   Keyboard navigation.
-   Focus state.
-   Contrast tốt.
-   Alt cho hình ảnh.
-   Button có tên rõ ràng.
-   Không dùng màu sắc là cách duy nhất để biểu diễn trạng thái.

------------------------------------------------------------------------

# 40. Logging

Các lỗi quan trọng cần log:

``` text
Booking creation failed
Feedback creation failed
Email failed
Authentication failed
Database error
Automation error
```

Không log:

-   Password.
-   API key.
-   Token.
-   Thông tin thanh toán nhạy cảm.

------------------------------------------------------------------------

# 41. Backup

Database phải có phương án backup.

Khuyến nghị:

``` text
Database
   ↓
Scheduled Export
   ↓
JSON / CSV
   ↓
Backup Storage
```

Các dữ liệu quan trọng:

-   customers.
-   bookings.
-   payments.
-   feedback.
-   routes.
-   vehicles.
-   drivers.

------------------------------------------------------------------------

# 42. Công cụ miễn phí / chi phí thấp

  Thành phần   Đề xuất
  ------------ ---------------------------------
  IDE/AI       Antigravity
  Code         GitHub
  Frontend     Next.js
  UI           Tailwind CSS + shadcn/ui
  Database     Firebase
  Auth         Firebase Auth
  Storage      Firebase Storage
  Hosting      Cloudflare Pages
  Automation   Cloudflare Workers
  Cron         Cloudflare Cron
  Email        Resend
  Báo cáo      Google Sheets
  Icon         Lucide
  Domain       Dùng subdomain miễn phí lúc đầu

### Lưu ý

Các gói miễn phí đều có quota và chính sách riêng. Không coi dịch vụ
cloud là miễn phí vô hạn.

Thiết kế hệ thống phải:

-   Theo dõi usage.
-   Có backup.
-   Không phụ thuộc quá sâu vào một dịch vụ nếu có thể.
-   Dễ chuyển database khi hệ thống phát triển.

------------------------------------------------------------------------

# 43. Chiến lược triển khai

## Phase 0 -- Phân tích

Không code.

Tạo:

``` text
PROJECT_SPEC.md
ARCHITECTURE.md
DATABASE.md
USER_FLOW.md
ADMIN_FLOW.md
```

## Phase 1 -- UI

Xây:

-   Header.
-   Footer.
-   Home.
-   Services.
-   Routes.
-   Contact.
-   Responsive.

## Phase 2 -- Booking

Xây:

-   Booking form.
-   Validation.
-   Booking code.
-   Database.
-   Tracking.

## Phase 3 -- Admin

Xây:

-   Login.
-   Dashboard.
-   Booking management.
-   Customer management.

## Phase 4 -- Operations

Xây:

-   Routes.
-   Vehicles.
-   Drivers.
-   Trips.
-   Payments.

## Phase 5 -- Feedback

Xây:

-   Feedback form.
-   Rating.
-   Feedback dashboard.
-   Negative feedback workflow.

## Phase 6 -- Automation

Xây:

-   Cron.
-   Feedback reminder.
-   Email.
-   Notifications.

## Phase 7 -- Reports

Xây:

-   Revenue.
-   Booking statistics.
-   Customer statistics.
-   Route statistics.
-   Feedback statistics.

## Phase 8 -- Production

Kiểm tra:

-   Security.
-   Responsive.
-   SEO.
-   Performance.
-   Error handling.
-   Backup.
-   Deployment.

------------------------------------------------------------------------

# 44. Definition of Done

Một module chỉ được coi là hoàn thành khi:

-   [ ] Chức năng hoạt động.
-   [ ] Validation hoạt động.
-   [ ] Loading state có.
-   [ ] Empty state có.
-   [ ] Error state có.
-   [ ] Success feedback có.
-   [ ] Responsive.
-   [ ] Không có console error.
-   [ ] Không có TypeScript error.
-   [ ] Build thành công.
-   [ ] Không phá module cũ.
-   [ ] Security rules được kiểm tra.
-   [ ] Code dễ bảo trì.
-   [ ] README/tài liệu được cập nhật nếu architecture thay đổi.

------------------------------------------------------------------------

# 45. Test Checklist

## Booking

-   [ ] Booking hợp lệ.
-   [ ] Booking thiếu tên.
-   [ ] Booking thiếu số điện thoại.
-   [ ] Số điện thoại sai.
-   [ ] Ngày quá khứ.
-   [ ] Điểm đi = điểm đến.
-   [ ] Submit liên tục.
-   [ ] Mạng lỗi.
-   [ ] Database lỗi.

## Admin

-   [ ] Login đúng.
-   [ ] Login sai.
-   [ ] Logout.
-   [ ] Không truy cập admin khi chưa đăng nhập.
-   [ ] Role không đủ quyền.
-   [ ] CRUD booking.
-   [ ] CRUD customer.
-   [ ] CRUD vehicle.
-   [ ] CRUD driver.
-   [ ] CRUD route.

## Feedback

-   [ ] Feedback hợp lệ.
-   [ ] Rating 1 sao.
-   [ ] Rating 5 sao.
-   [ ] Feedback trùng.
-   [ ] Feedback sau booking chưa hoàn thành.
-   [ ] Feedback link không hợp lệ.
-   [ ] Admin xử lý feedback.

------------------------------------------------------------------------

# 46. Quy tắc dữ liệu

Không xóa cứng dữ liệu nghiệp vụ quan trọng nếu không cần.

Ưu tiên:

``` text
active = false
```

thay vì xóa:

``` text
DELETE
```

Ví dụ tuyến cũ:

``` text
routes.active = false
```

Xe ngừng hoạt động:

``` text
vehicles.status = INACTIVE
```

Nhờ vậy lịch sử booking vẫn giữ nguyên.

------------------------------------------------------------------------

# 47. Audit Log

Các hành động quan trọng nên có log:

``` text
Admin login
Booking created
Booking status changed
Payment updated
Vehicle changed
Driver assigned
Feedback processed
```

Ví dụ:

``` text
ADMIN: admin@example.com
ACTION: BOOKING_STATUS_CHANGED
BOOKING: BK202609110001
FROM: NEW
TO: CONFIRMED
TIME: ...
```

------------------------------------------------------------------------

# 48. Không làm trong phiên bản đầu

Để tránh dự án quá phức tạp, V1 không cần:

-   App mobile native.
-   Chatbot AI.
-   Bot Facebook cá nhân.
-   Bot Zalo cá nhân.
-   Thanh toán online phức tạp.
-   GPS tracking real-time.
-   Tự động điều phối xe bằng AI.
-   Hệ thống kế toán đầy đủ.
-   Loyalty point phức tạp.

Các chức năng này chỉ làm sau khi core system ổn định.

------------------------------------------------------------------------

# 49. Roadmap nâng cấp

## V1

``` text
Website
+
Booking
+
Admin
+
CRM
+
Feedback
```

## V2

``` text
Email
+
Calendar
+
Reports
+
Google Review
+
Advanced notifications
```

## V3

``` text
Zalo OA API
+
Online payment
+
Driver portal
+
Vehicle management
```

## V4

``` text
Mobile app
+
Real-time location
+
Advanced CRM
+
Marketing automation
+
AI assistant
```

------------------------------------------------------------------------

# 50. Quy trình sử dụng thực tế

## Khách

``` text
1. Vào website
2. Chọn dịch vụ
3. Nhập thông tin
4. Gửi booking
5. Nhận mã booking
6. Chờ xác nhận
7. Thực hiện chuyến
8. Nhận link đánh giá
9. Gửi feedback
```

## Admin

``` text
1. Login
2. Xem booking mới
3. Liên hệ khách
4. Xác nhận
5. Gán xe
6. Gán tài xế
7. Theo dõi chuyến
8. Đánh dấu hoàn thành
9. Hệ thống gửi feedback request
10. Theo dõi đánh giá
11. Xử lý feedback xấu
12. Xem báo cáo
```

------------------------------------------------------------------------

# 51. Hướng dẫn chạy local

Sau khi clone project:

``` bash
git clone <repository-url>
cd <project-folder>
npm install
```

Tạo:

``` text
.env.local
```

Điền các biến môi trường cần thiết.

Chạy:

``` bash
npm run dev
```

Mở:

``` text
http://localhost:3000
```

Build:

``` bash
npm run build
```

Chạy production local:

``` bash
npm run start
```

Lint:

``` bash
npm run lint
```

------------------------------------------------------------------------

# 52. Git Workflow

Không làm việc trực tiếp trên `main`.

Đề xuất:

``` text
main
│
├── develop
│
├── feature/booking
├── feature/feedback
├── feature/admin
└── fix/responsive
```

Commit:

``` text
feat: add booking form
feat: add feedback dashboard
fix: mobile booking layout
fix: validate phone number
refactor: simplify booking service
docs: update README
```

------------------------------------------------------------------------

# 53. Quy tắc cho AI Agent

Trước khi sửa code:

``` text
1. Inspect project.
2. Identify affected files.
3. Explain intended changes.
4. Check dependencies.
5. Implement minimal change.
6. Run tests/build.
7. Check responsive.
8. Check regressions.
9. Summarize changed files.
```

AI không được:

``` text
- Xóa database.
- Xóa toàn bộ project.
- Thay framework tùy tiện.
- Đổi backend giữa chừng.
- Hard-code secret.
- Tạo dữ liệu giả trong production.
- Tự ý đổi business logic.
```

------------------------------------------------------------------------

# 54. Ưu tiên phát triển

Thứ tự ưu tiên:

``` text
P0 - Core
├── Booking
├── Admin
├── Database
└── Authentication

P1 - Operations
├── Customer
├── Route
├── Vehicle
├── Driver
└── Trip

P2 - Customer Experience
├── Tracking
├── Feedback
└── Notifications

P3 - Automation
├── Cron
├── Email
└── External APIs

P4 - Analytics
├── Revenue
├── Customer
├── Route
└── Feedback
```

------------------------------------------------------------------------

# 55. Mục tiêu cuối cùng

Hệ thống hoàn chỉnh phải giúp chủ dịch vụ:

``` text
                  WEBSITE
                     │
                     ▼
              KHÁCH ĐẶT XE
                     │
                     ▼
                  BOOKING
                     │
                     ▼
                  ADMIN
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
       XE          TÀI XẾ        KHÁCH
        │            │            │
        └────────────┼────────────┘
                     ▼
                   TRIP
                     │
                     ▼
                HOÀN THÀNH
                     │
                     ▼
              FEEDBACK REQUEST
                     │
                     ▼
                ĐÁNH GIÁ
              ┌──────┴──────┐
              ▼             ▼
            TỐT           XẤU
              │             │
              ▼             ▼
         Testimonial      Xử lý
              │             │
              └──────┬──────┘
                     ▼
                  REPORT
```

Mục tiêu không phải chỉ là **"có một website đẹp"**, mà là:

> **Giảm thời gian xử lý booking → hạn chế bỏ sót khách → lưu được lịch
> sử khách hàng → quản lý chuyến tốt hơn → tự động xin đánh giá → phát
> hiện phản hồi xấu → có dữ liệu để cải thiện và phát triển kinh
> doanh.**

------------------------------------------------------------------------

# 56. Trạng thái dự án

  Module                  Trạng thái
  ----------------------- ------------
  Project specification   ⬜
  UI/UX                   ⬜
  Homepage                ⬜
  Booking vé              ⬜
  Thuê xe                 ⬜
  Gửi hàng                ⬜
  Khu du lịch             ⬜
  Tracking                ⬜
  Admin auth              ⬜
  Dashboard               ⬜
  Customer CRM            ⬜
  Routes                  ⬜
  Vehicles                ⬜
  Drivers                 ⬜
  Trips                   ⬜
  Payments                ⬜
  Feedback                ⬜
  Automation              ⬜
  Email                   ⬜
  Reports                 ⬜
  SEO                     ⬜
  Security                ⬜
  Responsive              ⬜
  Production deployment   ⬜

------------------------------------------------------------------------

## 57. Ghi chú quan trọng

README này là **tài liệu đặc tả và hướng dẫn vận hành cấp hệ thống**.
Khi triển khai thực tế, nếu source code sử dụng stack khác với stack đề
xuất ở trên thì phải cập nhật lại README và các tài liệu `docs/` tương
ứng.

Mọi thay đổi business logic quan trọng phải được cập nhật tài liệu trước
hoặc đồng thời với code.

**Version:** `1.0.0`\
**Document type:** System README / Project Specification\
**Language:** Vietnamese
