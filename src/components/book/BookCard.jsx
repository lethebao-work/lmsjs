import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book, categories = [] }) {
  const navigate = useNavigate();
  const isAvailable = book.availableCopies > 0;
  const category = categories.find(c => String(c.id) === String(book.categoryId));

  const getCoverImage = () => {
    if (!book.coverImage) return 'https://via.placeholder.com/200x260?text=No+Cover';
    if (book.coverImage.startsWith('http') || book.coverImage.startsWith('/')) {
      return book.coverImage;
    }
    return `/${book.coverImage}`;
  };

  return (
    <div 
      className="card h-100 border rounded-4 shadow-sm p-2.5 bg-white d-flex flex-column justify-content-between"
      style={{ transition: 'all 0.2s ease-in-out' }}
    >
      <div>
        {/* Book Cover Image */}
        <div 
          className="rounded-3 overflow-hidden text-center mb-3 bg-light d-flex align-items-center justify-content-center"
          style={{ height: '240px', cursor: 'pointer' }}
          onClick={() => navigate(`/books/${book.id}`)}
        >
          <img
            src={getCoverImage()}
            alt={book.title}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x260?text=No+Cover'; }}
          />
        </div>

        {/* Status Pill Badge matching screenshot 1 */}
        <div className="mb-2">
          {isAvailable ? (
            <span 
              className="badge rounded-pill fw-bold text-uppercase px-2.5 py-1"
              style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.7rem', letterSpacing: '0.05em' }}
            >
              SẴN SÀNG
            </span>
          ) : (
            <span 
              className="badge rounded-pill fw-bold text-uppercase px-2.5 py-1"
              style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.7rem', letterSpacing: '0.05em' }}
            >
              HẾT SÁCH
            </span>
          )}
        </div>

        {/* Title matching screenshot 1 */}
        <h6 
          className="fw-bold text-dark mb-1 text-truncate" 
          title={book.title}
          style={{ fontSize: '0.95rem', cursor: 'pointer' }}
          onClick={() => navigate(`/books/${book.id}`)}
        >
          {book.title}
        </h6>

        {/* Author matching screenshot 1 */}
        <p className="text-muted small mb-2 text-truncate" style={{ fontSize: '0.825rem' }}>
          <i className="bi bi-person me-1 text-secondary"></i>{book.author}
        </p>

        {/* Category Pills matching screenshot 1 */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {category && (
            <span 
              className="badge rounded-pill px-2.5 py-1 fw-normal"
              style={{ backgroundColor: '#FFF3E0', color: '#E65100', fontSize: '0.7rem' }}
            >
              {category.name}
            </span>
          )}
          <span 
            className="badge rounded-pill px-2.5 py-1 fw-normal"
            style={{ backgroundColor: '#E3F2FD', color: '#1565C0', fontSize: '0.7rem' }}
          >
            #Chuyên_Ngành
          </span>
        </div>
      </div>

      {/* Button 'Đọc thêm' matching screenshot 1 */}
      <div>
        <button
          className="btn btn-outline-secondary w-100 rounded-3 py-1.5 small fw-semibold text-dark border-secondary border-opacity-50"
          style={{ fontSize: '0.85rem' }}
          onClick={() => navigate(`/books/${book.id}`)}
        >
          Đọc thêm
        </button>
      </div>
    </div>
  );
}
