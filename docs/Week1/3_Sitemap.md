# Sitemap & UI Flow

Tài liệu thiết kế cấu trúc điều hướng và luồng màn hình (Screen Flow) của ứng dụng LMSJS.

## 1. Sitemap (Bản đồ trang web)

### 1.1. Các trang Public (Ai cũng có thể truy cập)
- `/` - Trang chủ (Hiển thị sách nổi bật, banner).
- `/login` - Trang đăng nhập.
- `/books` - Danh mục sách (Gồm thanh tìm kiếm, bộ lọc thể loại, phân trang).
- `/books/:id` - Trang chi tiết một quyển sách.

### 1.2. Phân hệ Độc giả (Role: `member`)
Yêu cầu đã đăng nhập. Nếu chưa đăng nhập sẽ bị đẩy về `/login`.
- `/dashboard` - Bảng điều khiển của Member.
- `/my-borrow-records` - Lịch sử mượn/trả sách cá nhân.
- `/profile` - Thông tin hồ sơ cá nhân.

### 1.3. Phân hệ Thủ thư (Role: `librarian`)
Yêu cầu đăng nhập và role = `librarian`. Truy cập trái phép sẽ bị đẩy về trang chủ hoặc báo lỗi 403/404.
- `/librarian/dashboard` - Bảng điều khiển quản trị tổng quan.
- `/librarian/books` - Bảng quản lý sách (CRUD Sách).
- `/librarian/categories` - Bảng quản lý thể loại (CRUD Thể loại).
- `/librarian/members` - Bảng quản lý hồ sơ độc giả (CRUD Thành viên).
- `/librarian/borrow-records` - Bảng quản lý giao dịch mượn/trả sách (Duyệt, Từ chối, Nhận lại sách).

---

## 2. Screen Flow (Luồng điều hướng màn hình)

### Luồng 1: Người dùng mới (Khách vãng lai) tìm sách
1. Truy cập `Home (/)`
2. Bấm vào "Xem tất cả sách" → Chuyển tới `Books (/books)`
3. Nhập từ khóa vào ô tìm kiếm hoặc bấm lọc theo thể loại.
4. Bấm vào một cuốn sách bất kỳ → Chuyển tới `Book Detail (/books/:id)`.
5. Bấm "Đăng ký mượn" → Hệ thống báo lỗi và tự động đẩy sang màn hình `Login (/login)`.

### Luồng 2: Độc giả đăng nhập và mượn sách
1. Truy cập `Login (/login)`, nhập đúng email/pass.
2. Đăng nhập thành công (role=member) → Tự động đẩy sang `Member Dashboard (/dashboard)`.
3. Bấm vào menu "Danh mục sách" trên Sidebar → Chuyển sang `Books (/books)`.
4. Xem chi tiết sách `Book Detail (/books/:id)`.
5. Bấm "Đăng ký mượn" → Cửa sổ xác nhận (Confirm) bật lên → Bấm "OK".
6. Yêu cầu tạo thành công → Tự động chuyển hướng sang `Lịch sử mượn (/my-borrow-records)` để xem trạng thái "pending".

### Luồng 3: Thủ thư quản trị
1. Truy cập `Login (/login)`.
2. Đăng nhập thành công (role=librarian) → Tự động đẩy sang `Librarian Dashboard (/librarian/dashboard)`.
3. Bấm menu "Mượn / Trả sách" ở Sidebar → Chuyển sang `Borrow Records (/librarian/borrow-records)`.
4. Tìm phiếu có trạng thái "pending" → Bấm nút "Duyệt".
5. Hệ thống gọi API, hiển thị Toast "Duyệt thành công!", trạng thái phiếu đổi thành "borrowed". Số lượng sách trong kho (`availableCopies`) tự động giảm 1.
