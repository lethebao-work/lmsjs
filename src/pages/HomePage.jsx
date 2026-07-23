import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import BookList from '../components/book/BookList';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([bookService.getAllBooks(), categoryService.getAllCategories()])
      .then(([books, cats]) => {
        setFeaturedBooks(books);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let url = '/books?';
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
    if (selectedCategory) url += `cat=${encodeURIComponent(selectedCategory)}`;
    navigate(url);
  };

  return (
    <div className="homepage-wrapper">
      {/* 1. Hero Section matching user screenshot */}
      <section 
        className="library-hero-banner"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('/images/library_hero_bg.png')` 
        }}
      >
        <div className="hero-search-card text-center position-relative">
          <h2 className="fw-extrabold text-dark mb-2" style={{ fontSize: '2.1rem', letterSpacing: '-0.02em' }}>
            Khám phá bộ sưu tập
          </h2>
          <p className="text-muted small mb-4">
            Tìm kiếm hàng triệu cuốn sách, tạp chí và tài nguyên số.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="input-group input-group-lg border rounded-3 p-1 bg-light">
              {/* Dropdown Category */}
              <select
                className="form-select border-0 bg-transparent fw-semibold text-secondary shadow-none"
                style={{ maxWidth: '140px', fontSize: '0.95rem' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="vr my-2 text-muted"></div>

              {/* Input */}
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none px-3"
                placeholder="Tìm kiếm theo tiêu đề, tác giả hoặc từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              />

              {/* Search Button */}
              <button 
                type="submit" 
                className="btn btn-brown px-4 font-bold text-white rounded-2 d-flex align-items-center gap-2"
                style={{ backgroundColor: '#8B4000' }}
              >
                <span>Tìm kiếm</span>
              </button>
            </div>
          </form>

          {/* Quick Helper Links below Search Bar */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 small text-muted">
            <button 
              type="button" 
              className="btn btn-link p-0 text-muted text-decoration-none small d-flex align-items-center gap-1"
              onClick={() => navigate('/books')}
            >
              <i className="bi bi-sliders me-1"></i> Tìm kiếm nâng cao
            </button>
            <span className="text-muted">|</span>
            <button 
              type="button" 
              className="btn btn-link p-0 text-muted text-decoration-none small d-flex align-items-center gap-1"
              onClick={() => navigate('/books')}
            >
              <i className="bi bi-journal-bookmark me-1"></i> Giáo trình theo ngành
            </button>
            <span className="text-muted">|</span>
            <button 
              type="button" 
              className="btn btn-link p-0 text-muted text-decoration-none small d-flex align-items-center gap-1"
              onClick={() => navigate('/book-suggestions')}
            >
              <i className="bi bi-chat-dots me-1"></i> Trò chuyện với Thủ thư
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top Sách Hot Section matching screenshot */}
      <section className="container-fluid px-4 py-5" style={{ maxWidth: '1400px' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '1.6rem' }}>
            <span>🔥 🔥</span> Top sách hot tại thư viện
          </h3>
          <button 
            className="btn btn-outline-dark btn-sm rounded-pill px-3 font-semibold"
            onClick={() => navigate('/books')}
          >
            Xem tất cả <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>

        {loading ? <LoadingSpinner /> : <BookList books={featuredBooks} categories={categories} />}
      </section>

      {/* 3. Floating Chat Button matching screenshot bottom right icon */}
      <div 
        className="floating-chat-btn"
        title="Trò chuyện với Thủ thư"
        onClick={() => navigate('/book-suggestions')}
      >
        <i className="bi bi-chat-fill fs-4"></i>
      </div>
    </div>
  );
}
