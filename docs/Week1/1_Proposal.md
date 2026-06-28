# Đề xuất Dự án (Project Proposal)
**Tên dự án:** LMSJS (Library Management System JS)
**Môn học:** Front-End với ReactJS (FER202)

## 1. Problem Statement (Vấn đề cần giải quyết)
Trong các thư viện quy mô nhỏ và vừa (trường học, trung tâm cộng đồng), việc quản lý sách, độc giả và lịch sử mượn/trả thường được thực hiện thủ công qua sổ sách hoặc các file Excel rải rác. Điều này dẫn đến các khó khăn:
- **Khó tra cứu:** Độc giả không thể tự xem sách nào đang còn sẵn ở thư viện mà phải đến tận nơi hỏi thủ thư.
- **Dễ sai sót dữ liệu:** Việc ghi chép thủ công dễ làm mất thông tin phiếu mượn, nhầm lẫn trạng thái sách (đã trả hay chưa).
- **Trải nghiệm người dùng kém:** Không có không gian tương tác trực tuyến giữa độc giả và thư viện (chẳng hạn đăng ký mượn sách trước).

## 2. Mục tiêu dự án
Xây dựng một hệ thống phần mềm Quản lý Thư viện nền tảng Web (Single Page Application - SPA) sử dụng **ReactJS** để giải quyết các hạn chế trên, với mục tiêu:
- Số hóa toàn bộ quá trình tra cứu sách và quản lý mượn trả.
- Độc giả có thể tìm kiếm, đăng ký mượn sách online và theo dõi lịch sử mượn của mình.
- Thủ thư dễ dàng quản lý thông tin sách, thành viên và thao tác duyệt/từ chối phiếu mượn một cách trực quan, chính xác.

## 3. Đối tượng người dùng (User Roles)
Hệ thống được thiết kế phục vụ 3 nhóm đối tượng chính:
1. **Guest (Khách vãng lai):** Người dùng chưa có tài khoản hoặc chưa đăng nhập. Chỉ có thể xem danh sách sách và chi tiết sách nhưng không thể mượn.
2. **Member (Độc giả):** Người dùng đã đăng nhập thành công với vai trò "member". Có thể xem sách, đăng ký yêu cầu mượn sách và theo dõi lịch sử mượn/trả của cá nhân.
3. **Librarian (Thủ thư):** Người quản trị hệ thống với vai trò "librarian". Có toàn quyền thêm/sửa/xóa Sách, Thể loại, Độc giả và có quyền Duyệt/Từ chối các yêu cầu mượn sách, xác nhận trả sách.

## 4. Công nghệ sử dụng
- **Front-end:** ReactJS (Create React App), React Router DOM (Navigation), Bootstrap 5 (UI Framework), Axios.
- **Back-end (Mock):** JSON-Server cung cấp RESTful APIs.
- **Database:** `database.json` lưu trữ toàn bộ thực thể.
- **Công cụ hỗ trợ:** Git/GitHub, AI Tools (có log `AI_USAGE.md`), Vercel/Render (Deploy).
