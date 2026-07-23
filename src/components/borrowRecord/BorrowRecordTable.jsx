export default function BorrowRecordTable({ records = [], books = [], members = [], onApprove, onReturn, onReject, onRenew }) {
  const getBookTitle = (id) => books.find(b => String(b.id) === String(id))?.title || id;
  const getMemberName = (id) => members.find(m => String(m.id) === String(id))?.name || id;
  const isOverdue = (record) => record.status === 'borrowed' && new Date(record.dueDate) < new Date();

  const statusMap = {
    pending: { className: 'bg-info text-white', label: 'Chờ duyệt' },
    borrowed: { className: 'bg-warning text-dark', label: 'Đang mượn' },
    rejected: { className: 'bg-danger text-white', label: 'Bị từ chối' },
    returned: { className: 'bg-success', label: 'Đã trả' },
    damaged_returned: { className: 'bg-danger text-white', label: 'Trả hỏng' },
    lost: { className: 'bg-dark text-white', label: 'Báo mất' }
  };

  const handleSpecialReturn = (record, condition) => {
    const labels = { damaged: 'sách bị hỏng', lost: 'báo mất sách' };
    const note = window.prompt(`Nhập ghi chú cho trường hợp ${labels[condition]}:`, '');
    if (note === null) return;
    onReturn(record.id, { condition, note });
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle table-bordered">
        <thead className="table-primary">
          <tr>
            <th>Sách</th><th>Độc giả</th><th>Ngày mượn</th>
            <th>Hạn trả</th><th>Ngày trả</th><th>Trạng thái</th><th>Phạt</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted py-5">
                Không có phiếu mượn phù hợp với bộ lọc.
              </td>
            </tr>
          ) : records.map(r => (
            <tr key={r.id} className={isOverdue(r) ? 'table-danger' : ''}>
              <td>{getBookTitle(r.bookId)}</td>
              <td>{getMemberName(r.memberId)}</td>
              <td>{r.borrowDate || '—'}</td>
              <td>{r.dueDate || '—'} {isOverdue(r) && <span className="badge bg-danger ms-1">Quá hạn</span>}</td>
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
              <td>
                <div className="d-flex flex-wrap gap-2">
                  {r.status === 'pending' && (
                    <>
                      <button className="btn btn-success btn-sm fw-semibold" onClick={() => onApprove(r.id)}>
                        Duyệt mượn
                      </button>
                      {onReject && (
                        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={() => onReject(r.id)}>
                          Từ chối
                        </button>
                      )}
                    </>
                  )}
                  {r.status === 'borrowed' && (
                    <>
                      {onRenew && (
                        <button className="btn btn-outline-primary btn-sm fw-semibold" onClick={() => onRenew(r.id)}>
                          Gia hạn
                        </button>
                      )}
                      <button className="btn btn-success btn-sm fw-semibold" onClick={() => onReturn(r.id, { condition: 'normal' })}>
                        Trả tốt
                      </button>
                      <button className="btn btn-outline-warning btn-sm fw-semibold" onClick={() => handleSpecialReturn(r, 'damaged')}>
                        Trả hỏng
                      </button>
                      <button className="btn btn-outline-dark btn-sm fw-semibold" onClick={() => handleSpecialReturn(r, 'lost')}>
                        Báo mất
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
