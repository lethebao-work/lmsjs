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
  const [borrowBlocked, setBorrowBlocked] = useState(null);
  const { user, isMember } = useAuth();

  useEffect(() => {
    if (user && isMember()) {
      memberService.getMemberByUserId(user.uId).then(member => {
        if (member) {
          if (member.borrowingStatus === 'blocked') {
            setBorrowBlocked({
              amount: member.unpaidFineAmount || 0,
              reason: member.blockedReason || 'Còn phí phạt chưa thanh toán'
            });
          } else {
            setBorrowBlocked(null);
          }
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

    const confirm = window.confirm(`Bạn có muốn gửi yêu cầu đăng ký mượn cuốn sách "${book.title}" không?`);
    if (!confirm) return;

    setRequesting(true);
    try {
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin thành viên liên kết với tài khoản này!');
        return;
      }
      if (member.borrowingStatus === 'blocked') {
        toast.error(`Bạn còn ${Number(member.unpaidFineAmount || 0).toLocaleString('vi-VN')}đ phí phạt chưa thanh toán nên chưa thể mượn sách mới.`);
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
        toast.error('Không tìm thấy thông tin độc giả!');
        return;
      }

      const newReview = await reviewService.createReview({
        bookId: id,
        memberId: member.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      
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
  if (!book) return <div className="container mt-5"><p className="alert alert-danger">Không tìm thấy sách!</p></div>;

  const category = categories.find(c => String(c.id) === String(book.categoryId));
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="container-fluid px-4 py-5" style={{ maxWidth: '1200px' }}>
      {/* Floating Single Book Detail Card matching screenshot 2 */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
        <div className="row g-4 align-items-stretch">
          {/* Left Column: Cover Frame */}
          <div className="col-md-4 text-center d-flex align-items-center justify-content-center">
            <div 
              className="p-3 bg-light rounded-4 border w-100 d-flex align-items-center justify-content-center"
              style={{ minHeight: '360px', backgroundColor: '#FAF9F6' }}
            >
              <img 
                src={
                  book.coverImage 
                    ? (book.coverImage.startsWith('http') || book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`) 
                    : 'https://via.placeholder.com/260x360?text=No+Cover'
                }
                alt={book.title} 
                className="img-fluid rounded-3 shadow-sm"
                style={{ maxHeight: '340px', objectFit: 'contain' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/260x360?text=No+Cover'; }}
              />
            </div>
          </div>

          {/* Right Column: Book Metadata Grid matching screenshot 2 */}
          <div className="col-md-8 d-flex flex-column justify-content-between">
            <div>
              {/* Top status bar & document code */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                {isAvailable ? (
                  <span 
                    className="badge rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1"
                    style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.85rem' }}
                  >
                    <i className="bi bi-check-circle me-1"></i> Còn sách ({book.availableCopies}/{book.totalCopies})
                  </span>
                ) : (
                  <span 
                    className="badge rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1"
                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.85rem' }}
                  >
                    <i className="bi bi-x-circle me-1"></i> Tạm hết sách (0/{book.totalCopies})
                  </span>
                )}
                <span className="text-muted small fw-semibold">
                  Mã tài liệu: <strong>{book.bookCode || book.id}</strong>
                </span>
              </div>

              {/* Title */}
              <h1 className="fw-extrabold text-dark mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>
                {book.title}
              </h1>

              {/* Author in brown text matching screenshot 2 */}
              <h6 className="mb-3 d-flex align-items-center gap-2" style={{ color: '#8B4000', fontSize: '1.1rem' }}>
                <i className="bi bi-journal-text"></i> Tác giả: <strong className="fw-bold">{book.author}</strong>
              </h6>

              {/* Category Pills matching screenshot 2 */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {category && (
                  <span className="badge rounded-pill px-3 py-1.5 font-semibold text-white" style={{ backgroundColor: '#F97316' }}>
                    <i className="bi bi-folder me-1"></i>{category.name}
                  </span>
                )}
                <span className="badge rounded-pill px-3 py-1.5 font-semibold text-white" style={{ backgroundColor: '#3B82F6' }}>
                  #Chuyên_Ngành
                </span>
              </div>

              <hr className="my-3 text-muted opacity-25" />

              {/* Metadata 2x2 Grid matching screenshot 2 */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3">
                  <span className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>
                    NHÀ XUẤT BẢN
                  </span>
                  <span className="fw-semibold text-dark" style={{ fontSize: '0.925rem' }}>Pearson Academic</span>
                </div>
                <div className="col-6 col-sm-3">
                  <span className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>
                    NĂM XUẤT BẢN
                  </span>
                  <span className="fw-semibold text-dark" style={{ fontSize: '0.925rem' }}>2023</span>
                </div>
                <div className="col-6 col-sm-3">
                  <span className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>
                    MÃ ISBN
                  </span>
                  <span className="fw-semibold text-dark" style={{ fontSize: '0.925rem' }}>9781492079361</span>
                </div>
                <div className="col-6 col-sm-3">
                  <span className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.725rem', letterSpacing: '0.05em' }}>
                    SỐ LƯỢNG KHẢ DỤNG
                  </span>
                  <span className="fw-semibold text-dark" style={{ fontSize: '0.925rem' }}>{book.availableCopies} / {book.totalCopies}</span>
                </div>
              </div>

              {/* Book description if available */}
              {book.description && (
                <div className="p-3 bg-light rounded-3 border mb-4">
                  <span className="fw-bold text-secondary d-block mb-1 small">Mô tả tóm tắt:</span>
                  <p className="mb-0 text-dark small leading-relaxed">{book.description}</p>
                </div>
              )}
            </div>

            {/* Bottom Action Bar matching screenshot 2 */}
            <div className="pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="flex-grow-1">
                {isMember() ? (
                  <>
                    {borrowBlocked && (
                      <div className="alert alert-danger py-2 small mb-3">
                        Tài khoản đang tạm khóa quyền mượn do còn {Number(borrowBlocked.amount || 0).toLocaleString('vi-VN')}đ phí phạt chưa thanh toán.
                      </div>
                    )}
                    <button
                      className="btn btn-brown px-4 py-2.5 font-bold text-white shadow-sm d-flex align-items-center gap-2"
                      onClick={handleBorrowRequest}
                      disabled={requesting || !isAvailable || !!borrowBlocked}
                      style={{ backgroundColor: '#8B4000' }}
                    >
                      <i className="bi bi-journal-check fs-5"></i>
                      {requesting ? 'Đang gửi yêu cầu...' : (borrowBlocked ? 'Tạm khóa mượn sách' : (isAvailable ? 'Đăng ký mượn sách ngay' : 'Tạm hết sách'))}
                    </button>
                  </>
                ) : (
                  <div className="p-2.5 px-3 bg-light rounded-3 border small text-muted d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle-fill text-secondary fs-6"></i>
                    <span>Tính năng đặt mượn sách trực tuyến chỉ dành cho Độc giả.</span>
                  </div>
                )}
              </div>

              <button
                className="btn btn-light border px-4 py-2 font-semibold text-dark"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-chat-square-quote" style={{ color: '#8B4000' }}></i> Đánh giá từ độc giả
        </h4>

        {isMember() && hasBorrowed && (
          <form onSubmit={handleSubmitReview} className="mb-4 p-3 bg-light rounded-3 border">
            <h6 className="fw-bold mb-3">Gửi đánh giá của bạn</h6>
            <div className="d-flex align-items-center mb-3">
              <label className="form-label me-3 mb-0 fw-semibold">Chấm điểm:</label>
              <div style={{ fontSize: '1.5rem', cursor: 'pointer', userSelect: 'none' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star}
                    style={{ color: star <= reviewForm.rating ? '#8B4000' : '#cbd5e1' }}
                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                    className="me-1"
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea 
              className="form-control mb-3" 
              rows="3" 
              placeholder="Nhận xét cuốn sách..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
            ></textarea>
            <button type="submit" className="btn btn-brown px-4 py-2 font-bold text-white" disabled={submittingReview} style={{ backgroundColor: '#8B4000' }}>
              {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-muted text-center py-3">Chưa có đánh giá nào cho cuốn sách này.</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="p-3 bg-light rounded-3 border mb-2">
              <div className="d-flex justify-content-between mb-1">
                <strong>{r.member?.name || 'Độc giả'}</strong>
                <span style={{ color: '#8B4000' }}>{'★'.repeat(r.rating)}</span>
              </div>
              <p className="mb-0 text-muted small">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
