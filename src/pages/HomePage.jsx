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
