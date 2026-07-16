import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import memberService from '../../services/memberService';
import bookSuggestionService from '../../services/bookSuggestionService';

const statusMap = {
  pending: { label: 'Chờ duyệt', className: 'bg-warning text-dark' },
  approved: { label: 'Đã duyệt', className: 'bg-success' },
  rejected: { label: 'Từ chối', className: 'bg-danger' }
};

export default function LibrarianBookSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [members, setMembers] = useState([]);
  const [notes, setNotes] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const [suggestionData, memberData] = await Promise.all([
        bookSuggestionService.getAllSuggestions(),
        memberService.getAllMembers()
      ]);
      setSuggestions(suggestionData);
      setMembers(memberData);
    } catch {
      toast.error('Không thể tải danh sách yêu cầu sách!');
    } finally {
      setLoading(false);
    }
  };

  const memberMap = useMemo(() => {
    const map = {};
    members.forEach((member) => {
      map[member.id] = member;
    });
    return map;
  }, [members]);

  const stats = useMemo(() => ({
    total: suggestions.length,
    pending: suggestions.filter((item) => item.status === 'pending').length,
    approved: suggestions.filter((item) => item.status === 'approved').length,
    rejected: suggestions.filter((item) => item.status === 'rejected').length
  }), [suggestions]);

  const filteredSuggestions = useMemo(() => {
    if (statusFilter === 'all') return suggestions;
    return suggestions.filter((item) => item.status === statusFilter);
  }, [suggestions, statusFilter]);

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await bookSuggestionService.approveSuggestion(id, notes[id] || '');
      toast.success('Đã duyệt yêu cầu sách!');
      fetchPageData();
    } catch {
      toast.error('Không thể duyệt yêu cầu!');
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    setProcessingId(id);
    try {
      await bookSuggestionService.rejectSuggestion(id, notes[id] || '');
      toast.success('Đã từ chối yêu cầu sách!');
      fetchPageData();
    } catch {
      toast.error('Không thể từ chối yêu cầu!');
    } finally {
      setProcessingId('');
    }
  };

  const renderStatus = (status) => {
    const config = statusMap[status] || statusMap.pending;
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Quản lý yêu cầu sách</h2>
              <p className="text-muted mb-0">Xem và phản hồi các yêu cầu bổ sung sách từ độc giả.</p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchPageData}>
              Làm mới
            </button>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Tổng yêu cầu</div>
                <div className="fs-3 fw-bold">{stats.total}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Chờ duyệt</div>
                <div className="fs-3 fw-bold text-warning">{stats.pending}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Đã duyệt</div>
                <div className="fs-3 fw-bold text-success">{stats.approved}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <div className="text-muted small">Từ chối</div>
                <div className="fs-3 fw-bold text-danger">{stats.rejected}</div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Danh sách yêu cầu</h5>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ maxWidth: '180px' }}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>

            {filteredSuggestions.length === 0 ? (
              <div className="text-center text-muted py-5">
                Không có yêu cầu nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 px-3 py-3">Sách yêu cầu</th>
                      <th className="border-0 px-3 py-3">Độc giả</th>
                      <th className="border-0 px-3 py-3">Ngày gửi</th>
                      <th className="border-0 px-3 py-3">Trạng thái</th>
                      <th className="border-0 px-3 py-3">Ghi chú phản hồi</th>
                      <th className="border-0 px-3 py-3 text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuggestions.map((suggestion) => {
                      const member = memberMap[suggestion.memberId];
                      const isPending = suggestion.status === 'pending';

                      return (
                        <tr key={suggestion.id}>
                          <td className="px-3 py-3" style={{ minWidth: '280px' }}>
                            <div className="fw-semibold">{suggestion.title}</div>
                            <small className="text-muted">Tác giả: {suggestion.author}</small>
                            <div className="small text-secondary">Thể loại: {suggestion.categoryName}</div>
                            <div className="small text-secondary mt-2">{suggestion.reason}</div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="fw-semibold">{member?.name || 'N/A'}</div>
                            <small className="text-muted">{member?.email || 'N/A'}</small>
                          </td>
                          <td className="px-3 py-3 text-secondary">{suggestion.createdAt}</td>
                          <td className="px-3 py-3">
                            {renderStatus(suggestion.status)}
                            {suggestion.reviewedAt && (
                              <div className="small text-muted mt-2">Xử lý: {suggestion.reviewedAt}</div>
                            )}
                          </td>
                          <td className="px-3 py-3" style={{ minWidth: '240px' }}>
                            {isPending ? (
                              <textarea
                                className="form-control form-control-sm"
                                rows="2"
                                value={notes[suggestion.id] || ''}
                                onChange={(e) => handleNoteChange(suggestion.id, e.target.value)}
                                placeholder="Nhập phản hồi cho độc giả"
                              />
                            ) : (
                              <span className="text-secondary">
                                {suggestion.librarianNote || 'Không có ghi chú'}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-end">
                            {isPending ? (
                              <div className="d-flex justify-content-end gap-2">
                                <button
                                  className="btn btn-success btn-sm"
                                  disabled={processingId === suggestion.id}
                                  onClick={() => handleApprove(suggestion.id)}
                                >
                                  Duyệt
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  disabled={processingId === suggestion.id}
                                  onClick={() => handleReject(suggestion.id)}
                                >
                                  Từ chối
                                </button>
                              </div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
