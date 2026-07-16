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
