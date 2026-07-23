import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import memberService from '../../services/memberService';
import fineService from '../../services/fineService';
import bookService from '../../services/bookService';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function MyFinesPage() {
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [fines, setFines] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uId) {
        setLoading(false);
        return;
      }

      try {
        const memberData = await memberService.getMemberByUserId(user.uId);
        if (!memberData) {
          setError('Không tìm thấy hồ sơ thành viên liên kết với tài khoản này.');
          return;
        }

        const [fineData, bookData] = await Promise.all([
          fineService.getFinesByMemberId(memberData.id),
          bookService.getAllBooks()
        ]);

        setMember(memberData);
        setFines(fineData);
        setBooks(bookData);
      } catch {
        setError('Không thể tải danh sách khoản phạt của bạn.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uId]);

  const getBook = useCallback((id) => books.find(book => String(book.id) === String(id)), [books]);

  const filteredFines = useMemo(() => {
    const keyword = normalizeText(searchTerm.trim());

    return fines.filter((fine) => {
      const book = getBook(fine.bookId);
      const haystack = normalizeText([
        fine.id,
        fine.type,
        fine.note,
        fine.status,
        book?.title,
        book?.bookCode
      ].join(' '));

      const matchesSearch = !keyword || haystack.includes(keyword);
      const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [fines, getBook, searchTerm, statusFilter]);

  const totals = useMemo(() => {
    const unpaid = fines.filter(fine => fine.status === 'unpaid');
    return {
      unpaidCount: unpaid.length,
      unpaidAmount: unpaid.reduce((sum, fine) => sum + Number(fine.amount || 0), 0),
      paidCount: fines.filter(fine => fine.status === 'paid').length
    };
  }, [fines]);

  const typeLabel = (type) => {
    if (type === 'damaged') return 'Sách hỏng';
    if (type === 'lost') return 'Mất sách';
    return 'Quá hạn';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <div className="lms-page-header">
          <div>
            <h2 className="lms-page-title">Khoản phạt của tôi</h2>
            <p className="lms-page-subtitle">
              Theo dõi các khoản phạt thư viện. Vui lòng nộp phạt tại quầy để thủ thư xác nhận và mở lại quyền mượn.
            </p>
          </div>
        </div>

        {member?.borrowingStatus === 'blocked' && (
          <div className="alert alert-danger d-flex align-items-start gap-2">
            <i className="bi bi-exclamation-triangle-fill mt-1"></i>
            <div>
              <div className="fw-bold">Tài khoản đang tạm khóa quyền mượn sách</div>
              <div className="small">
                Bạn còn {Number(member.unpaidFineAmount || totals.unpaidAmount).toLocaleString('vi-VN')}đ phí phạt chưa thanh toán. Bạn vẫn đăng nhập và tra cứu bình thường.
              </div>
            </div>
          </div>
        )}

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="lms-kpi-card">
              <span className="lms-kpi-label">Chưa thanh toán</span>
              <div className="lms-kpi-value text-danger">{totals.unpaidCount}</div>
              <span className="lms-kpi-note">Khoản cần nộp tại quầy</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="lms-kpi-card">
              <span className="lms-kpi-label">Tổng tiền chưa nộp</span>
              <div className="lms-kpi-value text-danger">{totals.unpaidAmount.toLocaleString('vi-VN')}đ</div>
              <span className="lms-kpi-note">Quyền mượn bị khóa nếu còn nợ phạt</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="lms-kpi-card">
              <span className="lms-kpi-label">Đã thanh toán</span>
              <div className="lms-kpi-value">{totals.paidCount}</div>
              <span className="lms-kpi-note">Khoản đã được thủ thư xác nhận</span>
            </div>
          </div>
        </div>

        <div className="lms-toolbar">
          <div className="row g-3 align-items-end">
            <div className="col-md-8">
              <label className="form-label small fw-semibold text-secondary">Tìm kiếm</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tên sách, mã sách, lý do..."
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-secondary">Trạng thái</label>
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
              </select>
            </div>
            <div className="col-md-1 d-grid">
              <button
                className="btn btn-light border"
                title="Xóa bộ lọc"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div className="lms-result-count mt-3">
            Hiển thị {filteredFines.length} / {fines.length} khoản phạt
          </div>
        </div>

        <div className="table-responsive shadow-sm" style={{ borderRadius: '8px', overflowX: 'auto', border: '1px solid #e5e5e5' }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4">Sách</th>
                <th className="py-3 px-4">Lý do</th>
                <th className="py-3 px-4">Số tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4">Ngày nộp</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5">Bạn không có khoản phạt phù hợp.</td>
                </tr>
              ) : filteredFines.map((fine) => {
                const book = getBook(fine.bookId);

                return (
                  <tr key={fine.id}>
                    <td className="py-3 px-4">
                      <div className="fw-semibold">{book?.title || fine.bookId}</div>
                      <small className="text-muted">{book?.bookCode || fine.bookId}</small>
                    </td>
                    <td className="py-3 px-4">
                      <div className="fw-semibold">{typeLabel(fine.type)}</div>
                      <small className="text-muted">{fine.note || '—'}</small>
                    </td>
                    <td className="py-3 px-4 fw-bold text-danger">{Number(fine.amount || 0).toLocaleString('vi-VN')}đ</td>
                    <td className="py-3 px-4">
                      {fine.status === 'paid' ? (
                        <span className="badge bg-success">Đã thanh toán</span>
                      ) : (
                        <span className="badge bg-danger">Chưa thanh toán</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{fine.createdAt || '—'}</td>
                    <td className="py-3 px-4">{fine.paidAt || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
