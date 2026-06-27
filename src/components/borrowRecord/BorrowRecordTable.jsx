export default function BorrowRecordTable({ records = [], books = [], members = [], onReturn }) {
  const getBookTitle = (id) => books.find(b => b.id === id)?.title || id;
  const getMemberName = (id) => members.find(m => m.id === id)?.name || id;
  const isOverdue = (record) => record.status === 'borrowed' && new Date(record.dueDate) < new Date();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
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
              <td>{r.borrowDate}</td>
              <td>{r.dueDate} {isOverdue(r) && <span className="badge bg-danger ms-1">Quá hạn</span>}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${r.status === 'borrowed' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {r.status === 'borrowed' ? 'Đang mượn' : 'Đã trả'}
                </span>
              </td>
              <td>
                {r.status === 'borrowed' && (
                  <button className="btn btn-success btn-sm" onClick={() => onReturn(r.id)}>Trả sách</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
