import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import memberService from '../services/memberService';
import borrowRecordService from '../services/borrowRecordService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Sidebar from '../components/common/Sidebar';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasBorrowed, setHasBorrowed] = useState(false);
  const { user, isMember } = useAuth();

  useEffect(() => {
    if (user && isMember()) {
      memberService.getMemberByUserId(user.uId).then(member => {
        if (member) {
          borrowRecordService.getRecordsByMemberId(member.id).then(records => {
            const borrowed = records.some(r => String(r.bookId) === String(id) && (r.status === 'borrowed' || r.status === 'returned'));
            setHasBorrowed(borrowed);
          }).catch(() => {});
        }
      }).catch(() => {});
    }
  }, [user, id, isMember]);

  useEffect(() => {
    Promise.all([
      bookService.getBookById(id),
      categoryService.getAllCategories(),
      reviewService.getReviewsByBookId(id)
    ])
      .then(([b, c, r]) => { setBook(b); setCategories(c); setReviews(r); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBorrowRequest = async () => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để mượn sách!');
      navigate('/login');
      return;
    }

    const confirm = window.confirm(`Bạn có muốn gửi yêu cầu đăng ký mượn cuốn sách này không?`);
    if (!confirm) return;

    setRequesting(true);
    try {
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin độc giả liên kết với tài khoản này!');
        return;
      }

      await borrowRecordService.createBorrowRecord({
        bookId: id,
        memberId: member.id,
        dueDate: null,
        status: 'pending'
      });
      toast.success('Đăng ký mượn thành công! Vui lòng chờ thủ thư duyệt.');
      navigate('/my-borrow-records');
    } catch (e) {
      toast.error(e.message || 'Có lỗi xảy ra!');
    } finally {
      setRequesting(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !isMember()) return;
    
    if (!reviewForm.comment.trim()) {
      toast.warning('Vui lòng nhập nội dung bình luận!');
      return;
    }

    setSubmittingReview(true);
    try {
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin độc giả liên kết với tài khoản này!');
        return;
      }

      const newReview = await reviewService.createReview({
        bookId: id,
        memberId: member.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      
      // Hiển thị ngay (thêm thông tin member giả định)
      newReview.member = member;
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Gửi đánh giá thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi đánh giá!');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return <p className="alert alert-danger">Không tìm thấy sách!</p>;

  const category = categories.find(c => String(c.id) === String(book.categoryId));
  const isAvailable = book.availableCopies > 0;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <div className="card shadow-sm p-4">
          <div className="row">
            <div className="col-md-3 mb-3 mb-md-0">
              <img src={
                book.coverImage 
                  ? (book.coverImage.startsWith('http') || book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`) 
                  : 'https://via.placeholder.com/200x280?text=No+Image'
              }
                alt={book.title} className="img-fluid rounded shadow-sm" 
                style={{ maxHeight: '300px', objectFit: 'contain', backgroundColor: '#f8f9fa', width: '100%' }} />
            </div>
            <div className="col-md-9">
              <h2>{book.title}</h2>
              <p><strong>Tác giả:</strong> {book.author}</p>
              <p><strong>Thể loại:</strong> {category?.name || '—'}</p>
              <p>
                <strong>Đánh giá: </strong> 
                <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>
                  {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                </span>
                <span className="ms-2">({avgRating}/5 từ {reviews.length} đánh giá)</span>
              </p>
              <p>
                <strong>Tình trạng: </strong>
                <span className={isAvailable ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  {book.availableCopies}/{book.totalCopies}
                </span>
              </p>
              
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-secondary" onClick={() => navigate('/books')}>← Quay lại</button>
                {isMember() && (
                  <button 
                    className="btn btn-primary px-4 fw-semibold" 
                    onClick={handleBorrowRequest}
                    disabled={requesting || !isAvailable}
                  >
                    {requesting ? 'Đang gửi yêu cầu...' : 'Đăng ký mượn sách'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Khung Bình luận & Đánh giá */}
        <div className="card shadow-sm p-4 mt-4">
          <h4 className="mb-4">Đánh giá & Bình luận</h4>
          
          {isMember() ? (
            hasBorrowed ? (
              <form onSubmit={handleSubmitReview} className="mb-5 border-bottom pb-4">
              <div className="d-flex align-items-center mb-3">
                <label className="form-label fw-bold me-3 mb-0">Chấm điểm:</label>
                <div style={{ fontSize: '1.5rem', cursor: 'pointer', userSelect: 'none' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star}
                      style={{ color: star <= reviewForm.rating ? '#ffc107' : '#e4e5e9' }}
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ms-3 text-muted">
                  {reviewForm.rating === 5 && 'Tuyệt vời'}
                  {reviewForm.rating === 4 && 'Rất hay'}
                  {reviewForm.rating === 3 && 'Bình thường'}
                  {reviewForm.rating === 2 && 'Tạm được'}
                  {reviewForm.rating === 1 && 'Tệ'}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Viết bình luận:</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Chia sẻ cảm nghĩ của bạn về cuốn sách này..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
              </button>
            </form>
            ) : (
              <div className="alert alert-warning">
                Bạn chỉ có thể đánh giá sau khi đã được mượn cuốn sách này!
              </div>
            )
          ) : (
            <div className="alert alert-info">
              Vui lòng <button className="btn btn-link p-0 text-decoration-none" onClick={() => navigate('/login')}>đăng nhập</button> để gửi đánh giá.
            </div>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="text-muted text-center py-3">Chưa có đánh giá nào cho cuốn sách này. Hãy là người đầu tiên!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-item mb-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">{review.member?.fullname || 'Thành viên ẩn danh'}</span>
                    <small className="text-muted">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</small>
                  </div>
                  <div style={{ color: '#ffc107', fontSize: '1.1rem' }} className="mb-2">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
