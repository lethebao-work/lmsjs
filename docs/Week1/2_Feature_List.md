# Danh sách Tính năng (Feature List)

Dự án LMSJS bao gồm các tính năng chính chia theo từng nhóm người dùng, cùng các yêu cầu phi chức năng (Non-Functional Requirements) đảm bảo tính mở rộng và bảo mật.

## 1. Yêu cầu Chức năng (Functional Requirements)

### 1.1. Nhóm Khách vãng lai (Guest)
- **Xem sách nổi bật:** Xem các sách mới hoặc phổ biến ở trang chủ.
- **Danh mục sách:** Xem toàn bộ danh sách Sách có trong thư viện.
- **Chi tiết sách:** Xem thông tin tác giả, hình ảnh, thể loại, số lượng còn/tổng số.
- **Tìm kiếm & Lọc:** Tìm sách theo Tên (Title), Tác giả (Author), và Lọc theo Thể loại (Category).
- **Đăng nhập:** Truy cập `/login` để đăng nhập bằng Email và Password.

### 1.2. Nhóm Độc giả (Member)
- **Kế thừa quyền Guest:** Có toàn quyền tra cứu sách như Guest.
- **Dashboard:** Bảng điều khiển tóm tắt thống kê cá nhân.
- **Đăng ký mượn sách:** Gửi yêu cầu mượn (trạng thái "pending") trực tiếp từ trang Chi tiết sách.
- **Lịch sử mượn trả:** Xem bảng thống kê các sách đang yêu cầu, đang mượn, đã trả, bị từ chối.
- **Hồ sơ cá nhân:** Xem thông tin cá nhân (SĐT, giới tính, địa chỉ...).

### 1.3. Nhóm Thủ thư (Librarian)
- **Dashboard:** Xem thống kê tổng quan toàn bộ hệ thống thư viện.
- **Quản lý Sách (CRUD):** Thêm, Sửa, Xóa sách. Xem danh sách toàn bộ sách qua DataTable.
- **Quản lý Thể loại (CRUD):** Quản lý các danh mục phân loại sách.
- **Quản lý Độc giả (CRUD):** Quản lý hồ sơ thành viên thư viện.
- **Quản lý Mượn / Trả sách:**
  - Xem tất cả phiếu mượn trong hệ thống.
  - **Duyệt phiếu mượn:** Chuyển trạng thái từ "pending" sang "borrowed". (Hệ thống tự giảm `availableCopies`).
  - **Từ chối phiếu:** Chuyển trạng thái từ "pending" sang "rejected".
  - **Nhận trả sách:** Chuyển trạng thái từ "borrowed" sang "returned". (Hệ thống tự tăng `availableCopies`).

---

## 2. Yêu cầu Phi chức năng (Non-Functional Requirements)

- **Single Page Application (SPA):** Sử dụng React Router v6 đảm bảo việc chuyển trang không làm tải lại trình duyệt.
- **Giao diện Responsive:** Giao diện hiển thị tốt trên cả màn hình Điện thoại, Tablet và Desktop (nhờ hệ thống Grid của Bootstrap).
- **Global State Management:** Quản lý trạng thái xác thực và phân quyền (Authentication / Role-Based Access Control) bằng Context API (`AuthContext`).
- **Bảo mật giao diện:** Sử dụng `ProtectedRoute` để chặn người dùng truy cập trái phép vào các route của thủ thư hoặc khi chưa đăng nhập.
- **Tối ưu hóa tải trang:** Sử dụng `React.lazy` và `Suspense` (Lazy Loading) để chia nhỏ bundle (code splitting) đối với nhóm trang của Thủ thư.
- **Trải nghiệm UX/UI (Toast):** Mọi thông báo lỗi (nhập sai pass, API lỗi) và thành công (thêm mới thành công) đều dùng Notification nổi (Toastify) thay thế cho `alert()` mặc định.
- **Xác nhận an toàn:** Mọi hành động Xóa (Delete) bắt buộc qua cửa sổ xác nhận (`ConfirmModal`) trước khi gửi API.
