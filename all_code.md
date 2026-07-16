# Toàn bộ mã nguồn (Source Code)

## src/App.js
```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBorrowRecordsPage from './pages/MyBorrowRecordsPage';
import ProfilePage from './pages/ProfilePage';

const LibrarianBooksPage = lazy(() => import('./pages/librarian/LibrarianBooksPage'));
const LibrarianCategoriesPage = lazy(() => import('./pages/librarian/LibrarianCategoriesPage'));
const LibrarianMembersPage = lazy(() => import('./pages/librarian/LibrarianMembersPage'));
const LibrarianBorrowRecordsPage = lazy(() => import('./pages/librarian/LibrarianBorrowRecordsPage'));
const LibrarianBookSuggestionsPage = lazy(() => import('./pages/librarian/LibrarianBookSuggestionsPage'));
const LibrarianDashboard = lazy(() => import('./pages/librarian/LibrarianDashboard'));
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard'));
const BookSuggestionPage = lazy(() => import('./pages/member/BookSuggestionPage'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
          <Navbar />
          <div className="flex-grow-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute><MemberDashboard /></ProtectedRoute>
                } />
                <Route path="/my-borrow-records" element={
                  <ProtectedRoute><MyBorrowRecordsPage /></ProtectedRoute>
                } />
                <Route path="/book-suggestions" element={
                  <ProtectedRoute><BookSuggestionPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="/librarian/dashboard" element={
                  <ProtectedRoute requireLibrarian><LibrarianDashboard /></ProtectedRoute>
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
                <Route path="/librarian/book-suggestions" element={
                  <ProtectedRoute requireLibrarian><LibrarianBookSuggestionsPage /></ProtectedRoute>
                } />
                <Route path="*" element={<div className="container mt-5"><div className="alert alert-warning">404 — Trang không tồn tại</div></div>} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

```

## src/components/book/BookCard.jsx
```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reviewService from '../../services/reviewService';

export default function BookCard({ book, categories = [] }) {
  const navigate = useNavigate();
  const isAvailable = book.availableCopies > 0;
  const category = categories.find(c => String(c.id) === String(book.categoryId));
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    // Lấy rating cho từng card sách
    reviewService.getReviewsByBookId(book.id).then(reviews => {
      if (reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAvgRating(Math.round(avg));
      }
    });
  }, [book.id]);

  const getCoverImage = () => {
    if (!book.coverImage) return 'https://via.placeholder.com/150x200?text=No+Image';
    if (book.coverImage.startsWith('http') || book.coverImage.startsWith('/')) {
      return book.coverImage;
    }
    return `/${book.coverImage}`;
  };

  return (
    <div className="card h-100 shadow-sm book-card" style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/books/${book.id}`)}>
      {!isAvailable && (
        <span className="badge bg-danger position-absolute top-0 end-0 m-2">Hết sách</span>
      )}
      <img
        src={getCoverImage()}
        className="card-img-top"
        alt={book.title}
        style={{ height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
      />
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h6 className="card-title fw-bold mb-1">{book.title}</h6>
          <p className="card-text text-muted small mb-1">{book.author}</p>
          {avgRating > 0 && (
            <div style={{ color: '#ffc107' }} className="small mb-2">
              {'★'.repeat(avgRating)}{'☆'.repeat(5 - avgRating)}
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {category && (
            <span className="badge bg-light text-secondary border small">
              {category.name}
            </span>
          )}
          <span className={`badge ${isAvailable ? 'bg-success' : 'bg-secondary'}`}>
            {book.availableCopies}/{book.totalCopies}
          </span>
        </div>
      </div>
    </div>
  );
}

```

## src/components/book/BookForm.jsx
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

    // Xử lý tự động tách đường dẫn ảnh bìa khi người dùng dán đường dẫn tuyệt đối
    let processedCoverImage = form.coverImage.trim();

    // Loại bỏ dấu ngoặc kép ở đầu và cuối (ví dụ khi Copy as path từ Windows)
    if (processedCoverImage.startsWith('"') && processedCoverImage.endsWith('"')) {
      processedCoverImage = processedCoverImage.slice(1, -1);
    }
    if (processedCoverImage.startsWith("'") && processedCoverImage.endsWith("'")) {
      processedCoverImage = processedCoverImage.slice(1, -1);
    }

    // Chuyển đổi dấu gạch chéo ngược thành xuôi
    processedCoverImage = processedCoverImage.replace(/\\/g, '/');

    // Tìm kiếm cụm từ /public/ hoặc public/ để lấy phần tương đối sau nó
    const publicIndex = processedCoverImage.indexOf('/public/');
    if (publicIndex !== -1) {
      processedCoverImage = processedCoverImage.substring(publicIndex + 8);
    } else {
      const altIndex = processedCoverImage.indexOf('public/');
      if (altIndex !== -1) {
        processedCoverImage = processedCoverImage.substring(altIndex + 7);
      }
    }

    onSave({
      ...form,
      coverImage: processedCoverImage,
      categoryId: form.categoryId,
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
        <label className="form-label">Đường dẫn / URL ảnh bìa</label>
        <input 
          name="coverImage" 
          className="form-control" 
          value={form.coverImage} 
          onChange={handleChange} 
          placeholder="Ví dụ: D:\...\public\images\harrypotter.jpg hoặc images/harrypotter.jpg"
        />
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

## src/components/book/BookList.jsx
```javascript
import BookCard from './BookCard';

export default function BookList({ books = [], categories = [] }) {
  if (books.length === 0) {
    return <p className="text-center text-muted my-4">Không có sách nào.</p>;
  }
  return (
    <div className="row g-3">
      {books.map(book => (
        <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <BookCard book={book} categories={categories} />
        </div>
      ))}
    </div>
  );
}

```

## src/components/borrowRecord/BorrowRecordForm.jsx
```javascript
import { useState, useEffect } from 'react';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';

export default function BorrowRecordForm({ onSubmit, books: availableBooks, members: availableMembers }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ bookId: '', memberId: '', dueDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (availableBooks && availableMembers) {
      setBooks(availableBooks.filter(b => b.availableCopies > 0));
      setMembers(availableMembers);
      return;
    }

    Promise.all([
      bookService.getAllBooks(),
      memberService.getAllMembers()
    ]).then(([bookData, memberData]) => {
      setBooks(bookData.filter(b => b.availableCopies > 0));
      setMembers(memberData);
    });
  }, [availableBooks, availableMembers]);

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

## src/components/borrowRecord/BorrowRecordTable.jsx
```javascript
export default function BorrowRecordTable({ records = [], books = [], members = [], onApprove, onReturn, onReject }) {
  const getBookTitle = (id) => books.find(b => String(b.id) === String(id))?.title || id;
  const getMemberName = (id) => members.find(m => String(m.id) === String(id))?.name || id;
  const isOverdue = (record) => record.status === 'borrowed' && new Date(record.dueDate) < new Date();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle table-bordered">
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
              <td>{r.borrowDate || '—'}</td>
              <td>{r.dueDate || '—'} {isOverdue(r) && <span className="badge bg-danger ms-1">Quá hạn</span>}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${r.status === 'pending'
                    ? 'bg-info text-white'
                    : r.status === 'borrowed'
                      ? 'bg-warning text-dark'
                      : r.status === 'rejected'
                        ? 'bg-danger text-white'
                        : 'bg-success'
                  }`}>
                  {r.status === 'pending'
                    ? 'Chờ duyệt'
                    : r.status === 'borrowed'
                      ? 'Đang mượn'
                      : r.status === 'rejected'
                        ? 'Bị từ chối'
                        : 'Đã trả'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  {r.status === 'pending' && (
                    <>
                      <button className="btn btn-success btn-sm fw-semibold" onClick={() => onApprove(r.id)}>
                        Duyệt mượn
                      </button>
                      {onReject && (
                        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={() => onReject(r.id)}>
                          Từ chối
                        </button>
                      )}
                    </>
                  )}
                  {r.status === 'borrowed' && (
                    <button className="btn btn-success btn-sm fw-semibold" onClick={() => onReturn(r.id)}>
                      Trả sách
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

```

## src/components/borrowRecord/MyBorrowRecordHistory.jsx
```javascript
export default function MyBorrowRecordHistory({ records = [], books = [] }) {
  const getBookTitle = (id) => books.find(b => String(b.id) === String(id))?.title || id;

  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-info">
          <tr><th>Sách</th><th>Ngày mượn</th><th>Hạn trả</th><th>Ngày trả</th><th>Trạng thái</th></tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan={5} className="text-center text-muted">Chưa có lịch sử mượn sách</td></tr>
          ) : records.map(r => (
            <tr key={r.id}>
              <td>{getBookTitle(r.bookId)}</td>
              <td>{r.borrowDate || '—'}</td>
              <td>{r.dueDate || '—'}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${
                  r.status === 'pending' 
                    ? 'bg-info text-white' 
                    : r.status === 'borrowed' 
                    ? 'bg-warning text-dark' 
                    : r.status === 'rejected'
                    ? 'bg-danger text-white'
                    : 'bg-success'
                }`}>
                  {r.status === 'pending' 
                    ? 'Chờ duyệt' 
                    : r.status === 'borrowed' 
                    ? 'Đang mượn' 
                    : r.status === 'rejected'
                    ? 'Bị từ chối'
                    : 'Đã trả'}
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

## src/components/category/CategoryForm.jsx
```javascript
import { useState, useEffect } from 'react';

export default function CategoryForm({ category, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(category ? category.name : '');
    setError('');
  }, [category]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên thể loại!');
      return;
    }
    setError('');
    onSave({ name: name.trim() });
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <label className="form-label">Tên thể loại *</label>
        <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Lưu
        </button>
        {category && <button className="btn btn-secondary" onClick={onCancel}>Hủy</button>}
      </div>
    </div>
  );
}

```

## src/components/common/ConfirmModal.jsx
```javascript
import React from 'react';

export default function ConfirmModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <>
      <div 
        className="modal show d-block" 
        tabIndex="-1" 
        style={{ backgroundColor: 'rgba(38, 38, 38, 0.5)', zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: '12px' }}>
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">Xác nhận thao tác</h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body py-3">
              <p className="mb-0 text-secondary">{message}</p>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button 
                type="button" 
                className="btn btn-light" 
                onClick={onCancel}
                style={{ borderRadius: '8px' }}
              >
                Hủy bỏ
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={onConfirm}
                style={{ borderRadius: '8px' }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" style={{ zIndex: 1050 }}></div>
    </>
  );
}

```

## src/components/common/DataTable.jsx
```javascript
import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function DataTable({ data = [], columns = [], onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleConfirm = () => {
    onDelete(deleteId);
    setShowModal(false);
  };

  return (
    <>
      <div className="table-responsive shadow-sm" style={{ borderRadius: '12px', overflowX: 'auto', border: '1px solid #e5e5e5' }}>
        <table className="table table-hover mb-0 align-middle">
          <thead style={{ backgroundColor: '#f4f3f2' }}>
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="py-3 px-4 text-secondary fw-semibold"
                  style={{ borderBottomWidth: '1px', borderColor: '#e5e5e5', whiteSpace: 'nowrap' }}
                >
                  {col.label}
                </th>
              ))}
              <th 
                className="py-3 px-4 text-secondary fw-semibold text-end"
                style={{ borderBottomWidth: '1px', borderColor: '#e5e5e5', whiteSpace: 'nowrap' }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-5 text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-dark" style={{ whiteSpace: 'nowrap' }}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-end">
                    <div className="d-flex justify-content-end gap-2" style={{ whiteSpace: 'nowrap' }}>
                      <button 
                        className="btn btn-primary btn-sm fw-semibold px-3" 
                        onClick={() => onEdit(item)}
                        style={{ borderRadius: '8px' }}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm fw-semibold px-3" 
                        onClick={() => handleDeleteClick(item.id)}
                        style={{ borderRadius: '8px' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        show={showModal}
        message="Bạn có chắc chắn muốn xóa mục này không? Thao tác này không thể hoàn tác."
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}

```

## src/components/common/ErrorMessage.jsx
```javascript
import React from 'react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger d-flex align-items-center my-3 border-0 shadow-sm" role="alert" style={{ borderRadius: '12px' }}>
      <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <div>
        <span className="fw-bold">Lỗi:</span> {message}
      </div>
    </div>
  );
}

```

## src/components/common/FilterPanel.jsx
```javascript
import React, { useState } from 'react';

export default function FilterPanel({ categories = [], onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availability, setAvailability] = useState('all');

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    onFilterChange(catId, availability);
  };

  const handleAvailabilityChange = (e) => {
    const avail = e.target.value;
    setAvailability(avail);
    onFilterChange(selectedCategory, avail);
  };

  return (
    <div className="row g-2 mb-3">
      <div className="col-md-6">
        <select
          className="form-select shadow-sm"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ borderRadius: '8px' }}
        >
          <option value="">Tất cả thể loại</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <select
          className="form-select shadow-sm"
          value={availability}
          onChange={handleAvailabilityChange}
          style={{ borderRadius: '8px' }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="available">Còn sách trong thư viện</option>
          <option value="unavailable">Hết sách (Đã mượn hết)</option>
        </select>
      </div>
    </div>
  );
}

```

## src/components/common/Footer.jsx
```javascript
export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          {/* Cột 1: Thông tin bản quyền */}
          <div className="col-md-6">
            <h5 className="fw-bold text-warning mb-3">UNILIB LMS</h5>
            <p className="small text-white-50 mb-0">
              © 2026 LMSJS - Hệ thống quản lý thư viện trường học thông minh.
            </p>
            <p className="small text-white-50 mb-0">
              Bản quyền thuộc về nhóm 5 - lớp SE2014JS.
            </p>
          </div>

          {/* Cột : Liên hệ */}
          <div className="col-md-6">
            <h6 className="fw-bold text-white mb-3">Thông tin liên hệ</h6>
            <ul className="list-unstyled mb-0 small text-white-50">
              <li className="mb-2">SDT: +0123456789 </li>
              <li>Email: support@lms.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

```

## src/components/common/LoadingSpinner.jsx
```javascript
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="text-center my-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
      <div className="spinner-border" role="status" style={{ color: '#d97706', width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Đang tải...</span>
      </div>
      <div className="mt-3 text-muted fw-semibold">Đang tải dữ liệu, vui lòng đợi...</div>
    </div>
  );
}

```

## src/components/common/Navbar.jsx
```javascript
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isLibrarian, isMember, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ backgroundColor: '#262626' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ color: '#d97706', fontSize: '1.25rem' }}>
          LMSJS
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent" 
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
            <li className="nav-item">
              <Link className="nav-link px-3 text-white-50" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-white-50" to="/books">Danh mục sách</Link>
            </li>
            {isLibrarian() && (
              <li className="nav-item">
                <Link className="nav-link px-3 text-white-50" to="/librarian/dashboard">Bảng điều khiển</Link>
              </li>
            )}
            {isMember() && (
              <li className="nav-item">
                <Link className="nav-link px-3 text-white-50" to="/dashboard">Bảng điều khiển</Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated() ? (
              <>
                <span className="text-white-50 small">
                  Xin chào, <strong className="text-white">{user?.name}</strong> ({isLibrarian() ? 'Thủ thư' : 'Độc giả'})
                </span>
                <button 
                  className="btn btn-outline-light btn-sm px-3" 
                  onClick={handleLogout}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link 
                className="btn btn-primary btn-sm px-4 py-2" 
                to="/login"
                style={{ backgroundColor: '#d97706', borderColor: '#d97706', borderRadius: '8px', fontWeight: '600' }}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

```

## src/components/common/Pagination.jsx
```javascript
import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage - 1)}
            style={{ color: currentPage === 1 ? '#737373' : '#d97706', border: '1px solid #e5e5e5' }}
          >
            Trước
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(p)}
              style={
                p === currentPage
                  ? { backgroundColor: '#d97706', borderColor: '#d97706', color: '#fff' }
                  : { color: '#262626', border: '1px solid #e5e5e5' }
              }
            >
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage + 1)}
            style={{ color: currentPage === totalPages ? '#737373' : '#d97706', border: '1px solid #e5e5e5' }}
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>
  );
}

```

## src/components/common/ProtectedRoute.jsx
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

## src/components/common/SearchBar.jsx
```javascript
import React, { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Tìm kiếm...' }) {
  const [term, setTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <div className="input-group mb-3 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
      <span className="input-group-text bg-white border-end-0 text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </span>
      <input
        type="text"
        className="form-control border-start-0 border-end-0 ps-0"
        placeholder={placeholder}
        value={term}
        onChange={handleChange}
        style={{ boxShadow: 'none' }}
      />
      {term && (
        <button 
          className="btn btn-white border-start-0 border-top border-bottom border-end text-muted" 
          type="button" 
          onClick={handleClear}
          style={{ borderColor: '#dee2e6' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

```

## src/components/common/Sidebar.jsx
```javascript
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { isLibrarian, isMember } = useAuth();

  const links = [];
  let title = '';

  if (isLibrarian()) {
    title = 'Phân hệ thủ thư';
    links.push(
      { to: '/librarian/dashboard', label: 'Bảng điều khiển' },
      { to: '/librarian/books', label: 'Quản lý sách' },
      { to: '/librarian/categories', label: 'Quản lý thể loại' },
      { to: '/librarian/members', label: 'Quản lý độc giả' },
      { to: '/librarian/borrow-records', label: 'Mượn / Trả sách' },
      { to: '/librarian/book-suggestions', label: 'Quản lý yêu cầu sách' },
      { to: '/profile', label: 'Hồ sơ cá nhân' }
    );
  } else if (isMember()) {
    title = 'Phân hệ độc giả';
    links.push(
      { to: '/dashboard', label: 'Bảng điều khiển' },
      { to: '/books', label: 'Danh mục sách' },
      { to: '/my-borrow-records', label: 'Lịch sử mượn' },
      { to: '/book-suggestions', label: 'Yêu cầu thêm sách' },
      { to: '/profile', label: 'Hồ sơ cá nhân' }
    );
  }

  if (links.length === 0) return null;

  return (
    <div
      className="lms-sidebar d-flex flex-column p-4"
      style={{
        minHeight: 'calc(100vh - 72px)',
        width: '260px',
        flexShrink: 0,
        backgroundColor: '#e2f0d9', // Light green background like the image
        borderRight: '1px solid #d0e1cc'
      }}
    >
      <h6 className="text-success text-uppercase fw-bold mb-4" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
        {title}
      </h6>
      <ul className="nav nav-pills flex-column gap-2">
        {links.map((link) => (
          <li key={link.to} className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link py-3 px-3 fw-semibold border-0 d-flex align-items-center gap-2 ${isActive
                  ? 'text-dark'
                  : 'text-dark hover-bg-light'
                }`
              }
              to={link.to}
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: '#a9d08e', borderRadius: '8px' } // Soft dark green for active tab like in the image
                  : { borderRadius: '8px' }
              }
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

## src/components/member/MemberForm.jsx
```javascript
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import categoryService from '../../services/categoryService';

export default function MemberForm({ member, onSave, onCancel }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [favorites, setFavorites] = useState([]);
  
  const [availableCategories, setAvailableCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getAllCategories().then(setAvailableCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (member) {
      setFullname(member.name || ''); // member.name is populated from user.fullname in LibrarianMembersPage
      setEmail(member.email || '');
      setPassword(''); // Không hiển thị mật khẩu khi sửa
      setPhone(member.phone || '');
      setGender(member.gender || 'Nam');
      setDob(member.dob || '');
      setCity(member.city || '');
      setAddress(member.address || '');
      setFavorites(member.favorites || []);
    } else {
      setFullname('');
      setEmail('');
      setPassword('');
      setPhone('');
      setGender('Nam');
      setDob('');
      setCity('');
      setAddress('');
      setFavorites([]);
    }
  }, [member]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullname.trim() || !email.trim() || !phone.trim() || (!member && !password.trim())) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, Email, Mật khẩu, Số điện thoại)!');
      return;
    }
    setError('');
    onSave({
      fullname, email, password, phone, gender, dob, city, address, favorites
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger p-2">{error}</div>}
      
      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">Họ tên *</Form.Label>
        <Form.Control type="text" value={fullname} onChange={e => setFullname(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">Email *</Form.Label>
        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!!member} />
      </Form.Group>

      {!member && (
        <Form.Group className="mb-2">
          <Form.Label className="fw-semibold">Mật khẩu *</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
      )}

      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">Số điện thoại *</Form.Label>
        <Form.Control type="text" value={phone} onChange={e => setPhone(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">Giới tính</Form.Label>
        <div>
          <Form.Check inline type="radio" label="Nam" checked={gender === 'Nam'} onChange={() => setGender('Nam')} />
          <Form.Check inline type="radio" label="Nữ" checked={gender === 'Nữ'} onChange={() => setGender('Nữ')} />
        </div>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">Ngày sinh</Form.Label>
        <Form.Control type="date" value={dob} onChange={e => setDob(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">Thành phố</Form.Label>
        <Form.Select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">-- Chọn thành phố --</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Cần Thơ">Cần Thơ</option>
          <option value="Hải Phòng">Hải Phòng</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">Địa chỉ</Form.Label>
        <Form.Control as="textarea" rows={2} value={address} onChange={e => setAddress(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Thể loại yêu thích</Form.Label>
        <div>
          {availableCategories.map(cat => (
            <Form.Check
              inline
              key={cat.id}
              type="checkbox"
              label={cat.name}
              checked={favorites.includes(cat.name)}
              onChange={(e) => {
                if (e.target.checked) setFavorites([...favorites, cat.name]);
                else setFavorites(favorites.filter(f => f !== cat.name));
              }}
            />
          ))}
        </div>
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" className="w-100">
          {member ? 'Cập nhật' : 'Thêm độc giả'}
        </Button>
        {member && (
          <Button variant="secondary" onClick={onCancel} className="w-100">
            Hủy / Thêm mới
          </Button>
        )}
      </div>
    </Form>
  );
}

```

## src/components/member/MemberList.jsx
```javascript
import DataTable from '../common/DataTable';

export default function MemberList({ members = [], onEdit, onDelete }) {
  const columns = [
    { key: 'name', label: 'Họ tên' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'gender', label: 'Giới tính' },
    { key: 'city', label: 'Thành phố' }
  ];

  const handleDelete = (id) => {
    const member = members.find(m => m.id === id);
    onDelete(id, member?.userId);
  };

  return (
    <DataTable 
      data={members} 
      columns={columns} 
      onEdit={onEdit} 
      onDelete={handleDelete} 
    />
  );
}

```

## src/context/AuthContext.jsx
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

## src/index.css
```css
.lms-sidebar + .flex-grow-1 {
  min-width: 0;
}

@media (max-width: 767.98px) {
  .d-flex:has(> .lms-sidebar) {
    flex-direction: column;
  }

  .lms-sidebar {
    width: 100% !important;
    min-height: auto !important;
    border-right: 0 !important;
    border-bottom: 1px solid #d0e1cc;
    padding: 1rem !important;
  }

  .lms-sidebar h6 {
    margin-bottom: 0.75rem !important;
  }

  .lms-sidebar .nav {
    flex-direction: row !important;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }

  .lms-sidebar .nav-item {
    flex: 0 0 auto;
  }

  .lms-sidebar .nav-link {
    min-height: 44px;
    white-space: nowrap;
    padding: 0.75rem 1rem !important;
  }

  .lms-sidebar + .flex-grow-1 {
    width: 100%;
    padding: 1rem !important;
  }
}

```

## src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


```

## src/pages/BookDetailPage.jsx
```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import memberService from '../services/memberService';
import borrowRecordService from '../services/borrowRecordService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Sidebar from '../components/common/Sidebar';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasBorrowed, setHasBorrowed] = useState(false);
  const { user, isMember } = useAuth();

  useEffect(() => {
    if (user && isMember()) {
      memberService.getMemberByUserId(user.uId).then(member => {
        if (member) {
          borrowRecordService.getRecordsByMemberId(member.id).then(records => {
            const borrowed = records.some(r => String(r.bookId) === String(id) && (r.status === 'borrowed' || r.status === 'returned'));
            setHasBorrowed(borrowed);
          }).catch(() => {});
        }
      }).catch(() => {});
    }
  }, [user, id, isMember]);

  useEffect(() => {
    Promise.all([
      bookService.getBookById(id),
      categoryService.getAllCategories(),
      reviewService.getReviewsByBookId(id)
    ])
      .then(([b, c, r]) => { setBook(b); setCategories(c); setReviews(r); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBorrowRequest = async () => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để mượn sách!');
      navigate('/login');
      return;
    }

    const confirm = window.confirm(`Bạn có muốn gửi yêu cầu đăng ký mượn cuốn sách này không?`);
    if (!confirm) return;

    setRequesting(true);
    try {
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin độc giả liên kết với tài khoản này!');
        return;
      }

      await borrowRecordService.createBorrowRecord({
        bookId: id,
        memberId: member.id,
        dueDate: null,
        status: 'pending'
      });
      toast.success('Đăng ký mượn thành công! Vui lòng chờ thủ thư duyệt.');
      navigate('/my-borrow-records');
    } catch (e) {
      toast.error(e.message || 'Có lỗi xảy ra!');
    } finally {
      setRequesting(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !isMember()) return;
    
    if (!reviewForm.comment.trim()) {
      toast.warning('Vui lòng nhập nội dung bình luận!');
      return;
    }

    setSubmittingReview(true);
    try {
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin độc giả liên kết với tài khoản này!');
        return;
      }

      const newReview = await reviewService.createReview({
        bookId: id,
        memberId: member.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      
      // Hiển thị ngay (thêm thông tin member giả định)
      newReview.member = member;
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Gửi đánh giá thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi đánh giá!');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return <p className="alert alert-danger">Không tìm thấy sách!</p>;

  const category = categories.find(c => String(c.id) === String(book.categoryId));
  const isAvailable = book.availableCopies > 0;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="card shadow-sm p-4">
          <div className="row">
            <div className="col-md-3 mb-3 mb-md-0">
              <img src={
                book.coverImage 
                  ? (book.coverImage.startsWith('http') || book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`) 
                  : 'https://via.placeholder.com/200x280?text=No+Image'
              }
                alt={book.title} className="img-fluid rounded shadow-sm" 
                style={{ maxHeight: '300px', objectFit: 'contain', backgroundColor: '#f8f9fa', width: '100%' }} />
            </div>
            <div className="col-md-9">
              <h2>{book.title}</h2>
              <p><strong>Tác giả:</strong> {book.author}</p>
              <p><strong>Thể loại:</strong> {category?.name || '—'}</p>
              <p>
                <strong>Đánh giá: </strong> 
                <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>
                  {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                </span>
                <span className="ms-2">({avgRating}/5 từ {reviews.length} đánh giá)</span>
              </p>
              <p>
                <strong>Tình trạng: </strong>
                <span className={isAvailable ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  {book.availableCopies}/{book.totalCopies}
                </span>
              </p>
              
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-secondary" onClick={() => navigate('/books')}>← Quay lại</button>
                {isMember() && (
                  <button 
                    className="btn btn-primary px-4 fw-semibold" 
                    onClick={handleBorrowRequest}
                    disabled={requesting || !isAvailable}
                  >
                    {requesting ? 'Đang gửi yêu cầu...' : 'Đăng ký mượn sách'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Khung Bình luận & Đánh giá */}
        <div className="card shadow-sm p-4 mt-4">
          <h4 className="mb-4">Đánh giá & Bình luận</h4>
          
          {isMember() ? (
            hasBorrowed ? (
              <form onSubmit={handleSubmitReview} className="mb-5 border-bottom pb-4">
              <div className="d-flex align-items-center mb-3">
                <label className="form-label fw-bold me-3 mb-0">Chấm điểm:</label>
                <div style={{ fontSize: '1.5rem', cursor: 'pointer', userSelect: 'none' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star}
                      style={{ color: star <= reviewForm.rating ? '#ffc107' : '#e4e5e9' }}
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ms-3 text-muted">
                  {reviewForm.rating === 5 && 'Tuyệt vời'}
                  {reviewForm.rating === 4 && 'Rất hay'}
                  {reviewForm.rating === 3 && 'Bình thường'}
                  {reviewForm.rating === 2 && 'Tạm được'}
                  {reviewForm.rating === 1 && 'Tệ'}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Viết bình luận:</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Chia sẻ cảm nghĩ của bạn về cuốn sách này..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
              </button>
            </form>
            ) : (
              <div className="alert alert-warning">
                Bạn chỉ có thể đánh giá sau khi đã được mượn cuốn sách này!
              </div>
            )
          ) : (
            <div className="alert alert-info">
              Vui lòng <button className="btn btn-link p-0 text-decoration-none" onClick={() => navigate('/login')}>đăng nhập</button> để gửi đánh giá.
            </div>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="text-muted text-center py-3">Chưa có đánh giá nào cho cuốn sách này. Hãy là người đầu tiên!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-item mb-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">{review.member?.fullname || 'Thành viên ẩn danh'}</span>
                    <small className="text-muted">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</small>
                  </div>
                  <div style={{ color: '#ffc107', fontSize: '1.1rem' }} className="mb-2">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

```

## src/pages/BooksPage.jsx
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
import Sidebar from '../components/common/Sidebar';

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
    const matchCat = !selectedCategory || String(book.categoryId) === String(selectedCategory);
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
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
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
        <BookList books={paginated} categories={categories} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

```

## src/pages/HomePage.jsx
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
    <div className="container mt-4 pb-5">
      <div className="p-5 mb-4 bg-primary text-white rounded-3 text-center" style={{ backgroundColor: '#2b5876' }}>
        <h1>Chào mừng đến với LMSJS</h1>
        <p className="lead">Hệ thống quản lý thư viện mini — nhanh, đơn giản, dễ dùng</p>
      </div>
      <h3 className="mb-3">Sách nổi bật</h3>
      {loading ? <LoadingSpinner /> : <BookList books={featuredBooks} />}
    </div>
  );
}

```

## src/pages/librarian/LibrarianBooksPage.jsx
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
    { 
      key: 'categoryId', 
      label: 'Thể loại',
      render: (book) => {
        const cat = categories.find(c => String(c.id) === String(book.categoryId));
        return cat ? cat.name : 'Chưa phân loại';
      }
    },
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

## src/pages/librarian/LibrarianBookSuggestionsPage.jsx
```javascript
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import memberService from '../../services/memberService';
import bookSuggestionService from '../../services/bookSuggestionService';

const statusMap = {
  pending: { label: 'Chờ duyệt', className: 'bg-warning text-dark' },
  approved: { label: 'Đã duyệt', className: 'bg-success' },
  rejected: { label: 'Từ chối', className: 'bg-danger' }
};

export default function LibrarianBookSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [members, setMembers] = useState([]);
  const [notes, setNotes] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const [suggestionData, memberData] = await Promise.all([
        bookSuggestionService.getAllSuggestions(),
        memberService.getAllMembers()
      ]);
      setSuggestions(suggestionData);
      setMembers(memberData);
    } catch {
      toast.error('Không thể tải danh sách yêu cầu sách!');
    } finally {
      setLoading(false);
    }
  };

  const memberMap = useMemo(() => {
    const map = {};
    members.forEach((member) => {
      map[member.id] = member;
    });
    return map;
  }, [members]);

  const stats = useMemo(() => ({
    total: suggestions.length,
    pending: suggestions.filter((item) => item.status === 'pending').length,
    approved: suggestions.filter((item) => item.status === 'approved').length,
    rejected: suggestions.filter((item) => item.status === 'rejected').length
  }), [suggestions]);

  const filteredSuggestions = useMemo(() => {
    if (statusFilter === 'all') return suggestions;
    return suggestions.filter((item) => item.status === statusFilter);
  }, [suggestions, statusFilter]);

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await bookSuggestionService.approveSuggestion(id, notes[id] || '');
      toast.success('Đã duyệt yêu cầu sách!');
      fetchPageData();
    } catch {
      toast.error('Không thể duyệt yêu cầu!');
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    setProcessingId(id);
    try {
      await bookSuggestionService.rejectSuggestion(id, notes[id] || '');
      toast.success('Đã từ chối yêu cầu sách!');
      fetchPageData();
    } catch {
      toast.error('Không thể từ chối yêu cầu!');
    } finally {
      setProcessingId('');
    }
  };

  const renderStatus = (status) => {
    const config = statusMap[status] || statusMap.pending;
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Quản lý yêu cầu sách</h2>
              <p className="text-muted mb-0">Xem và phản hồi các yêu cầu bổ sung sách từ độc giả.</p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchPageData}>
              Làm mới
            </button>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Tổng yêu cầu</div>
                <div className="fs-3 fw-bold">{stats.total}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Chờ duyệt</div>
                <div className="fs-3 fw-bold text-warning">{stats.pending}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Đã duyệt</div>
                <div className="fs-3 fw-bold text-success">{stats.approved}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Từ chối</div>
                <div className="fs-3 fw-bold text-danger">{stats.rejected}</div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Danh sách yêu cầu</h5>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ maxWidth: '180px' }}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>

            {filteredSuggestions.length === 0 ? (
              <div className="text-center text-muted py-5">
                Không có yêu cầu nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 px-3 py-3">Sách yêu cầu</th>
                      <th className="border-0 px-3 py-3">Độc giả</th>
                      <th className="border-0 px-3 py-3">Ngày gửi</th>
                      <th className="border-0 px-3 py-3">Trạng thái</th>
                      <th className="border-0 px-3 py-3">Ghi chú phản hồi</th>
                      <th className="border-0 px-3 py-3 text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuggestions.map((suggestion) => {
                      const member = memberMap[suggestion.memberId];
                      const isPending = suggestion.status === 'pending';

                      return (
                        <tr key={suggestion.id}>
                          <td className="px-3 py-3" style={{ minWidth: '280px' }}>
                            <div className="fw-semibold">{suggestion.title}</div>
                            <small className="text-muted">Tác giả: {suggestion.author}</small>
                            <div className="small text-secondary">Thể loại: {suggestion.categoryName}</div>
                            <div className="small text-secondary mt-2">{suggestion.reason}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="fw-semibold">{member?.name || 'N/A'}</div>
                            <small className="text-muted">{member?.email || 'N/A'}</small>
                          </td>
                          <td className="px-3 py-3 text-secondary">{suggestion.createdAt}</td>
                          <td className="px-3 py-3">
                            {renderStatus(suggestion.status)}
                            {suggestion.reviewedAt && (
                              <div className="small text-muted mt-2">Xử lý: {suggestion.reviewedAt}</div>
                            )}
                          </td>
                          <td className="px-3 py-3" style={{ minWidth: '240px' }}>
                            {isPending ? (
                              <textarea
                                className="form-control form-control-sm"
                                rows="2"
                                value={notes[suggestion.id] || ''}
                                onChange={(e) => handleNoteChange(suggestion.id, e.target.value)}
                                placeholder="Nhập phản hồi cho độc giả"
                              />
                            ) : (
                              <span className="text-secondary">
                                {suggestion.librarianNote || 'Không có ghi chú'}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-end">
                            {isPending ? (
                              <div className="d-flex justify-content-end gap-2">
                                <button
                                  className="btn btn-success btn-sm"
                                  disabled={processingId === suggestion.id}
                                  onClick={() => handleApprove(suggestion.id)}
                                >
                                  Duyệt
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  disabled={processingId === suggestion.id}
                                  onClick={() => handleReject(suggestion.id)}
                                >
                                  Từ chối
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted small">Đã xử lý</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

```

## src/pages/librarian/LibrarianBorrowRecordsPage.jsx
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

  const handleApprove = async (id) => {
    try { await borrowRecordService.approveBorrowRecord(id); toast.success('Duyệt mượn sách thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu mượn này?')) return;
    try { 
      await borrowRecordService.rejectBorrowRecord(id); 
      toast.success('Đã từ chối yêu cầu mượn sách!'); 
      fetchAll(); 
    } catch (e) { 
      toast.error(e.message || 'Có lỗi xảy ra!'); 
    }
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
          <BorrowRecordForm onSubmit={handleCreate} books={books} members={members} />
        </div>
        <div className="card shadow-sm p-3">
          <h5>Danh sách phiếu mượn</h5>
          <BorrowRecordTable 
            records={records} 
            books={books} 
            members={members} 
            onApprove={handleApprove} 
            onReturn={handleReturn} 
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}

```

## src/pages/librarian/LibrarianCategoriesPage.jsx
```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import categoryService from '../../services/categoryService';
import DataTable from '../../components/common/DataTable';
import Sidebar from '../../components/common/Sidebar';
import CategoryForm from '../../components/category/CategoryForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LibrarianCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch {
      toast.error('Không thể tải danh sách thể loại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (data) => {
    try {
      if (selected) {
        await categoryService.updateCategory(selected.id, data);
      } else {
        await categoryService.createCategory(data);
      }
      toast.success(selected ? 'Cập nhật thể loại thành công!' : 'Thêm thể loại mới thành công!');
      setSelected(null);
      fetchCategories();
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thể loại!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success('Xóa thể loại thành công!');
      fetchCategories();
    } catch {
      toast.error('Không thể xóa thể loại!');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên thể loại' }
  ];

  if (loading) return <LoadingSpinner />;

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
            <div className="card shadow-sm p-3 sticky-top" style={{ top: '20px' }}>
              <h5>{selected ? 'Sửa thể loại' : 'Thêm thể loại'}</h5>
              <CategoryForm 
                category={selected} 
                onSave={handleSave} 
                onCancel={() => setSelected(null)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## src/pages/librarian/LibrarianDashboard.jsx
```javascript
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';
import borrowRecordService from '../../services/borrowRecordService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function LibrarianDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeBorrows: 0,
    pendingRequests: 0
  });
  const [pendingRecords, setPendingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [books, members, records] = await Promise.all([
        bookService.getAllBooks(),
        memberService.getAllMembers(),
        borrowRecordService.getAllRecords()
      ]);

      const pending = records.filter(r => r.status === 'pending');
      const active = records.filter(r => r.status === 'borrowed');

      // Tạo map để lấy tên sách nhanh
      const bookMap = {};
      books.forEach(b => { bookMap[b.id] = b.title; });

      // Tạo map để lấy tên độc giả nhanh
      const memberMap = {};
      members.forEach(m => { memberMap[m.id] = m.name; });

      setStats({
        totalBooks: books.length,
        totalMembers: members.length,
        activeBorrows: active.length,
        pendingRequests: pending.length
      });

      // Lấy danh sách chờ duyệt kèm chi tiết
      setPendingRecords(
        pending.map(r => ({
          ...r,
          bookTitle: bookMap[r.bookId] || 'Không xác định',
          memberName: memberMap[r.memberId] || 'Không xác định'
        }))
      );
    } catch (e) {
      toast.error('Lỗi khi tải dữ liệu thống kê!');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await borrowRecordService.approveBorrowRecord(id);
      toast.success('Duyệt mượn sách thành công!');
      fetchData(); // Tải lại dữ liệu
    } catch (e) {
      toast.error(e.message || 'Có lỗi xảy ra!');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu mượn này?')) return;
    try {
      await borrowRecordService.rejectBorrowRecord(id);
      toast.success('Đã từ chối yêu cầu mượn.');
      fetchData();
    } catch (e) {
      toast.error(e.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark mb-0">Bảng điều khiển thủ thư</h2>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchData}>
              Làm mới
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Thống kê Tổng quan */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Sách
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Tổng đầu sách</h6>
                        <h3 className="fw-bold mb-0">{stats.totalBooks}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Độc giả
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Tổng số độc giả</h6>
                        <h3 className="fw-bold mb-0">{stats.totalMembers}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Mượn
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Đang mượn</h6>
                        <h3 className="fw-bold mb-0">{stats.activeBorrows}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Chờ
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Chờ duyệt mượn</h6>
                        <h3 className="fw-bold mb-0 text-danger">{stats.pendingRequests}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng yêu cầu chờ duyệt */}
              <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <span>Yêu cầu</span> chờ duyệt gần đây
                </h5>

                {pendingRecords.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span className="display-4 d-block mb-3">Trống</span>
                    Hiện tại không có yêu cầu mượn sách nào cần phê duyệt!
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 px-3 py-3">Độc giả</th>
                          <th className="border-0 px-3 py-3">Sách yêu cầu</th>
                          <th className="border-0 px-3 py-3 text-center">Trạng thái</th>
                          <th className="border-0 px-3 py-3 text-end">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRecords.map((r) => (
                          <tr key={r.id}>
                            <td className="px-3 py-3 fw-semibold text-dark">{r.memberName}</td>
                            <td className="px-3 py-3">{r.bookTitle}</td>
                            <td className="px-3 py-3 text-center">
                              <span className="badge bg-warning text-dark py-2 px-3 fw-semibold">
                                Chờ duyệt
                              </span>
                            </td>
                            <td className="px-3 py-3 text-end">
                              <button
                                className="btn btn-success btn-sm me-2 fw-semibold px-3"
                                onClick={() => handleApprove(r.id)}
                              >
                                Duyệt mượn
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm fw-semibold px-3"
                                onClick={() => handleReject(r.id)}
                              >
                                Từ chối
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

```

## src/pages/librarian/LibrarianMembersPage.jsx
```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import memberService from '../../services/memberService';
import MemberList from '../../components/member/MemberList';
import Sidebar from '../../components/common/Sidebar';
import MemberForm from '../../components/member/MemberForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LibrarianMembersPage() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await memberService.getAllMembers();
      setMembers(data);
    } catch {
      toast.error('Không thể tải danh sách độc giả!');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(true);
  }, []);

  const handleSave = async (data) => {
    try {
      if (selected) {
        // Cập nhật User
        await api.patch(`/users/${selected.userId}`, {
          fullname: data.fullname,
          email: data.email,
          ...(data.password ? { password: data.password } : {})
        });
        // Cập nhật Member
        await memberService.updateMember(selected.id, {
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          city: data.city,
          address: data.address,
          favorites: data.favorites
        });
        toast.success('Cập nhật độc giả thành công!');
      } else {
        // Kiểm tra email
        const exist = await api.get(`/users?email=${data.email}`);
        if (exist.data.length > 0) {
          toast.error('Email này đã được sử dụng!');
          return;
        }
        // Tạo User mới
        const newUserRes = await api.post('/users', {
          fullname: data.fullname,
          email: data.email,
          password: data.password,
          role: 'member'
        });
        // Tạo Member
        await memberService.createMember({
          userId: newUserRes.data.id,
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          city: data.city,
          address: data.address,
          favorites: data.favorites || []
        });
        toast.success('Thêm độc giả mới thành công!');
      }
      setSelected(null);
      fetchMembers(false);
    } catch {
      toast.error('Có lỗi xảy ra khi lưu độc giả!');
    }
  };

  const handleDelete = async (id, userId) => {
    try {
      await memberService.deleteMember(id);
      if (userId) {
        await api.delete(`/users/${userId}`);
      }
      toast.success('Xóa độc giả thành công!');
      if (selected && selected.id === id) setSelected(null);
      fetchMembers(false);
    } catch {
      toast.error('Không thể xóa độc giả!');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="row">
          <div className="col-md-8">
            <h2 className="mb-3">Quản lý độc giả</h2>
            <MemberList 
              members={members} 
              onEdit={setSelected} 
              onDelete={handleDelete} 
            />
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3 sticky-top" style={{ top: '20px' }}>
              <h5>{selected ? 'Sửa độc giả' : 'Thêm độc giả'}</h5>
              <MemberForm 
                member={selected} 
                onSave={handleSave} 
                onCancel={() => setSelected(null)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## src/pages/LoginPage.jsx
```javascript
import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.get(
        `/users?email=${email}`
      );
      console.log('Login API Response:', res.data);

      if (res.data.length === 0 || String(res.data[0].password) !== String(password)) {
        setMsgError('Email hoặc mật khẩu không đúng!');
        return;
      }
      const u = res.data[0];
      login({ uId: u.id, role: u.role, name: u.fullname });
      navigate(u.role === 'librarian' ? '/librarian/dashboard' : '/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      setMsgError('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className="container mt-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h3 className="text-primary mb-3">Đăng nhập</h3>
            {msgError && <div className="alert alert-danger">{msgError}</div>}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Đăng nhập</button>
            <div className="text-center">
              <span>Chưa có tài khoản? </span>
              <Link to="/register" className="text-primary text-decoration-none fw-semibold">Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## src/pages/member/BookSuggestionPage.jsx
```javascript
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import memberService from '../../services/memberService';
import categoryService from '../../services/categoryService';
import bookSuggestionService from '../../services/bookSuggestionService';

const initialForm = {
  title: '',
  author: '',
  categoryName: '',
  reason: ''
};

const statusMap = {
  pending: { label: 'Chờ duyệt', className: 'bg-warning text-dark' },
  approved: { label: 'Đã duyệt', className: 'bg-success' },
  rejected: { label: 'Từ chối', className: 'bg-danger' }
};

export default function BookSuggestionPage() {
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPageData = useCallback(async () => {
    if (!user?.uId) return;
    setLoading(true);
    try {
      const currentMember = await memberService.getMemberByUserId(user.uId);
      if (!currentMember) {
        toast.error('Không tìm thấy thông tin độc giả!');
        return;
      }

      const [categoryData, suggestionData] = await Promise.all([
        categoryService.getAllCategories(),
        bookSuggestionService.getSuggestionsByMemberId(currentMember.id)
      ]);

      setMember(currentMember);
      setCategories(categoryData);
      setSuggestions(suggestionData);
    } catch {
      toast.error('Không thể tải danh sách yêu cầu thêm sách!');
    } finally {
      setLoading(false);
    }
  }, [user?.uId]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Vui lòng nhập tên sách.';
    if (!form.author.trim()) return 'Vui lòng nhập tác giả.';
    if (!form.categoryName.trim()) return 'Vui lòng nhập thể loại mong muốn.';
    if (form.reason.trim().length < 10) return 'Lý do yêu cầu cần ít nhất 10 ký tự.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      await bookSuggestionService.createSuggestion({
        memberId: member.id,
        title: form.title.trim(),
        author: form.author.trim(),
        categoryName: form.categoryName.trim(),
        reason: form.reason.trim()
      });
      toast.success('Đã gửi yêu cầu thêm sách!');
      setForm(initialForm);
      fetchPageData();
    } catch {
      toast.error('Không thể gửi yêu cầu. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatus = (status) => {
    const config = statusMap[status] || statusMap.pending;
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Yêu cầu thêm sách</h2>
              <p className="text-muted mb-0">Gửi yêu cầu bổ sung những đầu sách bạn muốn thư viện nhập thêm.</p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchPageData}>
              Làm mới
            </button>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Gửi yêu cầu mới</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tên sách</label>
                    <input
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Ví dụ: Atomic Habits"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tác giả</label>
                    <input
                      className="form-control"
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="Ví dụ: James Clear"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Thể loại mong muốn</label>
                    <input
                      className="form-control"
                      name="categoryName"
                      value={form.categoryName}
                      onChange={handleChange}
                      list="suggestion-category-options"
                      placeholder="Chọn hoặc nhập thể loại"
                    />
                    <datalist id="suggestion-category-options">
                      {categories.map((category) => (
                        <option key={category.id} value={category.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Lý do yêu cầu</label>
                    <textarea
                      className="form-control"
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Vì sao thư viện nên nhập cuốn sách này?"
                    />
                  </div>

                  <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Yêu cầu của tôi</h5>
                {suggestions.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    Bạn chưa gửi yêu cầu thêm sách nào.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 px-3 py-3">Sách yêu cầu</th>
                          <th className="border-0 px-3 py-3">Thể loại</th>
                          <th className="border-0 px-3 py-3">Ngày gửi</th>
                          <th className="border-0 px-3 py-3">Trạng thái</th>
                          <th className="border-0 px-3 py-3">Phản hồi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suggestions.map((suggestion) => (
                          <tr key={suggestion.id}>
                            <td className="px-3 py-3">
                              <div className="fw-semibold">{suggestion.title}</div>
                              <small className="text-muted">Tác giả: {suggestion.author}</small>
                              <div className="small text-secondary mt-1">{suggestion.reason}</div>
                            </td>
                            <td className="px-3 py-3">{suggestion.categoryName}</td>
                            <td className="px-3 py-3 text-secondary">{suggestion.createdAt}</td>
                            <td className="px-3 py-3">{renderStatus(suggestion.status)}</td>
                            <td className="px-3 py-3 text-secondary">
                              {suggestion.librarianNote || 'Chưa có phản hồi'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## src/pages/member/MemberDashboard.jsx
```javascript
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import memberService from '../../services/memberService';
import borrowRecordService from '../../services/borrowRecordService';
import bookService from '../../services/bookService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    borrowingCount: 0,
    pendingCount: 0,
    totalHistoryCount: 0
  });
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Lấy profile độc giả
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin độc giả liên kết!');
        return;
      }

      // Lấy lịch sử mượn trả
      const records = await borrowRecordService.getRecordsByMemberId(member.id);
      const books = await bookService.getAllBooks();

      const bookMap = {};
      books.forEach(b => { bookMap[b.id] = b; });

      const borrowing = records.filter(r => r.status === 'borrowed');
      const pending = records.filter(r => r.status === 'pending');

      setStats({
        borrowingCount: borrowing.length,
        pendingCount: pending.length,
        totalHistoryCount: records.length
      });

      // Lọc danh sách đang mượn kèm chi tiết sách và số ngày còn lại
      const now = new Date();
      now.setHours(0,0,0,0);

      setActiveBorrows(
        borrowing.map(r => {
          const book = bookMap[r.bookId] || {};
          const dueDate = new Date(r.dueDate);
          dueDate.setHours(0,0,0,0);
          
          const timeDiff = dueDate.getTime() - now.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

          return {
            ...r,
            bookTitle: book.title || 'Không xác định',
            coverImage: book.coverImage,
            author: book.author,
            daysLeft,
            isOverdue: daysLeft < 0
          };
        })
      );
    } catch (e) {
      toast.error('Lỗi khi tải thông tin bảng điều khiển!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Bảng điều khiển độc giả</h2>
              <p className="text-muted mb-0">Xin chào quay trở lại, {user?.name}!</p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchDashboardData}>
              Làm mới
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Thống kê Tổng quan */}
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Sách
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Sách đang mượn</h6>
                        <h3 className="fw-bold mb-0">{stats.borrowingCount}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-info bg-opacity-10 text-info rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Chờ
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Yêu cầu chờ duyệt</h6>
                        <h3 className="fw-bold mb-0">{stats.pendingCount}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Đã trả
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Tổng số sách đã mượn</h6>
                        <h3 className="fw-bold mb-0">{stats.totalHistoryCount}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sách đang mượn */}
              <div className="card border-0 shadow-sm p-4 bg-white mb-4" style={{ borderRadius: '12px' }}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <span>Sách</span> bạn đang mượn thực tế
                </h5>

                {activeBorrows.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span className="display-4 d-block mb-3">Sách</span>
                    Bạn chưa mượn cuốn sách nào! Hãy truy cập danh mục để tìm và đăng ký mượn nhé.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 px-3 py-3">Bìa sách</th>
                          <th className="border-0 px-3 py-3">Tên sách / Tác giả</th>
                          <th className="border-0 px-3 py-3 text-center">Ngày mượn</th>
                          <th className="border-0 px-3 py-3 text-center">Hạn trả</th>
                          <th className="border-0 px-3 py-3 text-center">Trạng thái hạn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBorrows.map((r) => (
                          <tr key={r.id}>
                            <td className="px-3 py-3" style={{ width: '80px' }}>
                              <img 
                                src={r.coverImage ? `${r.coverImage}` : '/images/default-book.png'} 
                                alt={r.bookTitle} 
                                className="rounded"
                                style={{ width: '50px', height: '70px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                onError={(e) => { e.target.src = '/images/default-book.png'; }}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <div className="fw-semibold text-dark">{r.bookTitle}</div>
                              <small className="text-muted">Tác giả: {r.author || 'Chưa cập nhật'}</small>
                            </td>
                            <td className="px-3 py-3 text-center text-secondary">{r.borrowDate}</td>
                            <td className="px-3 py-3 text-center text-secondary">{r.dueDate}</td>
                            <td className="px-3 py-3 text-center">
                              {r.isOverdue ? (
                                <span className="badge bg-danger py-2 px-3 fw-semibold">
                                  Quá hạn {Math.abs(r.daysLeft)} ngày!
                                </span>
                              ) : (
                                <span className="badge bg-success py-2 px-3 fw-semibold">
                                  Còn {r.daysLeft} ngày
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

```

## src/pages/MyBorrowRecordsPage.jsx
```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import memberService from '../services/memberService';
import borrowRecordService from '../services/borrowRecordService';
import bookService from '../services/bookService';
import MyBorrowRecordHistory from '../components/borrowRecord/MyBorrowRecordHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Sidebar from '../components/common/Sidebar';

export default function MyBorrowRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uId) {
        setLoading(false);
        return;
      }

      try {
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
  }, [user?.uId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">Lịch sử mượn sách của tôi</h2>
        <MyBorrowRecordHistory records={records} books={books} />
      </div>
    </div>
  );
}

```

## src/pages/ProfilePage.jsx
```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import memberService from '../services/memberService';
import categoryService from '../services/categoryService';
import Sidebar from '../components/common/Sidebar';
import { toast } from 'react-toastify';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/users/${user.uId}`);
        const u = res.data;
        setFullname(u.fullname || '');
        setEmail(u.email || '');
        setPassword(u.password || '');
        
        // Tải danh mục thể loại động từ CSDL
        const cats = await categoryService.getAllCategories();
        setAvailableCategories(cats);
        
        // Nếu là độc giả thì tải thêm các thông tin mở rộng của member
        if (u.role === 'member') {
          const member = await memberService.getMemberByUserId(u.id);
          if (member) {
            setPhone(member.phone || '');
            setGender(member.gender || 'Nam');
            setDob(member.dob || '');
            setCity(member.city || '');
            setAddress(member.address || '');
            setFavorites(member.favorites || []);
          }
        }
      } catch {
        toast.error('Không thể tải thông tin cá nhân!');
      } finally {
        setLoading(false);
      }
    };
    if (user?.uId) loadProfile();
  }, [user?.uId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullname.trim() || !email.trim() || !password.trim()) {
      toast.warning('Vui lòng nhập đầy đủ thông tin tài khoản!');
      return;
    }
    if (user.role === 'member' && !phone.trim()) {
      toast.warning('Vui lòng nhập số điện thoại!');
      return;
    }

    setSaving(true);
    try {
      // 1. Cập nhật bảng users
      await api.patch(`/users/${user.uId}`, {
        fullname,
        email,
        password
      });

      // 2. Nếu là độc giả, cập nhật thông tin trong bảng members tương ứng
      if (user.role === 'member') {
        const member = await memberService.getMemberByUserId(user.uId);
        if (member) {
          await api.patch(`/members/${member.id}`, {
            phone,
            gender,
            dob,
            city,
            address,
            favorites
          });
        }
      }

      // Cập nhật lại context state
      login({ ...user, name: fullname });
      toast.success('Cập nhật hồ sơ cá nhân thành công!');
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thông tin!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải thông tin...</div>;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Row className="justify-content-center mt-4">
          <Col md={user.role === 'member' ? 8 : 6}>
            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
              <Card.Body>
                <h3 className="mb-4 text-primary fw-bold">Hồ sơ cá nhân</h3>
                <Form onSubmit={handleSave}>
                  <Row>
                    {/* Cột 1: Thông tin tài khoản chính */}
                    <Col md={user.role === 'member' ? 6 : 12}>
                      <h5 className="fw-bold text-secondary mb-3">Thông tin tài khoản</h5>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Họ và tên</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={fullname} 
                          onChange={(e) => setFullname(e.target.value)} 
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                        <Form.Control 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                        />
                      </Form.Group>
                    </Col>

                    {/* Cột 2: Thông tin mở rộng của Độc giả (Chỉ hiển thị cho member) */}
                    {user.role === 'member' && (
                      <Col md={6} className="border-start ps-4">
                        <h5 className="fw-bold text-secondary mb-3">Thông tin độc giả</h5>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Giới tính</Form.Label>
                          <div className="py-1">
                            <Form.Check
                              inline
                              type="radio"
                              label="Nam"
                              name="gender"
                              value="Nam"
                              checked={gender === 'Nam'}
                              onChange={(e) => setGender(e.target.value)}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="Nữ"
                              name="gender"
                              value="Nữ"
                              checked={gender === 'Nữ'}
                              onChange={(e) => setGender(e.target.value)}
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Ngày sinh (DoB)</Form.Label>
                          <Form.Control 
                            type="date" 
                            value={dob} 
                            onChange={(e) => setDob(e.target.value)} 
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Thành phố (City)</Form.Label>
                          <Form.Select 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)}
                          >
                            <option value="">-- Chọn thành phố --</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Địa chỉ (Address)</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Thể loại yêu thích (Favorites)</Form.Label>
                          <div>
                            {availableCategories.map((cat) => (
                              <Form.Check
                                inline
                                key={cat.id}
                                type="checkbox"
                                label={cat.name}
                                checked={favorites.includes(cat.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFavorites([...favorites, cat.name]);
                                  } else {
                                    setFavorites(favorites.filter((f) => f !== cat.name));
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 fw-semibold py-2 mt-3" 
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

```

## src/pages/RegisterPage.jsx
```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function RegisterPage() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validations
    if (!fullname || !email || !password || !confirmPassword || !phone || !dob || !address) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải chứa ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp!');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Số điện thoại phải chứa đúng 10 chữ số!');
      return;
    }

    try {
      setIsLoading(true);

      // Check if email already exists
      const checkEmailRes = await api.get(`/users?email=${email}`);
      if (checkEmailRes.data.length > 0) {
        toast.error('Email này đã được sử dụng. Vui lòng chọn email khác!');
        setIsLoading(false);
        return;
      }

      // Step 1: Create user in users table
      const newUser = {
        fullname,
        email,
        password,
        role: 'member'
      };

      const userRes = await api.post('/users', newUser);
      const createdUser = userRes.data;

      // Step 2: Create member details in members table
      const newMember = {
        userId: createdUser.id,
        phone,
        gender,
        dob,
        city,
        address,
        favorites: []
      };

      await api.post('/members', newMember);

      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Đăng ký thất bại. Đã xảy ra lỗi hệ thống!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4 border-0">
            <h3 className="text-primary text-center mb-4">Đăng ký Độc giả</h3>
            <form onSubmit={handleRegister}>
              <h5 className="text-secondary border-bottom pb-2 mb-3">Thông tin tài khoản</h5>
              
              <div className="mb-3">
                <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập họ và tên"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <h5 className="text-secondary border-bottom pb-2 mb-3 mt-4">Thông tin cá nhân</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Ví dụ: 0356965077"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Ngày sinh <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tỉnh / Thành phố</label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Phú Thọ">Phú Thọ</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Địa chỉ cụ thể <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập địa chỉ nhà, tên đường..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
              </button>

              <div className="text-center">
                <span>Đã có tài khoản? </span>
                <Link to="/login" className="text-primary text-decoration-none fw-semibold">Đăng nhập</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## src/services/api.js
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

## src/services/bookService.js
```javascript
import api from './api';

const bookService = {
  getAllBooks: async () => (await api.get('/books')).data,
  getBookById: async (id) => (await api.get(`/books/${id}`)).data,
  createBook: async (data) => (await api.post('/books', data)).data,
  updateBook: async (id, data) => (await api.put(`/books/${id}`, data)).data,
  deleteBook: async (id) => {
    const borrowRecords = (await api.get(`/borrowRecords?bookId=${id}`)).data;
    const activeRecords = borrowRecords.filter(r => r.status === 'borrowed' || r.status === 'pending');
    if (activeRecords.length > 0) {
      throw new Error('Không thể xóa sách vì đang có độc giả mượn hoặc yêu cầu mượn!');
    }
    await api.delete(`/books/${id}`);
    return true;
  },
};

export default bookService;

```

## src/services/bookSuggestionService.js
```javascript
import api from './api';

const bookSuggestionService = {
  getAllSuggestions: async () => (await api.get('/bookSuggestions')).data,

  getSuggestionsByMemberId: async (memberId) =>
    (await api.get(`/bookSuggestions?memberId=${memberId}`)).data,

  createSuggestion: async (data) =>
    (await api.post('/bookSuggestions', {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      reviewedAt: null,
      librarianNote: ''
    })).data,

  approveSuggestion: async (id, librarianNote = '') => {
    await api.patch(`/bookSuggestions/${id}`, {
      status: 'approved',
      reviewedAt: new Date().toISOString().split('T')[0],
      librarianNote
    });
    return true;
  },

  rejectSuggestion: async (id, librarianNote = '') => {
    await api.patch(`/bookSuggestions/${id}`, {
      status: 'rejected',
      reviewedAt: new Date().toISOString().split('T')[0],
      librarianNote
    });
    return true;
  }
};

export default bookSuggestionService;

```

## src/services/borrowRecordService.js
```javascript
import api from './api';
import bookService from './bookService';

const borrowRecordService = {
  getAllRecords: async () => (await api.get('/borrowRecords')).data,

  getRecordsByMemberId: async (memberId) =>
    (await api.get(`/borrowRecords?memberId=${memberId}`)).data,

  createBorrowRecord: async ({ bookId, memberId, dueDate, status = 'borrowed' }) => {
    // Kiểm tra sách còn không
    const book = await bookService.getBookById(bookId);
    if (book.availableCopies <= 0) throw new Error('Sách đã hết!');

    // Kiểm tra logic mượn sách:
    // 1. Tối đa 3 sách (đang mượn + đang chờ duyệt)
    // 2. Không mượn trùng cuốn sách
    const records = await borrowRecordService.getRecordsByMemberId(memberId);
    const activeRecords = records.filter(r => r.status === 'borrowed' || r.status === 'pending');
    
    if (activeRecords.length >= 3) {
      throw new Error('Bạn chỉ được mượn (hoặc đang yêu cầu) tối đa 3 cuốn sách cùng lúc!');
    }
    if (activeRecords.some(r => String(r.bookId) === String(bookId))) {
      throw new Error('Bạn đang mượn hoặc đã gửi yêu cầu mượn cuốn sách này rồi!');
    }

    // Tạo borrow record
    const record = (await api.post('/borrowRecords', {
      bookId, memberId, dueDate,
      borrowDate: status === 'borrowed' ? new Date().toISOString().split('T')[0] : null,
      returnDate: null,
      status
    })).data;

    // Giảm availableCopies nếu mượn trực tiếp
    if (status === 'borrowed') {
      await bookService.updateBook(bookId, {
        ...book,
        availableCopies: book.availableCopies - 1
      });
    }

    return record;
  },

  approveBorrowRecord: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status !== 'pending') throw new Error('Yêu cầu không ở trạng thái chờ duyệt!');

    const book = await bookService.getBookById(record.bookId);
    if (book.availableCopies <= 0) throw new Error('Sách đã hết, không thể duyệt!');

    // Tính ngày mượn và hạn trả (14 ngày kể từ hôm nay)
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 14);
    const dueDateString = due.toISOString().split('T')[0];

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDateString,
      status: 'borrowed'
    });

    const newAvailableCopies = book.availableCopies - 1;

    // Giảm availableCopies
    await bookService.updateBook(record.bookId, {
      ...book,
      availableCopies: newAvailableCopies
    });

    // Nếu sách đã hết (về 0), càn quét các phiếu mượn pending khác của sách này và reject
    if (newAvailableCopies <= 0) {
      const allRecords = (await api.get(`/borrowRecords?bookId=${record.bookId}&status=pending`)).data;
      // Lọc bỏ chính nó (dù nó đã được update thành borrowed rồi, nhưng để cho an toàn)
      const pendingOthers = allRecords.filter(r => String(r.id) !== String(recordId));
      for (const pRecord of pendingOthers) {
        await api.patch(`/borrowRecords/${pRecord.id}`, { status: 'rejected' });
      }
    }

    return true;
  },

  returnBook: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status === 'returned') throw new Error('Sách đã được trả trước đó!');

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      returnDate: new Date().toISOString().split('T')[0],
      status: 'returned'
    });

    // Tăng availableCopies nếu trạng thái trước đó là borrowed
    if (record.status === 'borrowed') {
      const book = await bookService.getBookById(record.bookId);
      await bookService.updateBook(record.bookId, {
        ...book,
        availableCopies: book.availableCopies + 1
      });
    }

    return true;
  },

  rejectBorrowRecord: async (recordId) => {
    await api.patch(`/borrowRecords/${recordId}`, {
      status: 'rejected'
    });
    return true;
  }
};

export default borrowRecordService;

```

## src/services/categoryService.js
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

## src/services/memberService.js
```javascript
import api from './api';

const memberService = {
  getAllMembers: async () => {
    const [membersRes, usersRes] = await Promise.all([
      api.get('/members'),
      api.get('/users')
    ]);
    const users = usersRes.data;
    return membersRes.data.map(m => {
      const user = users.find(u => u.id === m.userId);
      return {
        ...m,
        name: user?.fullname || 'N/A',
        email: user?.email || 'N/A'
      };
    });
  },
  getMemberByUserId: async (userId) => {
    const data = (await api.get(`/members?userId=${userId}`)).data;
    const m = data[0];
    if (!m) return null;
    const userRes = await api.get(`/users/${userId}`);
    return { ...m, name: userRes.data?.fullname || 'N/A', email: userRes.data?.email || 'N/A' };
  },
  createMember: async (data) => (await api.post('/members', data)).data,
  updateMember: async (id, data) => (await api.put(`/members/${id}`, data)).data,
  deleteMember: async (id) => { await api.delete(`/members/${id}`); return true; },
};

export default memberService;

```

## src/services/reviewService.js
```javascript
import api from './api';

const reviewService = {
  // Lấy danh sách đánh giá của 1 sách, kèm thông tin người đánh giá (expand member)
  getReviewsByBookId: async (bookId) => {
    try {
      const response = await api.get(`/reviews?bookId=${bookId}&_expand=member&_sort=createdAt&_order=desc`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // Tạo đánh giá mới
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', {
        ...reviewData,
        createdAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }
};

export default reviewService;

```

