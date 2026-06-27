import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="card h-100 shadow-sm book-card" style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/books/${book.id}`)}>
      {!isAvailable && (
        <span className="badge bg-danger position-absolute top-0 end-0 m-2">Hết sách</span>
      )}
      <img
        src={book.coverImage || 'https://via.placeholder.com/150x200?text=No+Image'}
        className="card-img-top"
        alt={book.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h6 className="card-title fw-bold">{book.title}</h6>
        <p className="card-text text-muted small">{book.author}</p>
        <span className={`badge ${isAvailable ? 'bg-success' : 'bg-secondary'}`}>
          Còn: {book.availableCopies}/{book.totalCopies}
        </span>
      </div>
    </div>
  );
}
