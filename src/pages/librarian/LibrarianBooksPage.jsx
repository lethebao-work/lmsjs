import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import BookForm from '../../components/book/BookForm';
import DataTable from '../../components/common/DataTable';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function LibrarianBooksPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bookData, categoryData] = await Promise.all([
        bookService.getAllBooks(),
        categoryService.getAllCategories()
      ]);
      setBooks(bookData);
      setCategories(categoryData);
    } catch {
      toast.error('Không thể tải danh sách sách!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (data) => {
    try {
      if (selectedBook) await bookService.updateBook(selectedBook.id, data);
      else await bookService.createBook(data);
      toast.success(selectedBook ? 'Cập nhật sách thành công!' : 'Thêm sách mới thành công!');
      setSelectedBook(null);
      fetchAll();
    } catch {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await bookService.deleteBook(id);
      toast.success('Xóa sách thành công!');
      fetchAll();
    } catch {
      toast.error('Không thể xóa sách!');
    }
  };

  const columns = [
    { key: 'bookCode', label: 'Mã sách' },
    { key: 'title', label: 'Tên sách' },
    { key: 'author', label: 'Tác giả' },
    {
      key: 'categoryId',
      label: 'Thể loại',
      render: (book) => {
        const category = categories.find(c => String(c.id) === String(book.categoryId));
        return category ? category.name : 'Chưa phân loại';
      }
    },
    { key: 'availableCopies', label: 'Còn lại' },
    { key: 'totalCopies', label: 'Tổng số' },
  ];

  const filteredBooks = useMemo(() => {
    const keyword = normalizeText(searchTerm.trim());

    return books.filter((book) => {
      const category = categories.find(c => String(c.id) === String(book.categoryId));
      const haystack = normalizeText([
        book.id,
        book.bookCode,
        book.title,
        book.author,
        category?.name
      ].join(' '));

      const matchesSearch = !keyword || haystack.includes(keyword);
      const matchesCategory = categoryFilter === 'all' || String(book.categoryId) === String(categoryFilter);
      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && Number(book.availableCopies) > 0) ||
        (availabilityFilter === 'unavailable' && Number(book.availableCopies) <= 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, categories, searchTerm, categoryFilter, availabilityFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="lms-page-header">
              <div>
                <h2 className="lms-page-title">Quản lý sách</h2>
                <p className="lms-page-subtitle">Tìm kiếm, lọc và cập nhật danh mục sách phục vụ quy trình mượn trả.</p>
              </div>
            </div>

            <div className="lms-toolbar">
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label className="form-label small fw-semibold text-secondary">Tìm kiếm</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                    <input
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tên sách, tác giả, mã sách..."
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold text-secondary">Thể loại</label>
                  <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">Tất cả thể loại</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold text-secondary">Tình trạng</label>
                  <select className="form-select" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="available">Còn sách</option>
                    <option value="unavailable">Hết sách</option>
                  </select>
                </div>
                <div className="col-md-1 d-grid">
                  <button
                    className="btn btn-light border"
                    title="Xóa bộ lọc"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setAvailabilityFilter('all');
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="lms-result-count mt-3">
                Hiển thị {filteredBooks.length} / {books.length} sách
              </div>
            </div>

            <DataTable data={filteredBooks} columns={columns} onEdit={setSelectedBook} onDelete={handleDelete} />
          </div>
          <div className="col-lg-4">
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
