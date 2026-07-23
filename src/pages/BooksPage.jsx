import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('cat') || '';

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    Promise.all([bookService.getAllBooks(), categoryService.getAllCategories()])
      .then(([b, c]) => { setBooks(b); setCategories(c); })
      .catch(() => setError('Không thể tải dữ liệu thư viện!'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchParams.get('search')) {
      setSearchTerm(searchParams.get('search'));
    }
    if (searchParams.get('cat')) {
      setSelectedCategory(searchParams.get('cat'));
    }
  }, [searchParams]);

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
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-extrabold text-dark mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-book-half" style={{ color: '#8B4000' }}></i> Tra cứu Danh mục Sách
            </h2>
            <p className="text-muted small mb-0">Tìm kiếm và lọc tài liệu kho sách thư viện trường</p>
          </div>
          <span className="badge bg-white border text-dark p-2.5 rounded-pill shadow-sm">
            <i className="bi bi-journal-text me-1" style={{ color: '#8B4000' }}></i> Tổng cộng: <strong>{filtered.length}</strong> cuốn sách
          </span>
        </div>

        {/* Filter Controls Card */}
        <div className="lms-card p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <SearchBar 
                initialValue={searchTerm}
                onSearch={(t) => { setSearchTerm(t); setCurrentPage(1); }} 
              />
            </div>
            <div className="col-md-6">
              <FilterPanel 
                categories={categories} 
                selectedCat={selectedCategory}
                onFilterChange={(cat, avail) => {
                  setSelectedCategory(cat); 
                  setAvailabilityFilter(avail); 
                  setCurrentPage(1);
                }} 
              />
            </div>
          </div>
        </div>

        {/* Book List Content */}
        {filtered.length === 0 ? (
          <div className="lms-card text-center py-5">
            <i className="bi bi-search text-muted display-4 d-block mb-3"></i>
            <h5 className="fw-bold text-dark">Không tìm thấy sách phù hợp</h5>
            <p className="text-muted small">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
          </div>
        ) : (
          <>
            <BookList books={paginated} categories={categories} />
            <div className="mt-4 d-flex justify-content-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
