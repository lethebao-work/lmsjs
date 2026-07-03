# LMSJS — Library Management System JS
## Giai đoạn 1: Chọn đề tài, Phân tích, Thiết kế sơ bộ (FER202, deadline 5 tuần)
> Cấu trúc dữ liệu & quan hệ entity đồng bộ với `LMSJS_implementation_guide.md` (code mẫu giảng viên). Naming route/file dùng **"Librarian"** thống nhất xuyên suốt (team tự chọn, khác với "admin" trong code mẫu gốc — chỉ đổi tên gọi, không đổi cấu trúc).

---

## 1. Chọn đề tài

**Tên đề tài:** LMSJS — Web quản lý mượn/trả sách cho thư viện quy mô nhỏ (trường, lớp, nhóm đọc sách).

**Vì sao phù hợp khung đánh giá:**
- React SPA: toàn bộ điều hướng qua React Router, không reload trang.
- Luồng nghiệp vụ rõ: Mượn sách → cập nhật tồn kho → Trả sách → cập nhật lại tồn kho. 1 luồng chính, dễ demo, dễ hiểu cho người ngoài ngành.
- Chia component/module tự nhiên: Book module, Member module, BorrowRecord module — mỗi module độc lập, dễ phân việc cho 3-5 người.

**Phạm vi cố định (không mở rộng thêm):** 4 entity nghiệp vụ — Book, Category, Member, BorrowRecord — cộng 1 collection `users` thuần phục vụ authentication. Không làm Reservation/Waitlist, không làm Fine, không làm flow đăng ký tài khoản (account được seed sẵn trong `database.json`).

---

## 2. Phân tích

### 2.1 Problem Statement

Thư viện quy mô nhỏ hiện quản lý sách và việc mượn-trả bằng sổ sách hoặc Excel thủ công, dẫn đến: khó tra cứu sách theo thể loại/tác giả, không biết sách còn hay đã hết, không theo dõi được ai đang giữ sách nào và khi nào phải trả. LMSJS số hóa quy trình này qua một web app cho phép tra cứu, lọc, và ghi nhận mượn-trả tức thời.

### 2.2 User Roles

| Role | Quyền |
|---|---|
| **Librarian** | CRUD Book, Category, Member. Tạo/đóng BorrowRecord (ghi nhận mượn, ghi nhận trả). Xem toàn bộ danh sách BorrowRecord. |
| **Member (Reader)** | Xem catalog sách (search/filter/pagination). Xem lịch sử mượn của chính mình (read-only). |

*Naming thống nhất: dùng "Librarian" cho mọi route, file, folder, và role value — không dùng "admin" ở đâu cả (khác code mẫu giảng viên, vốn dùng tiền tố "admin" cho route/file). `users` chỉ chứa thông tin đăng nhập (email, password, fullname, role). `members` là entity nghiệp vụ riêng (name, email, phone), liên kết tới `users` qua field `userId`. Librarian không có record trong `members` — chỉ có trong `users`.*

### 2.3 Functional Requirements

| Mã | Yêu cầu |
|---|---|
| FR1 | Librarian CRUD Book (title, author, category, total copies, available copies, coverImage) |
| FR2 | Librarian CRUD Category |
| FR3 | Librarian CRUD Member (name, email, phone) |
| FR4 | Librarian tạo BorrowRecord khi mượn (bookId, memberId, borrowDate, dueDate, status=borrowed) |
| FR5 | Librarian cập nhật BorrowRecord khi trả (status=returned, returnDate) — kéo theo tăng lại available copies của Book |
| FR6 | Search sách theo title/author |
| FR7 | Filter sách theo category và theo trạng thái còn/hết hàng |
| FR8 | Pagination cho danh sách Book và danh sách BorrowRecord |
| FR9 | Member xem lịch sử mượn của bản thân (filter BorrowRecord theo `memberId` tương ứng với `users.id` đang đăng nhập, thông qua `members.userId`) |

### 2.4 Non-functional Requirements

| Mã | Yêu cầu |
|---|---|
| NFR1 | SPA — không reload trang khi chuyển route (React Router) |
| NFR2 | Responsive (Bootstrap), chạy tốt mobile và desktop |
| NFR3 | Loading state + error handling cho mọi lệnh gọi API |
| NFR4 | Deploy lên Vercel/Netlify (frontend) + Render (JSON-Server) |
| NFR5 | Component tái sử dụng được (BookCard, DataTable, SearchBar, FilterPanel, Pagination dùng chung cho cả Book, Member, BorrowRecord list) |
| NFR6 | Lazy Loading — dùng `React.lazy` + `Suspense` cho các Librarian pages (giảm bundle size, tăng điểm Optimization) |
| NFR7 | Toast Notification — dùng `react-toastify` thay `alert()` cho mọi thông báo thành công/lỗi; Modal xác nhận Bootstrap cho thao tác Delete |
| NFR8 | AI Usage Transparency (CLO9 bắt buộc) — ghi nhận AI tools, prompt, phần code AI hỗ trợ trong file `AI_USAGE.md` |

---

## 3. Thiết kế sơ bộ

### 3.1 Sitemap

```
/                          Home (giới thiệu, sách nổi bật)
/login                     Đăng nhập (email + password)
/books                     Danh sách sách (search + filter + pagination)
/books/:id                 Chi tiết sách

--- Chỉ Member truy cập ---
/dashboard                 Bảng điều khiển cho độc giả
/my-borrow-records         Lịch sử mượn của Member (cần đăng nhập)
/profile                   Hồ sơ cá nhân của Member

--- Chỉ Librarian truy cập ---
/librarian/dashboard           Bảng điều khiển cho thủ thư
/librarian/books               CRUD Book
/librarian/categories          CRUD Category
/librarian/members             CRUD Member
/librarian/borrow-records      Quản lý mượn/trả (duyệt/từ chối mượn, trả sách)
/profile                       Hồ sơ cá nhân của Librarian
```

*Có dashboard riêng cho từng role — login thành công với role=librarian redirect thẳng `/librarian/dashboard`; role=member redirect thẳng `/dashboard`.*

### 3.2 Screen Flow

**Nhóm Guest / Member:**
```
/home
 ├─ /books                              (search, filter, pagination)
 │   └─ /books/:id                      (chi tiết sách, đăng ký mượn sách)
 └─ /login
     ├─ đăng nhập thành công, role=member     → /dashboard
     └─ đăng nhập thành công, role=librarian  → /librarian/dashboard

(Member, sau khi đăng nhập, có menu Sidebar truy cập: /dashboard, /books, /my-borrow-records, /profile)
```

**Nhóm Librarian (role=librarian), sau /login:**
```
/librarian/dashboard          → Bảng điều khiển, thống kê chung
/librarian/books              → Book Form (modal/inline, tạo/sửa) — 2-column layout (list + form)
/librarian/categories         → Category Form (modal/inline, tạo/sửa)
/librarian/members            → Member Form (modal/inline, tạo/sửa) — copy pattern Books page
/librarian/borrow-records     → Duyệt/Từ chối yêu cầu mượn, Trả sách, Tạo phiếu mượn (form)
/profile                      → Hồ sơ cá nhân
```

*Không tách Detail/Edit thành screen riêng cho Member — dùng pattern "list + form 2 cột" giống Books page cho mọi entity, không tách route riêng cho Detail/Edit. Cấu trúc này giữ nguyên theo guide giảng viên (chỉ đổi tên gọi route/file, không đổi cách tổ chức screen).*

### 3.3 Component Draft

```
src/
  components/
    common/
      Navbar.jsx                    // hiển thị menu theo role (isLibrarian/isMember/isAuthenticated)
      Sidebar.jsx                   // menu dọc cho Librarian và Member
      Footer.jsx                    // chân trang
      SearchBar.jsx
      FilterPanel.jsx
      Pagination.jsx
      DataTable.jsx                 // dùng chung cho Librarian Book/Member/BorrowRecord list
      LoadingSpinner.jsx
      ErrorMessage.jsx
      ProtectedRoute.jsx            // wrapper, có prop requireLibrarian
      ConfirmModal.jsx              // Modal xác nhận Delete, thay thế window.confirm()
      Toast.jsx                     // wrapper react-toastify, thay thế alert()
    book/
      BookCard.jsx
      BookList.jsx
      BookDetail.jsx
      BookForm.jsx
    category/
      CategoryForm.jsx
    member/
      MemberForm.jsx                // copy pattern từ BookForm
      MemberList.jsx                // reuse DataTable
    borrowRecord/
      BorrowRecordForm.jsx          // selectedMember, selectedBook, dueDate + validation
      BorrowRecordTable.jsx
      MyBorrowRecordHistory.jsx     // read-only view cho Member
  pages/
    HomePage.jsx
    LoginPage.jsx                   // axios GET /users?email=&password=, lưu localStorage
    BooksPage.jsx
    BookDetailPage.jsx
    ProfilePage.jsx
    MyBorrowRecordsPage.jsx
    member/
      MemberDashboard.jsx
    librarian/                      // lazy-loaded qua React.lazy (NFR6)
      LibrarianDashboard.jsx
      LibrarianBooksPage.jsx
      LibrarianCategoriesPage.jsx
      LibrarianMembersPage.jsx
      LibrarianBorrowRecordsPage.jsx
  context/
    AuthContext.jsx                 // isLibrarian(), isMember(), isAuthenticated(), login(), logout()
  services/
    api.js                          // axios instance, base URL http://localhost:9999
    bookService.js
    memberService.js
    categoryService.js
    borrowRecordService.js
AI_USAGE.md                        // [Bắt buộc CLO9] log AI tools, prompt, phần code AI hỗ trợ
```

**Bảng phân công nhiệm vụ 5 thành viên (Đảm bảo khối lượng công việc cân bằng):**

| Thành viên | Trách nhiệm chính | Chi tiết công việc & File phụ trách | Luồng nghiệp vụ chính |
|---|---|---|---|
| **Người 1** | **Quản lý Sách (Book Module)** | - `src/components/book/BookCard.jsx`<br>- `src/components/book/BookForm.jsx`<br>- `src/components/book/BookList.jsx`<br>- `src/pages/HomePage.jsx`<br>- `src/pages/BooksPage.jsx`<br>- `src/pages/BookDetailPage.jsx`<br>- `src/pages/librarian/LibrarianBooksPage.jsx`<br>- `src/pages/librarian/LibrarianDashboard.jsx`<br>- `public/images/` (ảnh bìa sách: `aristotle.jpg`, `harrypotter.jpg`, etc.) | Hiển thị sách ở trang chủ và danh sách lọc. Thực hiện chức năng tìm kiếm, phân trang và xem chi tiết sách. Phía thủ thư: hiển thị dashboard thống kê, quản lý CRUD sách (thêm, sửa, xóa). |
| **Người 2** | **Quản lý Mượn/Trả (BorrowRecord)** | - `src/components/borrowRecord/BorrowRecordForm.jsx`<br>- `src/components/borrowRecord/BorrowRecordTable.jsx`<br>- `src/components/borrowRecord/MyBorrowRecordHistory.jsx`<br>- `src/pages/member/MemberDashboard.jsx`<br>- `src/pages/MyBorrowRecordsPage.jsx`<br>- `src/pages/librarian/LibrarianBorrowRecordsPage.jsx`<br>- `database.json` (Quản lý mock DB & data seeding) | Logic mượn trả sách (nghiệp vụ lõi): Tạo phiếu mượn (giảm `availableCopies` của sách); trả sách (tăng lại `availableCopies`). Lọc lịch sử mượn trả của độc giả. |
| **Người 3** | **Xác thực & Người dùng (Auth & Member)** | - `src/context/AuthContext.jsx`<br>- `src/components/common/ProtectedRoute.jsx`<br>- `src/components/member/MemberForm.jsx`<br>- `src/components/member/MemberList.jsx`<br>- `src/pages/LoginPage.jsx`<br>- `src/pages/ProfilePage.jsx`<br>- `src/pages/librarian/LibrarianMembersPage.jsx` | Quản lý AuthContext (login, logout, check role). Bảo vệ các router bằng ProtectedRoute. Thủ thư quản lý CRUD danh sách thành viên/độc giả. |
| **Người 4** | **Layout & Cấu hình Core (App Core)** | - `src/App.js` & `src/App.css`<br>- `src/index.js` & `src/index.css`<br>- `src/services/api.js`<br>- `src/services/bookService.js`<br>- `src/services/borrowRecordService.js`<br>- `src/services/categoryService.js`<br>- `src/services/memberService.js`<br>- `src/components/common/Navbar.jsx`<br>- `src/components/common/Sidebar.jsx`<br>- `src/components/common/Footer.jsx`<br>- `package.json`, `package-lock.json`, `.gitignore`<br>- `public/index.html`, `robots.txt`, `manifest.json`<br>- `public/favicon.ico`, `logo192.png`, `logo512.png` | Setup dự án, cấu hình Axios API call base, viết các file Service CRUD. Tích hợp components & pages vào App.js (Lazy Loading). Xây dựng Layout chung và deploy ứng dụng. |
| **Người 5** | **Thể loại & Common UI (Category & UI)** | - `src/components/category/CategoryForm.jsx`<br>- `src/pages/librarian/LibrarianCategoriesPage.jsx`<br>- `src/components/common/ConfirmModal.jsx`<br>- `src/components/common/DataTable.jsx`<br>- `src/components/common/ErrorMessage.jsx`<br>- `src/components/common/FilterPanel.jsx`<br>- `src/components/common/LoadingSpinner.jsx`<br>- `src/components/common/Pagination.jsx`<br>- `src/components/common/SearchBar.jsx`<br>- `README.md`, `AI_USAGE.md`<br>- `PHASE9_TEST_REPORT.md` (QA/Test report) | Phát triển các UI components dùng chung. Quản lý CRUD thể loại sách. Kiểm thử toàn bộ hệ thống (QA), viết báo cáo test và tài liệu dự án. |

---

## 4. Mock Database (`database.json` — chạy bằng json-server, port 9999)

```json
{
  "users": [
    {
      "id": 1,
      "email": "librarian@lmsjs.com",
      "password": "admin123",
      "fullname": "Thủ thư chính",
      "role": "librarian"
    },
    {
      "id": 2,
      "email": "member@lmsjs.com",
      "password": "member123",
      "fullname": "Độc giả 1",
      "role": "member"
    }
  ],
  "categories": [
    { "id": 1, "name": "Công nghệ" },
    { "id": 2, "name": "Văn học" }
  ],
  "books": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "categoryId": 1,
      "totalCopies": 5,
      "availableCopies": 3,
      "coverImage": "/images/clean-code.jpg"
    },
    {
      "id": 2,
      "title": "Đắc Nhân Tâm",
      "author": "Dale Carnegie",
      "categoryId": 2,
      "totalCopies": 4,
      "availableCopies": 0,
      "coverImage": "/images/dac-nhan-tam.jpg"
    }
  ],
  "members": [
    {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "member@lmsjs.com",
      "phone": "0912345678",
      "userId": 2
    }
  ],
  "borrowRecords": [
    {
      "id": 1,
      "bookId": 1,
      "memberId": 1,
      "borrowDate": "2026-06-15",
      "dueDate": "2026-06-29",
      "returnDate": null,
      "status": "borrowed"
    },
    {
      "id": 2,
      "bookId": 2,
      "memberId": 1,
      "borrowDate": "2026-06-01",
      "dueDate": "2026-06-15",
      "returnDate": "2026-06-14",
      "status": "returned"
    }
  ]
}
```

**Lưu ý thiết kế (cấu trúc giữ đúng theo guide giảng viên, chỉ đổi tên gọi route/file):**
- `users` chỉ dùng cho login (`GET /users?email=...&password=...`). `members` là entity nghiệp vụ, liên kết tới `users` qua `userId`.
- `borrowRecords.memberId` tham chiếu **`members.id`**, KHÔNG phải `users.id`.
- ⚠️ **Rủi ro kỹ thuật cần team lưu ý:** nếu copy logic mẫu kiểu gọi hàm lọc lịch sử mượn trực tiếp bằng `user.id` (id trong `users`) mà không tìm `member` tương ứng trước, kết quả sẽ sai/trống vì `users.id` ≠ `members.id` (ví dụ trên: `users.id=2` nhưng `members.id=1`). **Cách làm đúng:** trong `MyBorrowRecordsPage.jsx`, phải tìm `member = members.find(m => m.userId === user.id)` trước, rồi mới lọc `borrowRecords` theo `member.id`. Cần test kỹ bước này trong Phase 5.
- `status` chỉ có 2 giá trị: `borrowed` | `returned`.

---

## 5. Technical Constraints (ràng buộc kỹ thuật bắt buộc)

| Hạng mục | Lựa chọn | Lý do |
|---|---|---|
| UI Framework | Bootstrap 5 (class thuần, container-fluid + row + col) | Responsive UI/UX |
| HTTP Client | Axios | Chuẩn FER202 |
| Auth | Đăng nhập bằng **email + password**, lưu session vào `localStorage` (key `account`: `{id, role, name}`) | Đơn giản, đủ dùng cho scope 5 tuần |
| Naming | Dùng **"Librarian"** thống nhất cho route/file/folder/role (`/librarian/...`, `LibrarianBooksPage.jsx`) — không dùng "admin" ở đâu | Tránh nhập nhằng 2 thuật ngữ trong toàn bộ codebase |
| Form & Validation | Controlled input + useState | Giữ đơn giản, validate tay, đủ cho scope |
| Routing | React Router v6 + `ProtectedRoute` (prop `requireLibrarian`) | Bắt buộc cho SPA + phân quyền |
| State Management | useState/useEffect + Context API (`AuthContext`: `isLibrarian()`, `isMember()`, `isAuthenticated()`) | Đủ cho scope 4 entity, không cần Redux |
| Mock Backend | json-server, file `database.json`, port 9999 | Đúng yêu cầu môn học |

*Cấu trúc dữ liệu (entity, quan hệ `userId`/`memberId`, 2 collection `users`+`members` tách riêng) giữ đúng theo guide giảng viên — đây là phần "không được đổi quá nhiều". Cách đặt tên route/file/component (Librarian thay vì admin), cách viết code, thư viện hỗ trợ (validation, form...) team có thể tự quyết theo thói quen, không bắt buộc giống code mẫu 100%.*
