import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

      // Tạo map để lấy tên sách nhanh
      const bookMap = {};
      books.forEach(b => { bookMap[b.id] = b.title; });

      // Tạo map để lấy tên độc giả nhanh
      const memberMap = {};
      members.forEach(m => { memberMap[m.id] = m.name; });

      setStats({
        totalBooks: books.length,
        totalMembers: members.length,
        activeBorrows: active.length,
        pendingRequests: pending.length
      });

      // Lấy danh sách chờ duyệt kèm chi tiết
      setPendingRecords(
        pending.map(r => ({
          ...r,
          bookTitle: bookMap[r.bookId] || 'Không xác định',
          memberName: memberMap[r.memberId] || 'Không xác định'
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
      fetchData(); // Tải lại dữ liệu
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
      <div className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 72px)', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark mb-0">Bảng điều khiển thủ thư</h2>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchData}>
              Làm mới
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Thống kê Tổng quan */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Sách
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Tổng đầu sách</h6>
                        <h3 className="fw-bold mb-0">{stats.totalBooks}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Độc giả
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Tổng số độc giả</h6>
                        <h3 className="fw-bold mb-0">{stats.totalMembers}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Mượn
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Đang mượn</h6>
                        <h3 className="fw-bold mb-0">{stats.activeBorrows}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '12px' }}>
                    <div className="d-flex align-items-center">
                      <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3 me-3" style={{ fontSize: '1.5rem' }}>
                        Chờ
                      </div>
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Chờ duyệt mượn</h6>
                        <h3 className="fw-bold mb-0 text-danger">{stats.pendingRequests}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng yêu cầu chờ duyệt */}
              <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <span>Yêu cầu</span> chờ duyệt gần đây
                </h5>

                {pendingRecords.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span className="display-4 d-block mb-3">Trống</span>
                    Hiện tại không có yêu cầu mượn sách nào cần phê duyệt!
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 px-3 py-3">Độc giả</th>
                          <th className="border-0 px-3 py-3">Sách yêu cầu</th>
                          <th className="border-0 px-3 py-3 text-center">Trạng thái</th>
                          <th className="border-0 px-3 py-3 text-end">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRecords.map((r) => (
                          <tr key={r.id}>
                            <td className="px-3 py-3 fw-semibold text-dark">{r.memberName}</td>
                            <td className="px-3 py-3">{r.bookTitle}</td>
                            <td className="px-3 py-3 text-center">
                              <span className="badge bg-warning text-dark py-2 px-3 fw-semibold">
                                Chờ duyệt
                              </span>
                            </td>
                            <td className="px-3 py-3 text-end">
                              <button
                                className="btn btn-success btn-sm me-2 fw-semibold px-3"
                                onClick={() => handleApprove(r.id)}
                              >
                                Duyệt mượn
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm fw-semibold px-3"
                                onClick={() => handleReject(r.id)}
                              >
                                Từ chối
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
