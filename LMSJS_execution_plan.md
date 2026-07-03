# LMSJS — Kế hoạch Thực thi Chi tiết
> Tổng hợp từ: Giai đoạn 1 + Implementation Guide + Lộ trình 10 tuần

---

## 📦 PHASE 0 — KHỞI TẠO DỰ ÁN (Ngày 1)

### 0.1 Tạo project

```bash
npx create-react-app lmsjs
cd lmsjs
```

### 0.2 Cài đặt dependencies

```bash
npm install react-router-dom axios bootstrap react-toastify
```

| Package | Phiên bản đề xuất | Mục đích |
|---|---|---|
| `react-router-dom` | v6 | Routing SPA |
| `axios` | latest | HTTP Client |
| `bootstrap` | 5.x | UI Framework |
| `react-toastify` | latest | Toast Notification |

### 0.3 Dọn dẹp boilerplate

**Xóa** các file không cần: `App.test.js`, `logo.svg`, `reportWebVitals.js`, `setupTests.js`

**Xóa toàn bộ nội dung** `App.css`, `index.css` (sẽ viết lại)

### 0.4 Import Bootstrap trong `src/index.js`

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
```

### 0.5 Tạo cấu trúc thư mục

```
lmsjs/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── book/
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookList.jsx
│   │   │   └── BookForm.jsx
│   │   ├── category/
│   │   │   └── CategoryForm.jsx
│   │   ├── member/
│   │   │   ├── MemberForm.jsx
│   │   │   └── MemberList.jsx
│   │   └── borrowRecord/
│   │       ├── BorrowRecordForm.jsx
│   │       ├── BorrowRecordTable.jsx
│   │       └── MyBorrowRecordHistory.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── BooksPage.jsx
│   │   ├── BookDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── MyBorrowRecordsPage.jsx
│   │   ├── member/
│   │   │   └── MemberDashboard.jsx
│   │   └── librarian/
│   │       ├── LibrarianDashboard.jsx
│   │       ├── LibrarianBooksPage.jsx
│   │       ├── LibrarianCategoriesPage.jsx
│   │       ├── LibrarianMembersPage.jsx
│   │       └── LibrarianBorrowRecordsPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── bookService.js
│   │   ├── memberService.js
│   │   ├── categoryService.js
│   │   └── borrowRecordService.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── database.json
├── AI_USAGE.md
└── package.json
```

> **Tạo thư mục trống nhanh (PowerShell):**
> ```powershell
> mkdir src/components/common, src/components/book, src/components/category, src/components/member, src/components/borrowRecord, src/pages/librarian, src/context, src/services
> ```

### 0.6 Tạo `database.json` (gốc dự án)

```json
{
  "users": [
    { "id": "1", "email": "librarian@lmsjs.com", "password": "abc", "fullname": "Thủ thư chính", "role": "librarian" },
    { "id": "DspmOC9F1k4", "fullname": "Cao Thanh Tuấn", "email": "member1@lmsjs.com", "password": "123", "role": "member" }
  ],
  "categories": [
    { "id": "P6tsMqHYrQA", "name": "Phiêu Lưu" },
    { "id": "9jyD9KeRRy8", "name": "Kỳ ảo" }
  ],
  "books": [
    { "id": "bAbvlqAvQKk", "title": "Life of Pi", "author": "Yann Martel", "categoryId": "P6tsMqHYrQA", "totalCopies": 4, "availableCopies": 3, "coverImage": "images/lifeofpi.jpg" }
  ],
  "members": [
    { "id": "utVRM5U35gA", "userId": "DspmOC9F1k4", "phone": "0123456789", "gender": "Nam", "dob": "2000-10-10", "city": "Hà Nội", "address": "Yên Lãng", "favorites": ["Phiêu Lưu"] }
  ],
  "borrowRecords": [
    { "id": "aRukWN3MWWs", "bookId": "bAbvlqAvQKk", "memberId": "utVRM5U35gA", "dueDate": "2026-07-12", "borrowDate": "2026-06-28", "returnDate": null, "status": "borrowed" },
    { "id": "0SBvA9PBat0", "bookId": "Z8TnpmAdqH8", "memberId": "utVRM5U35gA", "dueDate": null, "borrowDate": null, "returnDate": null, "status": "rejected" }
  ]
}
```

### 0.7 Thêm script chạy JSON-Server vào `package.json`

```json
"scripts": {
  "start": "react-scripts start",
  "server": "npx json-server --watch database.json --port 9999",
  "dev": "concurrently \"npm start\" \"npm run server\""
}
```

> Cài thêm: `npm install concurrently --save-dev` để chạy cả 2 bằng `npm run dev`

### 0.8 Setup Git

```bash
git init
git add .
git commit -m "chore: khởi tạo dự án LMSJS"
git remote add origin <URL>
git push -u origin main
```

**Tạo nhánh cho từng người:**
```bash
git checkout -b feature/auth-context       # Người 3
git checkout -b feature/book-module        # Người 1
git checkout -b feature/borrow-module      # Người 2
git checkout -b feature/member-module      # Người 3
git checkout -b feature/common-components  # Người 5
```

---

## 🔧 PHASE 1 — SERVICES & API BASE (Ưu tiên code trước)

> **Lý do làm trước:** Tất cả các component đều phụ thuộc services. Code services trước → mọi người dùng chung.

### 1.1 `src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9999',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
```

### 1.2 `src/services/bookService.js`

**Hàm cần viết:**

| Hàm | Method | Endpoint | Mô tả |
|---|---|---|---|
| `getAllBooks()` | GET | `/books` | Lấy tất cả sách |
| `getBookById(id)` | GET | `/books/:id` | Lấy 1 sách |
| `createBook(data)` | POST | `/books` | Tạo sách mới |
| `updateBook(id, data)` | PUT | `/books/:id` | Cập nhật sách |
| `deleteBook(id)` | DELETE | `/books/:id` | Xóa sách |

```javascript
import api from './api';

const bookService = {
  getAllBooks: async () => (await api.get('/books')).data,
  getBookById: async (id) => (await api.get(`/books/${id}`)).data,
  createBook: async (data) => (await api.post('/books', data)).data,
  updateBook: async (id, data) => (await api.put(`/books/${id}`, data)).data,
  deleteBook: async (id) => { await api.delete(`/books/${id}`); return true; },
};

export default bookService;
```

### 1.3 `src/services/categoryService.js`

| Hàm | Method | Endpoint |
|---|---|---|
| `getAllCategories()` | GET | `/categories` |
| `createCategory(data)` | POST | `/categories` |
| `updateCategory(id, data)` | PUT | `/categories/:id` |
| `deleteCategory(id)` | DELETE | `/categories/:id` |

```javascript
import api from './api';

const categoryService = {
  getAllCategories: async () => (await api.get('/categories')).data,
  createCategory: async (data) => (await api.post('/categories', data)).data,
  updateCategory: async (id, data) => (await api.put(`/categories/${id}`, data)).data,
  deleteCategory: async (id) => { await api.delete(`/categories/${id}`); return true; },
};

export default categoryService;
```

### 1.4 `src/services/memberService.js`

| Hàm | Method | Endpoint |
|---|---|---|
| `getAllMembers()` | GET | `/members` |
| `getMemberByUserId(userId)` | GET | `/members?userId=` | ← Quan trọng cho lịch sử mượn |
| `createMember(data)` | POST | `/members` |
| `updateMember(id, data)` | PUT | `/members/:id` |
| `deleteMember(id)` | DELETE | `/members/:id` |

```javascript
import api from './api';

const memberService = {
  getAllMembers: async () => (await api.get('/members')).data,
  getMemberByUserId: async (userId) => {
    const data = (await api.get(`/members?userId=${userId}`)).data;
    return data[0] || null; // trả về member hoặc null
  },
  createMember: async (data) => (await api.post('/members', data)).data,
  updateMember: async (id, data) => (await api.put(`/members/${id}`, data)).data,
  deleteMember: async (id) => { await api.delete(`/members/${id}`); return true; },
};

export default memberService;
```

### 1.5 `src/services/borrowRecordService.js`

**Logic đặc biệt:** Khi mượn/trả phải cập nhật `availableCopies` của Book.

| Hàm | Mô tả | Các bước bên trong |
|---|---|---|
| `getAllRecords()` | Lấy tất cả phiếu mượn | GET `/borrowRecords` |
| `getRecordsByMemberId(memberId)` | Lịch sử mượn theo `members.id` | GET `/borrowRecords?memberId=` |
| `createBorrowRecord(data)` | Tạo phiếu mượn | POST record → PUT book (giảm availableCopies) |
| `returnBook(recordId)` | Trả sách | GET record → PATCH record (returned) → PUT book (tăng availableCopies) |

```javascript
import api from './api';
import bookService from './bookService';

const borrowRecordService = {
  getAllRecords: async () => (await api.get('/borrowRecords')).data,

  getRecordsByMemberId: async (memberId) =>
    (await api.get(`/borrowRecords?memberId=${memberId}`)).data,

  createBorrowRecord: async ({ bookId, memberId, dueDate }) => {
    // Kiểm tra sách còn không
    const book = await bookService.getBookById(bookId);
    if (book.availableCopies <= 0) throw new Error('Sách đã hết!');

    // Tạo borrow record
    const record = (await api.post('/borrowRecords', {
      bookId, memberId, dueDate,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: null,
      status: 'borrowed'
    })).data;

    // Giảm availableCopies
    await bookService.updateBook(bookId, {
      ...book,
      availableCopies: book.availableCopies - 1
    });

    return record;
  },

  returnBook: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status === 'returned') throw new Error('Sách đã được trả trước đó!');

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      returnDate: new Date().toISOString().split('T')[0],
      status: 'returned'
    });

    // Tăng availableCopies
    const book = await bookService.getBookById(record.bookId);
    await bookService.updateBook(record.bookId, {
      ...book,
      availableCopies: book.availableCopies + 1
    });

    return true;
  }
};

export default borrowRecordService;
```

---

## 🔐 PHASE 2 — AUTHENTICATION (AuthContext + Login)

### 2.1 `src/context/AuthContext.jsx`

**State cần quản lý:** `user` (null nếu chưa đăng nhập), `loading`

**Hàm cần export:**

| Hàm/State | Mô tả |
|---|---|
| `user` | Object `{ uId, role, name }` hoặc `null` |
| `loading` | Boolean — đang load từ localStorage |
| `login(userData)` | Lưu vào localStorage + set state |
| `logout()` | Xóa localStorage + set null |
| `isLibrarian()` | `user?.role === 'librarian'` |
| `isMember()` | `user?.role === 'member'` |
| `isAuthenticated()` | `user !== null` |

```javascript
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('account');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('account', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('account');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isLibrarian: () => user?.role === 'librarian',
    isMember: () => user?.role === 'member',
    isAuthenticated: () => user !== null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
  return ctx;
}
```

### 2.2 `src/components/common/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireLibrarian = false }) {
  const { isAuthenticated, isLibrarian } = useAuth();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (requireLibrarian && !isLibrarian()) return <Navigate to="/" replace />;

  return children;
}
```

### 2.3 `src/pages/LoginPage.jsx`

**State:** `email`, `password`, `msgError`
**Logic:** GET `/users?email=&password=` → lưu vào Context → navigate theo role

```javascript
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9999/users?email=${email}&password=${password}`
      );
      if (res.data.length === 0) {
        setMsgError('Email hoặc mật khẩu không đúng!');
        return;
      }
      const u = res.data[0];
      login({ uId: u.id, role: u.role, name: u.fullname });
      navigate(u.role === 'librarian' ? '/librarian/books' : '/books');
    } catch {
      setMsgError('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="col-md-4 offset-md-4 mt-5">
      <div className="card shadow-sm p-4">
        <h3 className="text-primary mb-3">Đăng nhập</h3>
        {msgError && <div className="alert alert-danger">{msgError}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>Đăng nhập</button>
      </div>
    </div>
  );
}
```

---

## 🧩 PHASE 3 — COMMON COMPONENTS

### 3.1 `src/components/common/LoadingSpinner.jsx`

```javascript
export default function LoadingSpinner() {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
    </div>
  );
}
```

### 3.2 `src/components/common/ErrorMessage.jsx`

```javascript
export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <div className="alert alert-danger">{message}</div>;
}
```

### 3.3 `src/components/common/SearchBar.jsx`

**Props:** `onSearch(term)` — callback truyền lên parent

```javascript
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Tìm kiếm...' }) {
  const [term, setTerm] = useState('');

  const handleChange = (e) => {
    setTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={term}
        onChange={handleChange}
      />
      <button className="btn btn-outline-secondary" onClick={() => { setTerm(''); onSearch(''); }}>
        ✕
      </button>
    </div>
  );
}
```

### 3.4 `src/components/common/FilterPanel.jsx`

**Props:** `categories` (array), `onFilterChange(categoryId, availability)`

```javascript
import { useState } from 'react';

export default function FilterPanel({ categories = [], onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availability, setAvailability] = useState('all');

  const handleChange = (cat, avail) => {
    onFilterChange(cat, avail);
  };

  return (
    <div className="d-flex gap-2 mb-3">
      <select
        className="form-select"
        value={selectedCategory}
        onChange={e => { setSelectedCategory(e.target.value); handleChange(e.target.value, availability); }}
      >
        <option value="">Tất cả thể loại</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select
        className="form-select"
        value={availability}
        onChange={e => { setAvailability(e.target.value); handleChange(selectedCategory, e.target.value); }}
      >
        <option value="all">Tất cả</option>
        <option value="available">Còn sách</option>
        <option value="unavailable">Hết sách</option>
      </select>
    </div>
  );
}
```

### 3.5 `src/components/common/Pagination.jsx`

**Props:** `currentPage`, `totalPages`, `onPageChange(page)`

```javascript
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>«</button>
        </li>
        {pages.map(p => (
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>»</button>
        </li>
      </ul>
    </nav>
  );
}
```

### 3.6 `src/components/common/DataTable.jsx`

**Props:** `data` (array), `columns` (array `{key, label}`), `onEdit(item)`, `onDelete(id)`

```javascript
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function DataTable({ data = [], columns = [], onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => { setDeleteId(id); setShowModal(true); };
  const handleConfirm = () => { onDelete(deleteId); setShowModal(false); };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              {columns.map(col => <th key={col.key}>{col.label}</th>)}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="text-center text-muted">Không có dữ liệu</td></tr>
            ) : (
              data.map(item => (
                <tr key={item.id}>
                  {columns.map(col => <td key={col.key}>{item[col.key]}</td>)}
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(item)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(item.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        show={showModal}
        message="Bạn có chắc muốn xóa mục này không?"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
```

### 3.7 `src/components/common/ConfirmModal.jsx`

```javascript
export default function ConfirmModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Xác nhận</h5>
          </div>
          <div className="modal-body"><p>{message}</p></div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Hủy</button>
            <button className="btn btn-danger" onClick={onConfirm}>Xác nhận xóa</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3.8 `src/components/common/Navbar.jsx`

**Phụ thuộc:** `useAuth`, `Link`, `useNavigate`

```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isLibrarian, isMember, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">📚 LMSJS</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Trang chủ</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/books">Danh sách sách</Link></li>
            {isMember() && (
              <li className="nav-item"><Link className="nav-link" to="/my-borrow-records">Lịch sử mượn</Link></li>
            )}
            {isLibrarian() && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Quản lý</a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/librarian/books">Sách</Link></li>
                  <li><Link className="dropdown-item" to="/librarian/categories">Thể loại</Link></li>
                  <li><Link className="dropdown-item" to="/librarian/members">Độc giả</Link></li>
                  <li><Link className="dropdown-item" to="/librarian/borrow-records">Mượn/Trả sách</Link></li>
                </ul>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated() ? (
              <>
                <li className="nav-item"><span className="nav-link">Xin chào, {user?.name}</span></li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Đăng xuất</button>
                </li>
              </>
            ) : (
              <li className="nav-item"><Link className="nav-link" to="/login">Đăng nhập</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
```

### 3.9 `src/components/common/Sidebar.jsx`

> Chỉ dùng trong Librarian pages layout

```javascript
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const links = [
    { to: '/librarian/books', label: '📚 Sách' },
    { to: '/librarian/categories', label: '🏷️ Thể loại' },
    { to: '/librarian/members', label: '👤 Độc giả' },
    { to: '/librarian/borrow-records', label: '📋 Mượn/Trả sách' },
  ];

  return (
    <div className="d-flex flex-column p-3 bg-light border-end" style={{ minHeight: '100vh', width: '220px' }}>
      <h6 className="text-muted text-uppercase mb-3 ps-2">Quản lý</h6>
      <ul className="nav nav-pills flex-column">
        {links.map(link => (
          <li key={link.to} className="nav-item">
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}
              to={link.to}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 📖 PHASE 4 — BOOK MODULE

### 4.1 `src/components/book/BookCard.jsx`

**Props:** `book` object

```javascript
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="card h-100 shadow-sm book-card" style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/books/${book.id}`)}>
      {!isAvailable && (
        <span className="badge bg-danger position-absolute top-0 end-0 m-2">Hết sách</span>
      )}
      <img
        src={book.coverImage || 'https://via.placeholder.com/150x200?text=No+Image'}
        className="card-img-top"
        alt={book.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h6 className="card-title fw-bold">{book.title}</h6>
        <p className="card-text text-muted small">{book.author}</p>
        <span className={`badge ${isAvailable ? 'bg-success' : 'bg-secondary'}`}>
          Còn: {book.availableCopies}/{book.totalCopies}
        </span>
      </div>
    </div>
  );
}
```

### 4.2 `src/components/book/BookList.jsx`

**Props:** `books` (array)

```javascript
import BookCard from './BookCard';

export default function BookList({ books = [] }) {
  if (books.length === 0) {
    return <p className="text-center text-muted my-4">Không có sách nào.</p>;
  }
  return (
    <div className="row g-3">
      {books.map(book => (
        <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
```

### 4.3 `src/components/book/BookForm.jsx`

**Props:** `book` (null = thêm mới, object = chỉnh sửa), `categories`, `onSave(data)`, `onCancel()`

**State:** `title`, `author`, `categoryId`, `totalCopies`, `availableCopies`, `coverImage`

```javascript
import { useState, useEffect } from 'react';

export default function BookForm({ book, categories = [], onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '', author: '', categoryId: '', totalCopies: 1, availableCopies: 1, coverImage: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) setForm(book);
    else setForm({ title: '', author: '', categoryId: '', totalCopies: 1, availableCopies: 1, coverImage: '' });
  }, [book]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.author.trim() || !form.categoryId) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    if (parseInt(form.availableCopies) > parseInt(form.totalCopies)) {
      setError('Số sách còn lại không được vượt quá tổng số!');
      return;
    }
    setError('');
    onSave({
      ...form,
      categoryId: parseInt(form.categoryId),
      totalCopies: parseInt(form.totalCopies),
      availableCopies: parseInt(form.availableCopies),
    });
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <label className="form-label">Tên sách *</label>
        <input name="title" className="form-control" value={form.title} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label className="form-label">Tác giả *</label>
        <input name="author" className="form-control" value={form.author} onChange={handleChange} />
      </div>
      <div className="mb-2">
        <label className="form-label">Thể loại *</label>
        <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange}>
          <option value="">-- Chọn thể loại --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="row mb-2">
        <div className="col">
          <label className="form-label">Tổng số</label>
          <input name="totalCopies" type="number" min="1" className="form-control" value={form.totalCopies} onChange={handleChange} />
        </div>
        <div className="col">
          <label className="form-label">Còn lại</label>
          <input name="availableCopies" type="number" min="0" className="form-control" value={form.availableCopies} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">URL ảnh bìa</label>
        <input name="coverImage" className="form-control" value={form.coverImage} onChange={handleChange} />
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSubmit}>
          {book ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {book && <button className="btn btn-secondary" onClick={onCancel}>Hủy</button>}
      </div>
    </div>
  );
}
```

---

## 📋 PHASE 5 — BORROW RECORD MODULE

### 5.1 `src/components/borrowRecord/BorrowRecordForm.jsx`

**State:** `selectedBookId`, `selectedMemberId`, `dueDate`
**Fetch:** books (chỉ hiện sách còn), members

```javascript
import { useState, useEffect } from 'react';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';

export default function BorrowRecordForm({ onSubmit }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ bookId: '', memberId: '', dueDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    bookService.getAllBooks().then(data => setBooks(data.filter(b => b.availableCopies > 0)));
    memberService.getAllMembers().then(setMembers);
  }, []);

  const handleSubmit = () => {
    if (!form.bookId || !form.memberId || !form.dueDate) {
      setError('Vui lòng chọn đầy đủ thông tin!');
      return;
    }
    setError('');
    onSubmit({ ...form, bookId: parseInt(form.bookId), memberId: parseInt(form.memberId) });
    setForm({ bookId: '', memberId: '', dueDate: '' });
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Sách *</label>
          <select className="form-select" value={form.bookId} onChange={e => setForm({...form, bookId: e.target.value})}>
            <option value="">-- Chọn sách --</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title} (còn {b.availableCopies})</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Độc giả *</label>
          <select className="form-select" value={form.memberId} onChange={e => setForm({...form, memberId: e.target.value})}>
            <option value="">-- Chọn độc giả --</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Hạn trả *</label>
          <input type="date" className="form-control" value={form.dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({...form, dueDate: e.target.value})} />
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleSubmit}>Tạo</button>
        </div>
      </div>
    </div>
  );
}
```

### 5.2 `src/components/borrowRecord/BorrowRecordTable.jsx`

**Props:** `records`, `books`, `members`, `onReturn(recordId)`

```javascript
export default function BorrowRecordTable({ records = [], books = [], members = [], onReturn }) {
  const getBookTitle = (id) => books.find(b => b.id === id)?.title || id;
  const getMemberName = (id) => members.find(m => m.id === id)?.name || id;
  const isOverdue = (record) => record.status === 'borrowed' && new Date(record.dueDate) < new Date();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-primary">
          <tr>
            <th>Sách</th><th>Độc giả</th><th>Ngày mượn</th>
            <th>Hạn trả</th><th>Ngày trả</th><th>Trạng thái</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} className={isOverdue(r) ? 'table-danger' : ''}>
              <td>{getBookTitle(r.bookId)}</td>
              <td>{getMemberName(r.memberId)}</td>
              <td>{r.borrowDate}</td>
              <td>{r.dueDate} {isOverdue(r) && <span className="badge bg-danger ms-1">Quá hạn</span>}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${r.status === 'borrowed' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {r.status === 'borrowed' ? 'Đang mượn' : 'Đã trả'}
                </span>
              </td>
              <td>
                {r.status === 'borrowed' && (
                  <button className="btn btn-success btn-sm" onClick={() => onReturn(r.id)}>Trả sách</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 5.3 `src/components/borrowRecord/MyBorrowRecordHistory.jsx`

**Props:** `records`, `books` — read-only, không có nút Trả sách

```javascript
export default function MyBorrowRecordHistory({ records = [], books = [] }) {
  const getBookTitle = (id) => books.find(b => b.id === id)?.title || id;

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead className="table-info">
          <tr><th>Sách</th><th>Ngày mượn</th><th>Hạn trả</th><th>Ngày trả</th><th>Trạng thái</th></tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan={5} className="text-center text-muted">Chưa có lịch sử mượn sách</td></tr>
          ) : records.map(r => (
            <tr key={r.id}>
              <td>{getBookTitle(r.bookId)}</td>
              <td>{r.borrowDate}</td>
              <td>{r.dueDate}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${r.status === 'borrowed' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {r.status === 'borrowed' ? 'Đang mượn' : 'Đã trả'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 📄 PHASE 6 — PAGES

### 6.1 `src/pages/HomePage.jsx`

```javascript
import { useEffect, useState } from 'react';
import bookService from '../services/bookService';
import BookList from '../components/book/BookList';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getAllBooks()
      .then(data => setFeaturedBooks(data.slice(0, 4)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="p-5 mb-4 bg-primary text-white rounded-3 text-center">
        <h1>📚 Chào mừng đến với LMSJS</h1>
        <p className="lead">Hệ thống quản lý thư viện mini — nhanh, đơn giản, dễ dùng</p>
      </div>
      <h3 className="mb-3">Sách nổi bật</h3>
      {loading ? <LoadingSpinner /> : <BookList books={featuredBooks} />}
    </div>
  );
}
```

### 6.2 `src/pages/BooksPage.jsx`

**State:** `books`, `loading`, `error`, `searchTerm`, `selectedCategory`, `availabilityFilter`, `currentPage`

```javascript
import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import BookList from '../components/book/BookList';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const BOOKS_PER_PAGE = 8;

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    Promise.all([bookService.getAllBooks(), categoryService.getAllCategories()])
      .then(([b, c]) => { setBooks(b); setCategories(c); })
      .catch(() => setError('Không thể tải dữ liệu!'))
      .finally(() => setLoading(false));
  }, []);

  // Lọc sách (computed)
  const filtered = books.filter(book => {
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !selectedCategory || book.categoryId === parseInt(selectedCategory);
    const matchAvail = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && book.availableCopies > 0) ||
      (availabilityFilter === 'unavailable' && book.availableCopies === 0);
    return matchSearch && matchCat && matchAvail;
  });

  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h2 className="mb-4">Danh sách sách</h2>
      <div className="row mb-3">
        <div className="col-md-6"><SearchBar onSearch={(t) => { setSearchTerm(t); setCurrentPage(1); }} /></div>
        <div className="col-md-6">
          <FilterPanel categories={categories} onFilterChange={(cat, avail) => {
            setSelectedCategory(cat); setAvailabilityFilter(avail); setCurrentPage(1);
          }} />
        </div>
      </div>
      <p className="text-muted">Tìm thấy {filtered.length} sách</p>
      <BookList books={paginated} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
```

### 6.3 `src/pages/BookDetailPage.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookService.getBookById(id), categoryService.getAllCategories()])
      .then(([b, c]) => { setBook(b); setCategories(c); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!book) return <p className="alert alert-danger">Không tìm thấy sách!</p>;

  const category = categories.find(c => c.id === book.categoryId);

  return (
    <div className="card shadow-sm p-4">
      <div className="row">
        <div className="col-md-3">
          <img src={book.coverImage || 'https://via.placeholder.com/200x280?text=No+Image'}
            alt={book.title} className="img-fluid rounded" />
        </div>
        <div className="col-md-9">
          <h2>{book.title}</h2>
          <p><strong>Tác giả:</strong> {book.author}</p>
          <p><strong>Thể loại:</strong> {category?.name || '—'}</p>
          <p><strong>Tổng số:</strong> {book.totalCopies} cuốn</p>
          <p>
            <strong>Tình trạng: </strong>
            <span className={book.availableCopies > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
              {book.availableCopies > 0 ? `✓ Còn ${book.availableCopies} cuốn` : '✗ Hết sách'}
            </span>
          </p>
          <button className="btn btn-secondary" onClick={() => navigate('/books')}>← Quay lại</button>
        </div>
      </div>
    </div>
  );
}
```

### 6.4 `src/pages/MyBorrowRecordsPage.jsx`

> **Lưu ý:** Phải tìm `member` từ `userId` trước, rồi mới filter records theo `member.id`

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import memberService from '../services/memberService';
import borrowRecordService from '../services/borrowRecordService';
import bookService from '../services/bookService';
import MyBorrowRecordHistory from '../components/borrowRecord/MyBorrowRecordHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function MyBorrowRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // QUAN TRỌNG: phải dùng members.userId để tìm member.id
        const member = await memberService.getMemberByUserId(user.uId);
        if (member) {
          const [recs, bks] = await Promise.all([
            borrowRecordService.getRecordsByMemberId(member.id),
            bookService.getAllBooks()
          ]);
          setRecords(recs);
          setBooks(bks);
        }
      } catch {
        setError('Không thể tải lịch sử mượn sách!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h2 className="mb-4">Lịch sử mượn sách của tôi</h2>
      <MyBorrowRecordHistory records={records} books={books} />
    </div>
  );
}
```

---

## 🔑 PHASE 7 — LIBRARIAN PAGES

> Tất cả Librarian pages đều dùng layout: `Sidebar bên trái + nội dung bên phải`

### 7.1 `src/pages/librarian/LibrarianBooksPage.jsx`

**State:** `books`, `categories`, `selectedBook`, `loading`
**Hàm:** `fetchBooks()`, `handleSave()`, `handleEdit()`, `handleDelete()`

```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import BookForm from '../../components/book/BookForm';
import DataTable from '../../components/common/DataTable';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LibrarianBooksPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [b, c] = await Promise.all([bookService.getAllBooks(), categoryService.getAllCategories()]);
    setBooks(b); setCategories(c);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (data) => {
    try {
      if (selectedBook) await bookService.updateBook(selectedBook.id, data);
      else await bookService.createBook(data);
      toast.success(selectedBook ? 'Cập nhật sách thành công!' : 'Thêm sách mới thành công!');
      setSelectedBook(null);
      fetchAll();
    } catch { toast.error('Có lỗi xảy ra!'); }
  };

  const handleDelete = async (id) => {
    try { await bookService.deleteBook(id); toast.success('Xóa sách thành công!'); fetchAll(); }
    catch { toast.error('Không thể xóa sách!'); }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Tên sách' },
    { key: 'author', label: 'Tác giả' },
    { key: 'availableCopies', label: 'Còn lại' },
    { key: 'totalCopies', label: 'Tổng số' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="row">
          <div className="col-md-8">
            <h2 className="mb-3">Quản lý sách</h2>
            <DataTable data={books} columns={columns} onEdit={setSelectedBook} onDelete={handleDelete} />
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3 sticky-top" style={{ top: '20px' }}>
              <h5>{selectedBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'}</h5>
              <BookForm book={selectedBook} categories={categories} onSave={handleSave} onCancel={() => setSelectedBook(null)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 7.2 `src/pages/librarian/LibrarianCategoriesPage.jsx`

> Pattern giống LibrarianBooksPage nhưng đơn giản hơn (chỉ có `name`)

**State:** `categories`, `selectedCategory`, `formName`
**Hàm:** `fetchCategories()`, `handleSave()`, `handleDelete()`

```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import categoryService from '../../services/categoryService';
import DataTable from '../../components/common/DataTable';
import Sidebar from '../../components/common/Sidebar';

export default function LibrarianCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');

  const fetch = () => categoryService.getAllCategories().then(setCategories);
  useEffect(() => { fetch(); }, []);
  useEffect(() => { setName(selected ? selected.name : ''); }, [selected]);

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Vui lòng nhập tên thể loại!');
    try {
      if (selected) await categoryService.updateCategory(selected.id, { name });
      else await categoryService.createCategory({ name });
      toast.success('Lưu thể loại thành công!');
      setSelected(null); setName(''); fetch();
    } catch { toast.error('Có lỗi xảy ra!'); }
  };

  const handleDelete = async (id) => {
    try { await categoryService.deleteCategory(id); toast.success('Xóa thành công!'); fetch(); }
    catch { toast.error('Không thể xóa!'); }
  };

  const columns = [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Tên thể loại' }];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="row">
          <div className="col-md-8">
            <h2 className="mb-3">Quản lý thể loại</h2>
            <DataTable data={categories} columns={columns} onEdit={setSelected} onDelete={handleDelete} />
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>{selected ? 'Sửa thể loại' : 'Thêm thể loại'}</h5>
              <div className="mb-2">
                <label className="form-label">Tên thể loại</label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
                {selected && <button className="btn btn-secondary" onClick={() => { setSelected(null); setName(''); }}>Hủy</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 7.3 `src/pages/librarian/LibrarianMembersPage.jsx`

> Copy pattern từ LibrarianCategoriesPage nhưng thêm `email`, `phone`

**Fields form:** `name`, `email`, `phone`

*(Tham khảo pattern LibrarianBooksPage — thay BookForm bằng form member inline)*

### 7.4 `src/pages/librarian/LibrarianBorrowRecordsPage.jsx`

```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import borrowRecordService from '../../services/borrowRecordService';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';
import BorrowRecordForm from '../../components/borrowRecord/BorrowRecordForm';
import BorrowRecordTable from '../../components/borrowRecord/BorrowRecordTable';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LibrarianBorrowRecordsPage() {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [r, b, m] = await Promise.all([
      borrowRecordService.getAllRecords(),
      bookService.getAllBooks(),
      memberService.getAllMembers()
    ]);
    setRecords(r); setBooks(b); setMembers(m);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (data) => {
    try { await borrowRecordService.createBorrowRecord(data); toast.success('Tạo phiếu mượn thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  const handleReturn = async (id) => {
    try { await borrowRecordService.returnBook(id); toast.success('Trả sách thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="mb-3">Quản lý mượn/trả sách</h2>
        <div className="card shadow-sm p-3 mb-4">
          <h5>Tạo phiếu mượn mới</h5>
          <BorrowRecordForm onSubmit={handleCreate} />
        </div>
        <div className="card shadow-sm p-3">
          <h5>Danh sách phiếu mượn</h5>
          <BorrowRecordTable records={records} books={books} members={members} onReturn={handleReturn} />
        </div>
      </div>
    </div>
  );
}
```

---

## 🏗️ PHASE 8 — APP.JS (Router + Lazy Loading + Toast)

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public pages — tải ngay
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import MyBorrowRecordsPage from './pages/MyBorrowRecordsPage';

// Librarian pages — lazy loaded (NFR6)
const LibrarianBooksPage = lazy(() => import('./pages/librarian/LibrarianBooksPage'));
const LibrarianCategoriesPage = lazy(() => import('./pages/librarian/LibrarianCategoriesPage'));
const LibrarianMembersPage = lazy(() => import('./pages/librarian/LibrarianMembersPage'));
const LibrarianBorrowRecordsPage = lazy(() => import('./pages/librarian/LibrarianBorrowRecordsPage'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container-fluid px-0">
          <Navbar />
          <div className="container mt-4 pb-5">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Member protected */}
                <Route path="/my-borrow-records" element={
                  <ProtectedRoute><MyBorrowRecordsPage /></ProtectedRoute>
                } />

                {/* Librarian protected — lazy loaded */}
                <Route path="/librarian/books" element={
                  <ProtectedRoute requireLibrarian><LibrarianBooksPage /></ProtectedRoute>
                } />
                <Route path="/librarian/categories" element={
                  <ProtectedRoute requireLibrarian><LibrarianCategoriesPage /></ProtectedRoute>
                } />
                <Route path="/librarian/members" element={
                  <ProtectedRoute requireLibrarian><LibrarianMembersPage /></ProtectedRoute>
                } />
                <Route path="/librarian/borrow-records" element={
                  <ProtectedRoute requireLibrarian><LibrarianBorrowRecordsPage /></ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<div className="alert alert-warning mt-5">404 — Trang không tồn tại</div>} />
              </Routes>
            </Suspense>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## ✅ PHASE 9 — TESTING CHECKLIST

### Kiểm tra theo user flow

| Flow | Bước test | Kết quả mong đợi |
|---|---|---|
| **Guest** | Vào `/` | Thấy banner + sách nổi bật |
| **Guest** | Vào `/books` | Thấy danh sách, search/filter hoạt động |
| **Guest** | Click vào sách | Vào `/books/:id`, thấy chi tiết |
| **Guest** | Vào `/librarian/books` | Redirect về `/login` |
| **Login Member** | Đăng nhập `member@lmsjs.com` | Redirect `/books` |
| **Login Member** | Vào `/my-borrow-records` | Thấy lịch sử của mình (không thấy của người khác) |
| **Login Librarian** | Đăng nhập `librarian@lmsjs.com` | Redirect `/librarian/books` |
| **Librarian** | Thêm sách mới | Toast "Thêm thành công", xuất hiện trong danh sách |
| **Librarian** | Sửa sách | Form điền sẵn data cũ, Toast "Cập nhật thành công" |
| **Librarian** | Xóa sách | ConfirmModal hiện → xác nhận → Toast "Xóa thành công" |
| **Librarian** | Tạo phiếu mượn | Sách `availableCopies` giảm 1, record xuất hiện |
| **Librarian** | Bấm "Trả sách" | Sách `availableCopies` tăng 1, status = `returned` |

### Kiểm tra kỹ thuật

- [ ] Network tab: Librarian pages tạo file chunk riêng (Lazy Loading hoạt động)
- [ ] Bootstrap Dropdown Navbar: phải import Bootstrap JS (`bootstrap/dist/js/bootstrap.bundle.min`)
- [ ] Không còn `alert()` hay `window.confirm()` nào trong codebase
- [ ] Console không có lỗi khi chạy bình thường

> **Thêm Bootstrap JS vào `public/index.html`:**
> ```html
> <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
> ```

---

## 🚀 PHASE 10 — DEPLOYMENT

```bash
# Build production
npm run build

# Deploy lên Vercel (cài Vercel CLI)
npm install -g vercel
vercel --prod

# Deploy JSON-Server lên Render
# Tạo file render.yaml hoặc dùng Web Service trên render.com
# Start command: npx json-server --watch database.json --port 10000
```

**Sau khi deploy:** Cập nhật `baseURL` trong `src/services/api.js`:
```javascript
baseURL: 'https://your-app.onrender.com'  // thay localhost
```

---

## 📝 Thứ tự code đề xuất (tránh block nhau)

```
Ngày 1: Phase 0 (Setup) + Phase 1 (Services) — TẤT CẢ cùng làm
Ngày 2: Phase 2 (Auth) + Phase 3 (Common Components) song song
Ngày 3: Phase 4 (Book Module) + Phase 5 (BorrowRecord Module) song song
Ngày 4: Phase 6 (Pages public) + Phase 7 (Librarian Pages) song song
Ngày 5: Phase 8 (App.js) + Phase 9 (Testing) + Phase 10 (Deploy)
```
