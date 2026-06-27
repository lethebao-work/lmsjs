# LMSJS — Phân công theo Phase (5 người)

---

## Trạng thái hiện tại

| Phase | Tên | Trạng thái | Người làm |
|---|---|---|---|
| Phase 0 | Project Setup | ✅ XONG | Tất cả |
| Phase 1 | Services Layer | ✅ XONG (trên main) | Người 4 |
| Phase 2 | Auth | 🔄 Đang làm | **Người 3** |
| Phase 3 | Common Components | 🔄 Đang làm | **Người 4** |
| Phase 4 | Book Module | ⏳ Chờ Phase 1 | **Người 1** |
| Phase 5 | BorrowRecord Module | ⏳ Chờ Phase 1 | **Người 2** |
| Phase 6 | Public Pages | ⏳ Chờ Phase 3+4+5 | **Người 1 + 2** |
| Phase 7 | Librarian Pages | ⏳ Chờ Phase 3+4+5 | **Người 1 + 2 + 3** |
| Phase 8 | App.js hoàn chỉnh | ⏳ Chờ tất cả merge | **Người 4** |
| Phase 9 | Testing | ⏳ Chờ Phase 8 | **Người 5** |
| Phase 10 | Deploy | ⏳ Cuối cùng | **Người 4 + 5** |

---

## PHASE 2 — Auth 🔄 Đang chạy
**Người phụ trách: Người 3 | Branch: `feature/auth-context`**

```bash
git checkout feature/auth-context
git merge main   # sync code mới nhất từ main
```

### File cần tạo (theo thứ tự):

**1. `src/context/AuthContext.jsx`** — làm TRƯỚC TIÊN
```
Hàm cần có:
- AuthProvider (component bọc toàn app)
- login(userData)      → lưu localStorage + setUser
- logout()             → xóa localStorage + setUser(null)
- isLibrarian()        → user?.role === 'librarian'
- isMember()           → user?.role === 'member'
- isAuthenticated()    → user !== null
- useAuth()            → custom hook dùng trong mọi component
```

**2. `src/components/common/ProtectedRoute.jsx`**
```
Props: children, requireLibrarian (mặc định false)
Logic:
- Chưa login → <Navigate to="/login" />
- Cần librarian mà không phải → <Navigate to="/" />
- Đủ điều kiện → render children
```

**3. `src/pages/LoginPage.jsx`**
```
State: email, password, msgError
Logic:
- axios.get('/users?email=...&password=...')
- Gọi login() từ useAuth() để lưu session
- navigate('/librarian/books') nếu role=librarian
- navigate('/books') nếu role=member
```

### Commit + PR:
```bash
git add src/context/AuthContext.jsx src/components/common/ProtectedRoute.jsx src/pages/LoginPage.jsx
git commit -m "feat(auth): AuthContext, ProtectedRoute, LoginPage"
git push origin feature/auth-context
# → Tạo Pull Request → Team Lead (Người 4) review + merge vào main
```

---

## PHASE 3 — Common Components 🔄 Đang chạy
**Người phụ trách: Người 4 | Branch: `feature/common-components`**

```bash
git checkout feature/common-components
# (đã merge main ở lệnh trên — thấy services đã có sẵn ✅)
```

### File cần tạo (theo thứ tự):

| Thứ tự | File | Phụ thuộc |
|---|---|---|
| 1 | `LoadingSpinner.jsx` | Không |
| 2 | `ErrorMessage.jsx` | Không |
| 3 | `ConfirmModal.jsx` | Không |
| 4 | `DataTable.jsx` | ConfirmModal |
| 5 | `SearchBar.jsx` | Không |
| 6 | `FilterPanel.jsx` | Không |
| 7 | `Pagination.jsx` | Không |
| 8 | `Sidebar.jsx` | Không |
| 9 | `Navbar.jsx` | ⚠️ Cần AuthContext → làm SAU KHI Phase 2 merge vào main |

### Commit từng nhóm:
```bash
# Commit 1: Không phụ thuộc gì
git add src/components/common/LoadingSpinner.jsx src/components/common/ErrorMessage.jsx src/components/common/ConfirmModal.jsx
git commit -m "feat(common): LoadingSpinner, ErrorMessage, ConfirmModal"

# Commit 2: Có dùng ConfirmModal
git add src/components/common/DataTable.jsx
git commit -m "feat(common): DataTable với ConfirmModal tích hợp"

# Commit 3: Search/Filter/Pagination/Sidebar (độc lập)
git add src/components/common/SearchBar.jsx src/components/common/FilterPanel.jsx src/components/common/Pagination.jsx src/components/common/Sidebar.jsx
git commit -m "feat(common): SearchBar, FilterPanel, Pagination, Sidebar"

# Commit 4: Navbar — CHỈ làm sau khi Phase 2 (auth) đã merge vào main
git merge main  # lấy AuthContext về
git add src/components/common/Navbar.jsx
git commit -m "feat(common): Navbar tích hợp AuthContext"

git push origin feature/common-components
# → PR → merge vào main
```

---

## PHASE 4 — Book Module
**Người phụ trách: Người 1 | Branch: `feature/book-module`**

```bash
# Tạo branch (nếu chưa có)
git checkout main && git pull origin main
git checkout -b feature/book-module
git push -u origin feature/book-module
```

> ⏳ **Điều kiện bắt đầu:** Phase 1 (services) đã trên main ✅ → Có thể bắt đầu ngay!
> Phase 3 (common) chưa xong → Tạm **comment import** SearchBar/FilterPanel/Pagination/DataTable/Sidebar khi cần, sau đó uncomment khi Phase 3 merge.

### File cần tạo:

| Thứ tự | File | Phụ thuộc |
|---|---|---|
| 1 | `src/components/book/BookCard.jsx` | Không |
| 2 | `src/components/book/BookList.jsx` | BookCard |
| 3 | `src/components/book/BookForm.jsx` | Không (categoryService có sẵn) |

```bash
git add src/components/book/
git commit -m "feat(book): BookCard, BookList, BookForm"
git push origin feature/book-module
```

> Phase 6 (Public Pages) và Phase 7 (Librarian Pages) của Book — Người 1 làm **TIẾP TRONG CÙNG BRANCH** sau khi Phase 3 đã merge.

---

## PHASE 5 — BorrowRecord Module
**Người phụ trách: Người 2 | Branch: `feature/borrow-module`**

```bash
git checkout feature/borrow-module
git merge main
```

> ⏳ **Điều kiện bắt đầu:** Phase 1 ✅ → Bắt đầu ngay được!

### File cần tạo:

| Thứ tự | File | Phụ thuộc |
|---|---|---|
| 1 | `src/components/borrowRecord/BorrowRecordForm.jsx` | bookService + memberService (có sẵn) |
| 2 | `src/components/borrowRecord/BorrowRecordTable.jsx` | Không |
| 3 | `src/components/borrowRecord/MyBorrowRecordHistory.jsx` | Không |

> ⚠️ **LOGIC ĐẶC BIỆT trong `BorrowRecordForm.jsx`:**
> ```javascript
> // Fetch sách: CHỈ lấy sách còn sách (availableCopies > 0)
> bookService.getAllBooks().then(data => setBooks(data.filter(b => b.availableCopies > 0)))
> ```

```bash
git add src/components/borrowRecord/
git commit -m "feat(borrow): BorrowRecordForm, BorrowRecordTable, MyBorrowRecordHistory"
git push origin feature/borrow-module
```

---

## PHASE 6 — Public Pages
**Người phụ trách: Người 1 + Người 2 | Trong branch của mỗi người**

> ⏳ **Điều kiện:** Phase 3 (common) đã merge vào main → merge main vào branch trước khi code

```bash
# Người 1 - trên feature/book-module
git merge main   # lấy common components

# Người 2 - trên feature/borrow-module
git merge main
```

| File | Người làm | Trong branch |
|---|---|---|
| `src/pages/HomePage.jsx` | Người 1 | feature/book-module |
| `src/pages/BooksPage.jsx` | Người 1 | feature/book-module |
| `src/pages/BookDetailPage.jsx` | Người 1 | feature/book-module |
| `src/pages/MyBorrowRecordsPage.jsx` | Người 2 | feature/borrow-module |

> ⚠️ **LOGIC QUAN TRỌNG trong `MyBorrowRecordsPage.jsx`:**
> ```javascript
> // ĐÚNG — 2 bước:
> const member = await memberService.getMemberByUserId(user.uId);  // Bước 1
> const records = await borrowRecordService.getRecordsByMemberId(member.id);  // Bước 2
>
> // SAI — kết quả sẽ rỗng vì users.id ≠ members.id:
> borrowRecordService.getRecordsByMemberId(user.uId)  // ❌
> ```

```bash
# Người 1
git add src/pages/HomePage.jsx src/pages/BooksPage.jsx src/pages/BookDetailPage.jsx
git commit -m "feat(pages): HomePage, BooksPage, BookDetailPage"
git push origin feature/book-module

# Người 2
git add src/pages/MyBorrowRecordsPage.jsx
git commit -m "feat(pages): MyBorrowRecordsPage với logic userId→memberId"
git push origin feature/borrow-module
```

---

## PHASE 7 — Librarian Pages
**Người phụ trách: Người 1 + 2 + 3 | Trong branch của mỗi người**

> ⏳ **Điều kiện:** Phase 3 (common có Sidebar) đã merge vào main

| File | Người làm | Branch |
|---|---|---|
| `src/pages/librarian/LibrarianBooksPage.jsx` | Người 1 | feature/book-module |
| `src/pages/librarian/LibrarianBorrowRecordsPage.jsx` | Người 2 | feature/borrow-module |
| `src/pages/librarian/LibrarianMembersPage.jsx` | Người 3 | feature/member-category |
| `src/pages/librarian/LibrarianCategoriesPage.jsx` | Người 3 | feature/member-category |

**Người 3 — Branch `feature/member-category`:**
```bash
git checkout feature/member-category
git merge main  # lấy services + common components

# File cần tạo:
# src/components/member/MemberForm.jsx
# src/components/member/MemberList.jsx
# src/components/category/CategoryForm.jsx
# src/pages/librarian/LibrarianMembersPage.jsx
# src/pages/librarian/LibrarianCategoriesPage.jsx

git add src/components/member/ src/components/category/ src/pages/librarian/LibrarianMembersPage.jsx src/pages/librarian/LibrarianCategoriesPage.jsx
git commit -m "feat(member-category): forms, list, librarian pages"
git push origin feature/member-category
```

---

## PHASE 8 — App.js hoàn chỉnh
**Người phụ trách: Người 4 | Branch: `main` (trực tiếp hoặc branch riêng)**

> ⏳ **Điều kiện:** TẤT CẢ branch đã merge vào main

```bash
git checkout main
git pull origin main
```

**Sửa `src/App.js`** — bỏ comment tất cả, thêm import thật:

```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import MyBorrowRecordsPage from './pages/MyBorrowRecordsPage';

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
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/my-borrow-records" element={
                  <ProtectedRoute><MyBorrowRecordsPage /></ProtectedRoute>
                } />
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

```bash
git add src/App.js
git commit -m "feat(app): App.js hoàn chỉnh với Lazy Loading + Toast"
git push origin main
```

---

## PHASE 9 — Testing
**Người phụ trách: Người 5 | Chạy song song từ Phase 4 trở đi**

### Checklist test theo user:

**Guest:**
- [ ] `/` → thấy trang chủ + sách nổi bật
- [ ] `/books` → search/filter/pagination hoạt động
- [ ] `/books/1` → thấy chi tiết sách
- [ ] `/librarian/books` → bị redirect về `/login`

**Member (đăng nhập `member@lmsjs.com / member123`):**
- [ ] Redirect về `/books` sau login
- [ ] `/my-borrow-records` → thấy đúng lịch sử của mình (không phải người khác)
- [ ] Không thấy menu "Quản lý"

**Librarian (đăng nhập `librarian@lmsjs.com / admin123`):**
- [ ] Redirect về `/librarian/books` sau login
- [ ] Thêm sách → Toast success → xuất hiện trong danh sách
- [ ] Sửa sách → form điền sẵn dữ liệu cũ
- [ ] Xóa sách → ConfirmModal hiện → xác nhận → Toast success
- [ ] Tạo phiếu mượn → `availableCopies` giảm 1
- [ ] Bấm "Trả sách" → `availableCopies` tăng 1, status = `returned`

**Kỹ thuật:**
- [ ] Network tab → chunk file load riêng khi vào `/librarian/*` (Lazy Loading OK)
- [ ] Console không có lỗi đỏ
- [ ] Bootstrap Dropdown Navbar hoạt động (nếu dùng `data-bs-toggle`)

---

## PHASE 10 — Deploy
**Người phụ trách: Người 4 + Người 5**

```bash
# Build
npm run build

# Deploy frontend lên Vercel
npx vercel --prod

# Deploy JSON-Server lên Render
# Tạo repo riêng hoặc dùng file render.yaml
# Start command: npx json-server --watch database.json --port 10000 --host 0.0.0.0
```

**Sau khi deploy:** sửa `src/services/api.js`:
```javascript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9999'
```

Tạo file `.env` cho production:
```
REACT_APP_API_URL=https://your-server.onrender.com
```

---

## 📊 Sơ đồ phụ thuộc giữa các Phase

```
Phase 1 (Services) ─────────────────────────────┐
                                                 ↓
Phase 2 (Auth) ──────────────┐         Phase 4 (Book)
                              ↓                  │
Phase 3 (Common) ────────────┼────────  Phase 5 (BorrowRecord)
         │                   │                  │
         ↓                   ↓                  ↓
Phase 9 (Navbar)      Phase 7 (Librarian Pages) Phase 6 (Public Pages)
                              │                  │
                              └──────────────────┘
                                        ↓
                                 Phase 8 (App.js)
                                        ↓
                              Phase 9 (Testing) → Phase 10 (Deploy)
```
