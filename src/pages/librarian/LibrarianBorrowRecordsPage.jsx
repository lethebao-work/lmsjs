import { useMemo, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import borrowRecordService from '../../services/borrowRecordService';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';
import BorrowRecordForm from '../../components/borrowRecord/BorrowRecordForm';
import BorrowRecordTable from '../../components/borrowRecord/BorrowRecordTable';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function LibrarianBorrowRecordsPage() {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [onlyFined, setOnlyFined] = useState(false);

  const fetchAll = async () => {
    const [r, b, m] = await Promise.all([
      borrowRecordService.getAllRecords(),
      bookService.getAllBooks(),
      memberService.getAllMembers()
    ]);
    setRecords(r); setBooks(b); setMembers(m);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (data) => {
    try { await borrowRecordService.createBorrowRecord(data); toast.success('Tạo phiếu mượn thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  const handleApprove = async (id) => {
    try { await borrowRecordService.approveBorrowRecord(id); toast.success('Duyệt mượn sách thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu mượn này?')) return;
    try { 
      await borrowRecordService.rejectBorrowRecord(id); 
      toast.success('Đã từ chối yêu cầu mượn sách!'); 
      fetchAll(); 
    } catch (e) { 
      toast.error(e.message || 'Có lỗi xảy ra!'); 
    }
  };

  const handleReturn = async (id, options) => {
    try { await borrowRecordService.returnBook(id, options); toast.success('Xử lý trả sách thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  const handleRenew = async (id) => {
    try { await borrowRecordService.renewBorrowRecord(id); toast.success('Gia hạn phiếu mượn thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Không thể gia hạn phiếu mượn!'); }
  };

  const isOverdue = (record) => {
    if (record.status !== 'borrowed' || !record.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(record.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const filteredRecords = useMemo(() => {
    const keyword = normalizeText(searchTerm.trim());

    return records.filter((record) => {
      const book = books.find(item => String(item.id) === String(record.bookId));
      const member = members.find(item => String(item.id) === String(record.memberId));
      const haystack = normalizeText([
        record.id,
        record.status,
        record.borrowDate,
        record.dueDate,
        record.returnDate,
        book?.title,
        book?.bookCode,
        book?.author,
        member?.name,
        member?.email,
        member?.studentId,
        member?.department
      ].join(' '));

      const matchesSearch = !keyword || haystack.includes(keyword);
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesOverdue = !onlyOverdue || isOverdue(record);
      const matchesFined = !onlyFined || Number(record.fineAmount || 0) > 0;

      return matchesSearch && matchesStatus && matchesOverdue && matchesFined;
    });
  }, [records, books, members, searchTerm, statusFilter, onlyOverdue, onlyFined]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <h2 className="lms-page-title mb-3">Quản lý mượn/trả sách</h2>
        <div className="quick-borrow-panel">
          <div className="quick-borrow-header">
            <div>
              <h5 className="quick-borrow-title">
                <span className="quick-borrow-title-icon"><i className="bi bi-lightning-charge-fill"></i></span>
                Tạo phiếu mượn nhanh
              </h5>
              <p className="quick-borrow-subtitle">Dùng cho mượn trực tiếp tại quầy, hệ thống sẽ kiểm tra sách còn và trạng thái độc giả.</p>
            </div>
            <span className="badge text-white px-3 py-1.5" style={{ backgroundColor: '#8B4000' }}>Quầy lưu thông</span>
          </div>
          <BorrowRecordForm onSubmit={handleCreate} books={books} members={members} />
        </div>
        <div className="lms-panel">
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
            <div>
              <h5 className="fw-bold mb-1">Danh sách phiếu mượn</h5>
              <p className="text-muted small mb-0">Tìm nhanh theo sách, độc giả, mã phiếu và lọc theo trạng thái xử lý.</p>
            </div>
            <span className="badge bg-light text-secondary border">{filteredRecords.length} / {records.length} phiếu</span>
          </div>

          <div className="lms-toolbar">
            <div className="row g-3">
              <div className="col-lg-5">
                <label className="form-label small fw-semibold text-secondary">Tìm kiếm phiếu</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                  <input
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tên sách, độc giả, email, mã phiếu..."
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <label className="form-label small fw-semibold text-secondary">Trạng thái</label>
                <div className="borrow-filter-radios">
                  {[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'pending', label: 'Chờ duyệt' },
                    { value: 'borrowed', label: 'Đang mượn' },
                    { value: 'returned', label: 'Đã trả' }
                  ].map((option) => (
                    <label key={option.value} className="borrow-filter-radio">
                      <input
                        type="radio"
                        name="borrowStatusFilter"
                        value={option.value}
                        checked={statusFilter === option.value}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-lg-3">
                <label className="form-label small fw-semibold text-secondary">Lọc nhanh</label>
                <div className="d-flex flex-column gap-2">
                  <label className="form-check mb-0">
                    <input className="form-check-input" type="checkbox" checked={onlyOverdue} onChange={(e) => setOnlyOverdue(e.target.checked)} />
                    <span className="form-check-label">Chỉ phiếu quá hạn</span>
                  </label>
                  <label className="form-check mb-0">
                    <input className="form-check-input" type="checkbox" checked={onlyFined} onChange={(e) => setOnlyFined(e.target.checked)} />
                    <span className="form-check-label">Chỉ phiếu có phạt</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
              <div className="lms-result-count">
                Hiển thị {filteredRecords.length} / {records.length} phiếu mượn
              </div>
              <button
                className="btn btn-light border btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setOnlyOverdue(false);
                  setOnlyFined(false);
                }}
              >
                <i className="bi bi-x-lg me-1"></i> Xóa bộ lọc
              </button>
            </div>
          </div>

          <BorrowRecordTable 
            records={filteredRecords} 
            books={books} 
            members={members} 
            onApprove={handleApprove} 
            onReturn={handleReturn} 
            onReject={handleReject}
            onRenew={handleRenew}
          />
        </div>
      </div>
    </div>
  );
}
