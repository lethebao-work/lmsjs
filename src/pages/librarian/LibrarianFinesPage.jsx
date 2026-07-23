import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import fineService from '../../services/fineService';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function LibrarianFinesPage() {
  const [fines, setFines] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('unpaid');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [fineData, bookData, memberData] = await Promise.all([
        fineService.getAllFines(),
        bookService.getAllBooks(),
        memberService.getAllMembers()
      ]);
      setFines(fineData);
      setBooks(bookData);
      setMembers(memberData);
    } catch {
      toast.error('Không thể tải danh sách khoản phạt!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getMember = useCallback((id) => members.find(member => String(member.id) === String(id)), [members]);
  const getBook = useCallback((id) => books.find(book => String(book.id) === String(id)), [books]);

  const filteredFines = useMemo(() => {
    const keyword = normalizeText(searchTerm.trim());

    return fines.filter((fine) => {
      const member = getMember(fine.memberId);
      const book = getBook(fine.bookId);
      const haystack = normalizeText([
        fine.id,
        fine.type,
        fine.note,
        member?.name,
        member?.email,
        member?.studentId,
        member?.department,
        book?.title,
        book?.bookCode
      ].join(' '));

      const matchesSearch = !keyword || haystack.includes(keyword);
      const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
      const matchesType = typeFilter === 'all' || fine.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [fines, getMember, getBook, searchTerm, statusFilter, typeFilter]);

  const totals = useMemo(() => {
    const unpaid = fines.filter(fine => fine.status === 'unpaid');
    return {
      unpaidCount: unpaid.length,
      unpaidAmount: unpaid.reduce((sum, fine) => sum + Number(fine.amount || 0), 0),
      paidCount: fines.filter(fine => fine.status === 'paid').length
    };
  }, [fines]);

  const handlePayFine = async (id) => {
    try {
      await fineService.payFine(id);
      toast.success('Đã ghi nhận thanh toán phí phạt!');
      fetchAll();
    } catch (e) {
      toast.error(e.message || 'Không thể thanh toán phí phạt!');
    }
  };

  const typeLabel = (type) => {
    if (type === 'damaged') return 'Sách hỏng';
    if (type === 'lost') return 'Mất sách';
    return 'Quá hạn';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <div className="lms-page-header">
          <div>
            <h2 className="lms-page-title">Khoản phạt</h2>
            <p className="lms-page-subtitle">Theo dõi khoản phạt quá hạn, sách hỏng, sách mất và mở lại quyền mượn sau khi nộp phạt.</p>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="lms-kpi-card">
              <span className="lms-kpi-label">Chưa thanh toán</span>
              <div className="lms-kpi-value text-danger">{totals.unpaidCount}</div>
              <span className="lms-kpi-note">Khoản cần xử lý</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="lms-kpi-card">
              <span className="lms-kpi-label">Tổng tiền chưa nộp</span>
              <div className="lms-kpi-value text-danger">{totals.unpaidAmount.toLocaleString('vi-VN')}đ</div>
              <span className="lms-kpi-note">Sẽ khóa quyền mượn đến khi thanh toán</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="lms-kpi-card">
              <span className="lms-kpi-label">Đã thanh toán</span>
              <div className="lms-kpi-value">{totals.paidCount}</div>
              <span className="lms-kpi-note">Khoản đã ghi nhận</span>
            </div>
          </div>
        </div>

        <div className="lms-toolbar">
          <div className="row g-3 align-items-end">
            <div className="col-lg-5">
              <label className="form-label small fw-semibold text-secondary">Tìm kiếm</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tên, email, mã sách, lý do..."
                />
              </div>
            </div>
            <div className="col-lg-3">
              <label className="form-label small fw-semibold text-secondary">Trạng thái</label>
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
            <div className="col-lg-3">
              <label className="form-label small fw-semibold text-secondary">Loại phạt</label>
              <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="overdue">Quá hạn</option>
                <option value="damaged">Sách hỏng</option>
                <option value="lost">Mất sách</option>
              </select>
            </div>
            <div className="col-lg-1 d-grid">
              <button
                className="btn btn-light border"
                title="Xóa bộ lọc"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('unpaid');
                  setTypeFilter('all');
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
                <th className="py-3 px-4">Thành viên</th>
                <th className="py-3 px-4">Sách</th>
                <th className="py-3 px-4">Lý do</th>
                <th className="py-3 px-4">Số tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-5">Không có khoản phạt phù hợp.</td>
                </tr>
              ) : filteredFines.map((fine) => {
                const member = getMember(fine.memberId);
                const book = getBook(fine.bookId);

                return (
                  <tr key={fine.id}>
                    <td className="py-3 px-4">
                      <div className="fw-semibold">{member?.name || fine.memberId}</div>
                      <small className="text-muted">{member?.email || '—'}</small>
                    </td>
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
                    <td className="py-3 px-4">
                      <div>{fine.createdAt || '—'}</div>
                      {fine.paidAt && <small className="text-muted">Nộp: {fine.paidAt}</small>}
                    </td>
                    <td className="py-3 px-4 text-end">
                      {fine.status === 'unpaid' ? (
                        <button className="btn btn-success btn-sm fw-semibold" onClick={() => handlePayFine(fine.id)}>
                          Đã nộp phạt
                        </button>
                      ) : (
                        <span className="text-muted small">Đã xử lý</span>
                      )}
                    </td>
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
