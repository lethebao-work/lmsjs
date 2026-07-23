# 🎨 Kế Hoạch Thiết Kế UI/UX: Cổng Thư Viện Trường Học Thông Minh (LMSJS Smart Library Portal)

> **Mục tiêu**: Nâng cấp giao diện và trải nghiệm người dùng (UI/UX) của project **LMSJS** từ mẫu ứng dụng CRUD cơ bản thành một **Cổng Thư viện Đại học / Trường học hiện đại, đẳng cấp và chuyên nghiệp** (tương tự thư viện các trường đại học lớn như VinUni, RMIT, FPT University, Bách Khoa).

---

## 📐 1. Hệ Thống Nhận Diện Thương Hiệu & Design System (Design Tokens)

### 1.1. Bảng Màu Thư Viện Tri Thức (Color Palette)
- **Primary Color (Xanh Tri Thức)**: `#0F172A` (Slate 900) & `#1E3A8A` (Blue 900) — Tạo cảm giác uy tín, học thuật và hiện đại.
- **Secondary / Accent Color (Vàng Hổ Phách / Cam Đất)**: `#D97706` (Amber 600) & `#F59E0B` — Điểm nhấn sang trọng cho nút bấm, rating, thông báo nổi bật.
- **Background Color**: `#F8FAFC` (Slate 50) — Nền xám nhạt dịu mắt, tăng độ tập trung khi đọc sách/tra cứu.
- **Card & Surface Background**: `#FFFFFF` kết hợp với hiệu ứng đổ bóng nhẹ (`box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05)`).
- **Status Badges**:
  - `Sẵn sàng mượn`: Emerald Green (`#10B981`, nền `#ECFDF5`)
  - `Đang mượn`: Amber Gold (`#F59E0B`, nền `#FEF3C7`)
  - `Quá hạn`: Rose Red (`#F43F5E`, nền `#FFE4E6`)
  - `Giảng viên`: Indigo (`#6366F1`, nền `#EEF2FF`)
  - `Sinh viên`: Cyan Blue (`#06B6D4`, nền `#E0F2FE`)

### 1.2. Typography (Phông Chữ)
- **Primary Font**: Embed Google Fonts **`Plus Jakarta Sans`** hoặc **`Inter`** (hỗ trợ tiếng Việt hoàn hảo, hiện đại, sắc nét trên mọi màn hình).
- **Heading Styles**: Font-weight 700/800, letter-spacing vi mô để tăng vẻ tinh tế.

### 1.3. Micro-Interactions & Animation
- **Card Hover Effect**: Thẻ sách nảy nhẹ (`transform: translateY(-4px)`), đổ bóng đậm hơn và hiển thị quick action.
- **Smooth Transitions**: 0.2s–0.3s `ease-in-out` cho tất cả hiệu ứng chuyền tab, hover button, mở modal.
- **Skeleton Loaders**: Thay thế spinner mặc định bằng hiệu ứng load khung xương mượt mà.

---

## 🏛️ 2. Cấu Trúc Bố Cục & Trải Nghiệm Mới (Layout & UX Blueprint)

```
┌────────────────────────────────────────────────────────────────────────┐
│  [Logo LMSJS]   Trang chủ   Danh mục Sách   Tin tức   [🔍 Tra cứu]     │
│  [User Badge: Nguyễn Văn A (SV)]   [🔔 Notifications]   [Đăng xuất]   │
├────────────────────────────────────────────────────────────────────────┤
│  HERO SEARCH HUB (Banner tìm kiếm thông minh)                           │
│  "Khám phá hàng ngàn tài liệu, giáo trình & sách tham khảo..."         │
│  [ Input Tìm kiếm tên sách, tác giả, ISBN... ]  [Nút Tìm Kiếm]          │
├───────────────────┬────────────────────────────────────────────────────┤
│ SIDEBAR NAVIGATION│ MAIN CONTENT AREA                                  │
│ 📌 Dashboard     │ 📊 Thống kê nhanh / Card phím tắt                   │
│ 📚 Danh mục sách  │ 📖 Sách đang mượn (Có đếm ngược hạn trả)           │
│ 📑 Lịch sử mượn  │ ⭐ Sách mới nhập & Đề xuất nổi bật                 │
│ 💡 Gửi yêu cầu   │ 📌 Thông báo từ Thủ thư                             │
│ 👤 Hồ sơ cá nhân  │                                                    │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 📄 3. Chi Tiết Nâng Cấp UX/UI Cho Từng Trang (Page-by-Page Enhancement)

### 3.1. Trang Chủ (HomePage) — "Digital Library Hub"
- **Hero Section đẳng cấp**:
  - Banner gradient hiện đại với thanh tìm kiếm lớn ở trung tâm.
  - Quick Filter Pills ngay dưới thanh tìm kiếm: *[Tất cả]* *[Giáo trình CNTT]* *[Kinh tế]* *[Văn học]* *[Kỹ năng]* *[Sách có sẵn]*.
- **Thống kê nhanh thư viện (Live Counters)**:
  - 📖 `1,200+` Đầu sách | 🎓 `500+` Độc giả SV/GV | ⚡ `98%` Phục vụ nhanh chóng.
- **Khối "Dịch vụ thư viện" (Quick Services Grid)**:
  - 🔹 *Tra cứu giáo trình* | 🔹 *Đăng ký mượn online* | 🔹 *Đề xuất mua sách* | 🔹 *Nội quy & Giờ mở cửa*.
- **Slider / Grid Sách Nổi Bật**:
  - Thiết kế Card sách chuẩn Goodreads/Amazon (hiển thị ảnh bìa sắc nét, số sao trung bình, vị trí kệ sách, nút mượn nhanh).

### 3.2. Trang Danh Mục Sách (`/books`) & Tìm Kiếm Advanced
- **Bộ lọc đa chiều (Facet Search Bar)**:
  - Lọc theo Thể loại (Checkbox nhiều lựa chọn)
  - Lọc Trạng thái (Tất cả / Còn sách / Đang hết)
  - Sắp xếp (Mới nhất, Đánh giá cao nhất, Tên A-Z)
- **Giao diện chuyển đổi View Toggle**:
  - Chuyển đổi giữa **Grid View** (Thẻ bài) và **List View** (Bảng chi tiết dạng danh sách).
- **Visual Location Badge**: Hiển thị vị trí lưu trữ thực tế (Ví dụ: `Kệ A2 - Tầng 2`).

### 3.3. Trang Chi Tiết Sách (`/books/:id`)
- **Bố cục 2 Cột Chuyên Nghiệp**:
  - **Cột trái**: Bìa sách kích thước lớn, hiệu ứng 3D shadow nhẹ, trạng thái tình trạng kho (`Có sẵn 3/5 cuốn`), Nút hành động chính (`Đăng ký mượn sách`).
  - **Cột phải**: Tên sách h1 ấn tượng, Tác giả, Thể loại, Vị trí kệ, Đoạn tóm tắt nội dung (`Description`) trình bày đẹp mắt.
- **Phân đoạn Đánh giá & Bình luận (Review Hub)**:
  - Thống kê sao tổng quan (Ví dụ: `4.5 / 5` với thanh tỉ lệ phần trăm từng mức sao 5★ 4★ 3★...).
  - Form gửi bình luận có star-picker tương tác nhạy bén.
  - Avatar độc giả kèm Badge phân biệt **Sinh viên** / **Giảng viên**.

### 3.4. Bảng Điều Khiển Độc Giả (Member Dashboard)
- **Card Lịch Sử & Sách Đang Mượn**:
  - Card thông số có Icon đính kèm (Sách đang mượn, Yêu cầu chờ duyệt, Sách đã trả).
  - Bảng sách đang mượn tích hợp **Progress Bar đếm ngược hạn trả** (Ví dụ: Còn 5 ngày - Thanh Xanh / Quá hạn 2 ngày - Thanh Đỏ nhấp nháy).
  - Nút **"Gia hạn sách"** (Quick Extend Request - tính năng đề xuất mở rộng).

### 3.5. Bảng Điều Khiển Thủ Thư (Librarian Dashboard)
- **Giao diện Quản trị Chuyên nghiệp (Admin Command Center)**:
  - Header chào mừng cá nhân hóa kèm giờ hệ thống real-time.
  - 4 Thẻ chỉ số Analytics (Tổng sách, Tổng SV/GV, Đơn chờ duyệt, Quá hạn chưa trả).
  - **Quick Approval Drawer / Table**: Duyệt đơn mượn sách 1-Click với nút Duyệt (Xanh) & Từ chối (Đỏ outline), kèm xem thông tin chi tiết độc giả khi hover.

### 3.6. Trang Quản Lý Thành Viên (`/librarian/members`)
- **Phân loại rõ ràng SV / GV**:
  - Tabs phân loại: `[Tất cả]` `[Sinh viên (4)]` `[Giảng viên (2)]`.
  - Form nhập liệu thông minh (Smart Form): Tự động đổi fields khi chọn Sinh viên (MSSV, Lớp, Khoá) hoặc Giảng viên (Khoa, Chức danh).

### 3.7. Trang Đăng Nhập & Quên Mật Khẩu
- **Split Screen Layout**:
  - Bên trái: Hình ảnh đồ họa thư viện đại học hiện đại + Câu khẩu hiệu tri thức.
  - Bên phải: Form đăng nhập sạch sẽ, rõ ràng, có nút ẩn/hiện mật khẩu (Eye Icon).

---

## 🛠️ 4. Lộ Trình Triển Khai Kỹ Thuật (Technical Roadmap)

1. **Bước 1: Xây dựng Core CSS Design System (`src/index.css`)**
   - Định nghĩa CSS variables (Colors, Shadows, Radius, Transitions).
   - Tích hợp Google Font `Plus Jakarta Sans`.
   - Viết utilities class cho Badges, Buttons, Cards, Glassmorphism.

2. **Bước 2: Cải tiến Header / Navbar & Sidebar**
   - Làm mới Navbar với phong cách Dark Slate sang trọng, thêm Logo Icon thư viện, Search bar mini.
   - Nâng cấp Sidebar với hiệu ứng Active link sắc nét, Icon trực quan.

3. **Bước 3: Tối ưu Trang Chủ (HomePage) & Catalog (`/books`)**
   - Tạo Hero Search Section hoành tráng.
   - Nâng cấp `BookCard.jsx` với giao diện thẻ hiện đại.

4. **Bước 4: Nâng cấp Trang Chi Tiết Sách (`BookDetailPage.jsx`)**
   - Layout chi tiết sách chuyên nghiệp, hiển thị vị trí kệ, mô tả sách và thống kê đánh giá.

5. **Bước 5: Hoàn thiện Dashboards & Form Quản trị**
   - Thiết kế lại Dashboard cho Độc giả & Thủ thư với bảng biểu sạch đẹp, mượt mà.

---

## 📋 5. Kết Luận
Với bản thiết kế này, project **LMSJS** sẽ lột xác hoàn toàn thành một ứng dụng web thư viện trường học hiện đại, giàu tính thẩm mỹ và đạt chuẩn trải nghiệm người dùng cao cấp!
