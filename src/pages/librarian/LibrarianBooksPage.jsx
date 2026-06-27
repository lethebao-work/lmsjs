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
