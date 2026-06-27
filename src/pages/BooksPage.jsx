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
