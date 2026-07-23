import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';
import borrowRecordService from '../../services/borrowRecordService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function LibrarianDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeBorrows: 0,
    pendingRequests: 0
  });
  const [pendingRecords, setPendingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [books, members, records] = await Promise.all([
        bookService.getAllBooks(),
        memberService.getAllMembers(),
        borrowRecordService.getAllRecords()
      ]);

      const pending = records.filter(r => r.status === 'pending');
      const active = records.filter(r => r.status === 'borrowed');

      const bookMap = {};
      books.forEach(b => { bookMap[b.id] = b.title; });

      const memberMap = {};
      members.forEach(m => { memberMap[m.id] = m; });

      setStats({
        totalBooks: books.length,
        totalMembers: members.length,
        totalStudents: members.filter(m => m.memberType === 'student').length,
        totalTeachers: members.filter(m => m.memberType === 'teacher').length,
        activeBorrows: active.length,
        pendingRequests: pending.length
      });

      setPendingRecords(
        pending.map(r => ({
          ...r,
          bookTitle: bookMap[r.bookId] || 'Không xác định',
          memberName: memberMap[r.memberId]?.name || 'Không xác định',
          memberType: memberMap[r.memberId]?.memberType || 'student',
          memberDetail: memberMap[r.memberId]?.memberType === 'teacher' 
            ? (memberMap[r.memberId]?.department || 'Giảng viên') 
            : `MSSV: ${memberMap[r.memberId]?.studentId || 'N/A'}`
        }))
      );
    } catch (e) {
      toast.error('Lỗi khi tải dữ liệu thống kê!');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await borrowRecordService.approveBorrowRecord(id);
      toast.success('Duyệt mượn sách thành công!');
      fetchData();
    } catch (e) {
      toast.error(e.message || 'Có lỗi xảy ra!');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu mượn này?')) return;
    try {
      await borrowRecordService.rejectBorrowRecord(id);
      toast.success('Đã từ chối yêu cầu mượn.');
      fetchData();
    } catch (e) {
      toast.error(e.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <div className="lms-dashboard-container">
          {/* Header Command Center */}
          <div className="lms-page-header">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h2 className="lms-page-title">Trung Tâm Quản Trị Thư Viện</h2>
                <span className="badge text-white px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#8B4000' }}>
                  <i className="bi bi-shield-check me-1"></i> Phân hệ Thủ thư
                </span>
              </div>
              <p className="lms-page-subtitle">Tổng quan hệ thống, duyệt mượn trả và quản lý kho tài liệu số</p>
            </div>
            <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={fetchData}>
              <i className="bi bi-arrow-clockwise me-1"></i> Tải lại dữ liệu
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Clean Minimalist Analytics 4-Card Grid */}
              <div className="row g-3 mb-3">
                {/* Card 1: Total Books */}
                <div className="col-sm-6 col-xl-3">
                  <div className="lms-kpi-card">
                    <div className="lms-kpi-content">
                      <div>
                        <span className="lms-kpi-label">
                          TỔNG SỐ SÁCH
                        </span>
                        <h2 className="lms-kpi-value">{stats.totalBooks}</h2>
                        <span className="lms-kpi-note">Đầu sách trong kho</span>
                      </div>
                      <div 
                        className="lms-kpi-icon" 
                        style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}
                      >
                        <i className="bi bi-bookshelf"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Total Members */}
                <div className="col-sm-6 col-xl-3">
                  <div className="lms-kpi-card">
                    <div className="lms-kpi-content">
                      <div>
                        <span className="lms-kpi-label">
                          THÀNH VIÊN HỆ THỐNG
                        </span>
                        <h2 className="lms-kpi-value">{stats.totalMembers}</h2>
                        <span className="lms-kpi-note">{stats.totalStudents} SV · {stats.totalTeachers} GV</span>
                      </div>
                      <div 
                        className="lms-kpi-icon" 
                        style={{ backgroundColor: '#ECFDF5', color: '#059669' }}
                      >
                        <i className="bi bi-people"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Active Borrows */}
                <div className="col-sm-6 col-xl-3">
                  <div className="lms-kpi-card">
                    <div className="lms-kpi-content">
                      <div>
                        <span className="lms-kpi-label">
                          ĐANG CHO MƯỢN
                        </span>
                        <h2 className="lms-kpi-value">{stats.activeBorrows}</h2>
                        <span className="lms-kpi-note">Cuốn lưu hành</span>
                      </div>
                      <div 
                        className="lms-kpi-icon" 
                        style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                      >
                        <i className="bi bi-journal-arrow-up"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Pending Requests */}
                <div className="col-sm-6 col-xl-3">
                  <div className="lms-kpi-card">
                    <div className="lms-kpi-content">
                      <div>
                        <span className="lms-kpi-label">
                          YÊU CẦU CHỜ DUYỆT
                        </span>
                        <h2 className="lms-kpi-value text-danger">{stats.pendingRequests}</h2>
                        <span className="lms-kpi-note">Cần xử lý gấp</span>
                      </div>
                      <div 
                        className="lms-kpi-icon" 
                        style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                      >
                        <i className="bi bi-bell-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Approval Table */}
              <div className="lms-panel">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-inbox-fill text-danger"></i> Yêu Cầu Đăng Ký Mượn Sách Chờ Phê Duyệt
                  </h5>
                  {stats.pendingRequests > 0 && (
                    <span className="badge bg-danger rounded-pill px-3 py-1.5">
                      {stats.pendingRequests} đơn mới
                    </span>
                  )}
                </div>

                {pendingRecords.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-check2-circle display-4 d-block mb-3 text-success"></i>
                    Hiện tại không có yêu cầu mượn sách nào cần phê duyệt. Kho sách đang hoàn toàn ổn định!
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-custom align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Độc giả & Đối tượng</th>
                          <th>Mã / Khoa</th>
                          <th>Sách Yêu Cầu</th>
                          <th className="text-center">Trạng thái</th>
                          <th className="text-end">Thao tác xử lý</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRecords.map((r) => (
                          <tr key={r.id}>
                            <td>
                              <div className="fw-bold text-dark">{r.memberName}</div>
                              <span className={`badge ${r.memberType === 'teacher' ? 'badge-teacher' : 'badge-student'} mt-1`}>
                                {r.memberType === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
                              </span>
                            </td>
                            <td className="text-secondary small">{r.memberDetail}</td>
                            <td className="fw-semibold text-dark">{r.bookTitle}</td>
                            <td className="text-center">
                              <span className="badge badge-pending px-3 py-1.5">
                                <i className="bi bi-clock me-1"></i> Chờ duyệt
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-success btn-sm me-2 font-semibold px-3 shadow-sm"
                                onClick={() => handleApprove(r.id)}
                              >
                                <i className="bi bi-check-lg me-1"></i> Duyệt mượn
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm font-semibold px-3"
                                onClick={() => handleReject(r.id)}
                              >
                                <i className="bi bi-x-lg me-1"></i> Từ chối
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
