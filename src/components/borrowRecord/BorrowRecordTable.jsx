export default function BorrowRecordTable({ records = [], books = [], members = [], onApprove, onReturn, onReject }) {
  const getBookTitle = (id) => books.find(b => String(b.id) === String(id))?.title || id;
  const getMemberName = (id) => members.find(m => String(m.id) === String(id))?.name || id;
  const isOverdue = (record) => record.status === 'borrowed' && new Date(record.dueDate) < new Date();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle table-bordered">
        <thead className="table-primary">
          <tr>
            <th>Sách</th><th>Độc giả</th><th>Ngày mượn</th>
            <th>Hạn trả</th><th>Ngày trả</th><th>Trạng thái</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} className={isOverdue(r) ? 'table-danger' : ''}>
              <td>{getBookTitle(r.bookId)}</td>
              <td>{getMemberName(r.memberId)}</td>
              <td>{r.borrowDate || '—'}</td>
              <td>{r.dueDate || '—'} {isOverdue(r) && <span className="badge bg-danger ms-1">Quá hạn</span>}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${r.status === 'pending'
                    ? 'bg-info text-white'
                    : r.status === 'borrowed'
                      ? 'bg-warning text-dark'
                      : r.status === 'rejected'
                        ? 'bg-danger text-white'
                        : 'bg-success'
                  }`}>
                  {r.status === 'pending'
                    ? 'Chờ duyệt'
                    : r.status === 'borrowed'
                      ? 'Đang mượn'
                      : r.status === 'rejected'
                        ? 'Bị từ chối'
                        : 'Đã trả'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
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
                    <button className="btn btn-success btn-sm fw-semibold" onClick={() => onReturn(r.id)}>
                      Trả sách
                    </button>
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
