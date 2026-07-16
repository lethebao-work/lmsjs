import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import memberService from '../../services/memberService';
import categoryService from '../../services/categoryService';
import bookSuggestionService from '../../services/bookSuggestionService';

const initialForm = {
  title: '',
  author: '',
  categoryName: '',
  reason: ''
};

const statusMap = {
  pending: { label: 'Chờ duyệt', className: 'bg-warning text-dark' },
  approved: { label: 'Đã duyệt', className: 'bg-success' },
  rejected: { label: 'Từ chối', className: 'bg-danger' }
};

export default function BookSuggestionPage() {
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPageData = useCallback(async () => {
    if (!user?.uId) return;
    setLoading(true);
    try {
      const currentMember = await memberService.getMemberByUserId(user.uId);
      if (!currentMember) {
        toast.error('Không tìm thấy thông tin độc giả!');
        return;
      }

      const [categoryData, suggestionData] = await Promise.all([
        categoryService.getAllCategories(),
        bookSuggestionService.getSuggestionsByMemberId(currentMember.id)
      ]);

      setMember(currentMember);
      setCategories(categoryData);
      setSuggestions(suggestionData);
    } catch {
      toast.error('Không thể tải danh sách yêu cầu thêm sách!');
    } finally {
      setLoading(false);
    }
  }, [user?.uId]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Vui lòng nhập tên sách.';
    if (!form.author.trim()) return 'Vui lòng nhập tác giả.';
    if (!form.categoryName.trim()) return 'Vui lòng nhập thể loại mong muốn.';
    if (form.reason.trim().length < 10) return 'Lý do yêu cầu cần ít nhất 10 ký tự.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      await bookSuggestionService.createSuggestion({
        memberId: member.id,
        title: form.title.trim(),
        author: form.author.trim(),
        categoryName: form.categoryName.trim(),
        reason: form.reason.trim()
      });
      toast.success('Đã gửi yêu cầu thêm sách!');
      setForm(initialForm);
      fetchPageData();
    } catch {
      toast.error('Không thể gửi yêu cầu. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
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
              <h2 className="fw-bold text-dark mb-1">Yêu cầu thêm sách</h2>
              <p className="text-muted mb-0">Gửi yêu cầu bổ sung những đầu sách bạn muốn thư viện nhập thêm.</p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchPageData}>
              Làm mới
            </button>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Gửi yêu cầu mới</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tên sách</label>
                    <input
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Ví dụ: Atomic Habits"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tác giả</label>
                    <input
                      className="form-control"
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="Ví dụ: James Clear"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Thể loại mong muốn</label>
                    <input
                      className="form-control"
                      name="categoryName"
                      value={form.categoryName}
                      onChange={handleChange}
                      list="suggestion-category-options"
                      placeholder="Chọn hoặc nhập thể loại"
                    />
                    <datalist id="suggestion-category-options">
                      {categories.map((category) => (
                        <option key={category.id} value={category.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Lý do yêu cầu</label>
                    <textarea
                      className="form-control"
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Vì sao thư viện nên nhập cuốn sách này?"
                    />
                  </div>

                  <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Yêu cầu của tôi</h5>
                {suggestions.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    Bạn chưa gửi yêu cầu thêm sách nào.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 px-3 py-3">Sách yêu cầu</th>
                          <th className="border-0 px-3 py-3">Thể loại</th>
                          <th className="border-0 px-3 py-3">Ngày gửi</th>
                          <th className="border-0 px-3 py-3">Trạng thái</th>
                          <th className="border-0 px-3 py-3">Phản hồi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suggestions.map((suggestion) => (
                          <tr key={suggestion.id}>
                            <td className="px-3 py-3">
                              <div className="fw-semibold">{suggestion.title}</div>
                              <small className="text-muted">Tác giả: {suggestion.author}</small>
                              <div className="small text-secondary mt-1">{suggestion.reason}</div>
                            </td>
                            <td className="px-3 py-3">{suggestion.categoryName}</td>
                            <td className="px-3 py-3 text-secondary">{suggestion.createdAt}</td>
                            <td className="px-3 py-3">{renderStatus(suggestion.status)}</td>
                            <td className="px-3 py-3 text-secondary">
                              {suggestion.librarianNote || 'Chưa có phản hồi'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
