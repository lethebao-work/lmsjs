export default function MyBorrowRecordHistory({ records = [], books = [] }) {
  const getBookTitle = (id) => books.find(b => String(b.id) === String(id))?.title || id;
  const statusMap = {
    pending: { className: 'bg-info text-white', label: 'Chờ duyệt' },
    borrowed: { className: 'bg-warning text-dark', label: 'Đang mượn' },
    rejected: { className: 'bg-danger text-white', label: 'Bị từ chối' },
    returned: { className: 'bg-success', label: 'Đã trả' },
    damaged_returned: { className: 'bg-danger text-white', label: 'Trả hỏng' },
    lost: { className: 'bg-dark text-white', label: 'Báo mất' }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-info">
          <tr><th>Sách</th><th>Ngày mượn</th><th>Hạn trả</th><th>Ngày trả</th><th>Trạng thái</th><th>Phạt</th></tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan={6} className="text-center text-muted">Chưa có lịch sử mượn sách</td></tr>
          ) : records.map(r => (
            <tr key={r.id}>
              <td>{getBookTitle(r.bookId)}</td>
              <td>{r.borrowDate || '—'}</td>
              <td>{r.dueDate || '—'}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${statusMap[r.status]?.className || 'bg-secondary'}`}>
                  {statusMap[r.status]?.label || r.status}
                </span>
              </td>
              <td>
                {Number(r.fineAmount || 0) > 0 ? (
                  <span className="fw-semibold text-danger">{Number(r.fineAmount).toLocaleString('vi-VN')}đ</span>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
