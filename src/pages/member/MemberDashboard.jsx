import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import memberService from '../../services/memberService';
import borrowRecordService from '../../services/borrowRecordService';
import bookService from '../../services/bookService';
import fineService from '../../services/fineService';
import notificationService from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    borrowingCount: 0,
    pendingCount: 0,
    totalHistoryCount: 0
  });
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const [unpaidFines, setUnpaidFines] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin thành viên liên kết!');
        return;
      }
      setMemberInfo(member);

      const [records, books, fines, notices] = await Promise.all([
        borrowRecordService.getRecordsByMemberId(member.id),
        bookService.getAllBooks(),
        fineService.getUnpaidFinesByMemberId(member.id),
        notificationService.getNotificationsByMemberId(member.id)
      ]);
      setUnpaidFines(fines);
      setNotifications(notices.slice(-5).reverse());

      const bookMap = {};
      books.forEach(b => { bookMap[b.id] = b; });

      const borrowing = records.filter(r => r.status === 'borrowed');
      const pending = records.filter(r => r.status === 'pending');

      setStats({
        borrowingCount: borrowing.length,
        pendingCount: pending.length,
        totalHistoryCount: records.length
      });

      const now = new Date();
      now.setHours(0,0,0,0);

      setActiveBorrows(
        borrowing.map(r => {
          const book = bookMap[r.bookId] || {};
          const dueDate = new Date(r.dueDate);
          dueDate.setHours(0,0,0,0);
          
          const timeDiff = dueDate.getTime() - now.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
          const totalDays = 14;
          const percentUsed = Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100));

          return {
            ...r,
            bookTitle: book.title || 'Không xác định',
            coverImage: book.coverImage,
            author: book.author,
            daysLeft,
            percentUsed,
            isOverdue: daysLeft < 0
          };
        })
      );
    } catch (e) {
      toast.error('Lỗi khi tải thông tin bảng điều khiển!');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="lms-main-surface">
        <div className="lms-dashboard-container">
          {/* Header Area */}
          <div className="lms-page-header">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h2 className="lms-page-title">Bảng Điều Khiển Thành Viên</h2>
                {memberInfo && (
                  <span className={`badge ${memberInfo.memberType === 'teacher' ? 'badge-teacher' : 'badge-student'} px-3 py-1.5`}>
                    {memberInfo.memberType === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
                  </span>
                )}
              </div>
              <p className="lms-page-subtitle">
                Xin chào, <strong className="text-dark">{user?.name}</strong>!
                {memberInfo?.memberType === 'student' && memberInfo?.studentId && (
                  <span className="ms-2">— MSSV: <strong>{memberInfo.studentId}</strong> | Lớp: {memberInfo.className}</span>
                )}
                {memberInfo?.memberType === 'teacher' && memberInfo?.department && (
                  <span className="ms-2">— {memberInfo.department}</span>
                )}
              </p>
            </div>
            <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={fetchDashboardData}>
              <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {memberInfo?.borrowingStatus === 'blocked' && (
                <div className="alert alert-danger d-flex align-items-start gap-2">
                  <i className="bi bi-exclamation-triangle-fill mt-1"></i>
                  <div>
                    <div className="fw-bold">Tài khoản đang tạm khóa quyền mượn sách</div>
                    <div className="small">
                      Bạn còn {Number(memberInfo.unpaidFineAmount || 0).toLocaleString('vi-VN')}đ phí phạt chưa thanh toán. Bạn vẫn đăng nhập và tra cứu bình thường, nhưng cần nộp phạt tại quầy để mượn sách tiếp.
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Stats Grid */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <div className="lms-kpi-card">
                    <div className="lms-kpi-content">
                      <div>
                        <span className="lms-kpi-label">
                          SÁCH ĐANG MƯỢN
                        </span>
                        <h2 className="lms-kpi-value">{stats.borrowingCount}</h2>
                      </div>
                      <div 
                        className="lms-kpi-icon" 
                        style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                      >
                        <i className="bi bi-book"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="lms-kpi-card">
                    <div className="lms-kpi-content">
                      <div>
                        <span className="lms-kpi-label">
                          YÊU CẦU CHỜ DUYỆT
                        </span>
                        <h2 className="lms-kpi-value">{stats.pendingCount}</h2>
                      </div>
                      <div 
                        className="lms-kpi-icon" 
                        style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}
                      >
                        <i className="bi bi-hourglass-split"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="lms-kpi-card">
                    <div className="lms-kpi-content">
                      <div>
                        <span className="lms-kpi-label">
                          TỔNG LƯỢT ĐÃ MƯỢN
                        </span>
                        <h2 className="lms-kpi-value">{stats.totalHistoryCount}</h2>
                      </div>
                      <div 
                        className="lms-kpi-icon" 
                        style={{ backgroundColor: '#ECFDF5', color: '#059669' }}
                      >
                        <i className="bi bi-journal-check"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Borrows Table with Loan Countdown */}
              <div className="lms-panel">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history" style={{ color: '#8B4000' }}></i> Danh Sách Sách Bạn Đang Mượn Thực Tế
                </h5>

                {activeBorrows.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-journal-x display-4 d-block mb-3 text-muted"></i>
                    Bạn chưa mượn cuốn sách nào! Hãy truy cập danh mục để tìm và đăng ký mượn nhé.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-custom align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Bìa sách</th>
                          <th>Tên sách & Tác giả</th>
                          <th className="text-center">Ngày mượn</th>
                          <th className="text-center">Hạn trả</th>
                          <th className="text-center" style={{ minWidth: '200px' }}>Tiến trình hạn mượn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBorrows.map((r) => (
                          <tr key={r.id}>
                            <td style={{ width: '70px' }}>
                              <img 
                                src={r.coverImage ? (r.coverImage.startsWith('http') || r.coverImage.startsWith('/') ? r.coverImage : `/${r.coverImage}`) : 'https://via.placeholder.com/60x80?text=Book'} 
                                alt={r.bookTitle} 
                                className="rounded shadow-sm"
                                style={{ width: '45px', height: '60px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/60x80?text=Book'; }}
                              />
                            </td>
                            <td>
                              <div className="fw-bold text-dark">{r.bookTitle}</div>
                              <small className="text-muted">Tác giả: {r.author || 'Chưa cập nhật'}</small>
                            </td>
                            <td className="text-center text-secondary small">{r.borrowDate}</td>
                            <td className="text-center text-secondary small">{r.dueDate}</td>
                            <td className="text-center">
                              {r.isOverdue ? (
                                <div>
                                  <span className="badge bg-danger px-3 py-1.5 mb-1">
                                    <i className="bi bi-exclamation-octagon me-1"></i> Quá hạn {Math.abs(r.daysLeft)} ngày!
                                  </span>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-danger" style={{ width: '100%' }}></div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="d-flex justify-content-between align-items-center small mb-1">
                                    <span className="text-muted">Còn {r.daysLeft} ngày</span>
                                    <span className="text-success font-semibold">{Math.round(r.percentUsed)}% thời gian</span>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className={`progress-bar ${r.daysLeft <= 3 ? 'bg-warning' : 'bg-success'}`} 
                                      style={{ width: `${r.percentUsed}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {(unpaidFines.length > 0 || notifications.length > 0) && (
                <div className="row g-3 mt-1">
                  {unpaidFines.length > 0 && (
                    <div className="col-lg-6">
                      <div className="lms-panel h-100">
                        <h5 className="fw-bold text-dark mb-3">Phí phạt chưa thanh toán</h5>
                        {unpaidFines.map((fine) => (
                          <div key={fine.id} className="d-flex justify-content-between border-bottom py-2">
                            <div>
                              <div className="fw-semibold">{fine.type === 'damaged' ? 'Sách hỏng' : fine.type === 'lost' ? 'Mất sách' : 'Quá hạn'}</div>
                              <small className="text-muted">{fine.note || fine.createdAt}</small>
                            </div>
                            <span className="fw-bold text-danger">{Number(fine.amount || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {notifications.length > 0 && (
                    <div className="col-lg-6">
                      <div className="lms-panel h-100">
                        <h5 className="fw-bold text-dark mb-3">Thông báo gần đây</h5>
                        {notifications.map((notice) => (
                          <div key={notice.id} className="border-bottom py-2">
                            <div className="fw-semibold">{notice.title}</div>
                            <small className="text-muted">{notice.message}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
