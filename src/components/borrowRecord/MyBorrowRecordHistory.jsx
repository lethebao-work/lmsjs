export default function MyBorrowRecordHistory({ records = [], books = [] }) {
  const getBookTitle = (id) => books.find(b => b.id === id)?.title || id;

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead className="table-info">
          <tr><th>Sách</th><th>Ngày mượn</th><th>Hạn trả</th><th>Ngày trả</th><th>Trạng thái</th></tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan={5} className="text-center text-muted">Chưa có lịch sử mượn sách</td></tr>
          ) : records.map(r => (
            <tr key={r.id}>
              <td>{getBookTitle(r.bookId)}</td>
              <td>{r.borrowDate}</td>
              <td>{r.dueDate}</td>
              <td>{r.returnDate || '—'}</td>
              <td>
                <span className={`badge ${r.status === 'borrowed' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {r.status === 'borrowed' ? 'Đang mượn' : 'Đã trả'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
