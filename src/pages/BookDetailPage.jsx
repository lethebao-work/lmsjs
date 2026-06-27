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
