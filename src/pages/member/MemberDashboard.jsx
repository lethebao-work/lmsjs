import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import memberService from '../../services/memberService';
import borrowRecordService from '../../services/borrowRecordService';
import bookService from '../../services/bookService';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Lấy profile độc giả
      const member = await memberService.getMemberByUserId(user.uId);
      if (!member) {
        toast.error('Không tìm thấy thông tin độc giả liên kết!');
        return;
      }

      // Lấy lịch sử mượn trả
      const records = await borrowRecordService.getRecordsByMemberId(member.id);
      const books = await bookService.getAllBooks();

      const bookMap = {};
      books.forEach(b => { bookMap[b.id] = b; });

      const borrowing = records.filter(r => r.status === 'borrowed');
      const pending = records.filter(r => r.status === 'pending');

      setStats({
        borrowingCount: borrowing.length,
        pendingCount: pending.length,
        totalHistoryCount: records.length
      });

      // Lọc danh sách đang mượn kèm chi tiết sách và số ngày còn lại
      const now = new Date();
      now.setHours(0,0,0,0);

      setActiveBorrows(
        borrowing.map(r => {
          const book = bookMap[r.bookId] || {};
          const dueDate = new Date(r.dueDate);
          dueDate.setHours(0,0,0,0);
          
          const timeDiff = dueDate.getTime() - now.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

          return {
            ...r,
            bookTitle: book.title || 'Không xác định',
            coverImage: book.coverImage,
            author: book.author,
            daysLeft,
            isOverdue: daysLeft < 0
          };
        })
      );
    } catch (e) {
      toast.error('Lỗi khi tải thông tin bảng điều khiển!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Bảng điều khiển độc giả</h2>
              <p className="text-muted mb-0">Xin chào quay trở lại, {user?.name}!</p>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchDashboardData}>
              🔄 Làm mới
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Thống kê Tổng quan */}
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Sách
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Sách đang mượn</h6>
                        <h3 className="fw-bold mb-0">{stats.borrowingCount}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-info bg-opacity-10 text-info rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Chờ
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Yêu cầu chờ duyệt</h6>
                        <h3 className="fw-bold mb-0">{stats.pendingCount}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Đã trả
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Tổng số sách đã mượn</h6>
                        <h3 className="fw-bold mb-0">{stats.totalHistoryCount}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sách đang mượn */}
              <div className="card border-0 shadow-sm p-4 bg-white mb-4" style={{ borderRadius: '12px' }}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <span>Sách</span> bạn đang mượn thực tế
                </h5>

                {activeBorrows.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span className="display-4 d-block mb-3">Sách</span>
                    Bạn chưa mượn cuốn sách nào! Hãy truy cập danh mục để tìm và đăng ký mượn nhé.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 px-3 py-3">Bìa sách</th>
                          <th className="border-0 px-3 py-3">Tên sách / Tác giả</th>
                          <th className="border-0 px-3 py-3 text-center">Ngày mượn</th>
                          <th className="border-0 px-3 py-3 text-center">Hạn trả</th>
                          <th className="border-0 px-3 py-3 text-center">Trạng thái hạn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBorrows.map((r) => (
                          <tr key={r.id}>
                            <td className="px-3 py-3" style={{ width: '80px' }}>
                              <img 
                                src={r.coverImage ? `${r.coverImage}` : '/images/default-book.png'} 
                                alt={r.bookTitle} 
                                className="rounded"
                                style={{ width: '50px', height: '70px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                onError={(e) => { e.target.src = '/images/default-book.png'; }}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <div className="fw-semibold text-dark">{r.bookTitle}</div>
                              <small className="text-muted">Tác giả: {r.author || 'Chưa cập nhật'}</small>
                            </td>
                            <td className="px-3 py-3 text-center text-secondary">{r.borrowDate}</td>
                            <td className="px-3 py-3 text-center text-secondary">{r.dueDate}</td>
                            <td className="px-3 py-3 text-center">
                              {r.isOverdue ? (
                                <span className="badge bg-danger py-2 px-3 fw-semibold">
                                  Quá hạn {Math.abs(r.daysLeft)} ngày!
                                </span>
                              ) : (
                                <span className="badge bg-success py-2 px-3 fw-semibold">
                                  Còn {r.daysLeft} ngày
                                </span>
                              )}
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
