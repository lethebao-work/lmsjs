import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import borrowRecordService from '../../services/borrowRecordService';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';
import BorrowRecordForm from '../../components/borrowRecord/BorrowRecordForm';
import BorrowRecordTable from '../../components/borrowRecord/BorrowRecordTable';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LibrarianBorrowRecordsPage() {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [r, b, m] = await Promise.all([
      borrowRecordService.getAllRecords(),
      bookService.getAllBooks(),
      memberService.getAllMembers()
    ]);
    setRecords(r); setBooks(b); setMembers(m);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (data) => {
    try { await borrowRecordService.createBorrowRecord(data); toast.success('Tạo phiếu mượn thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  const handleReturn = async (id) => {
    try { await borrowRecordService.returnBook(id); toast.success('Trả sách thành công!'); fetchAll(); }
    catch (e) { toast.error(e.message || 'Có lỗi xảy ra!'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="mb-3">Quản lý mượn/trả sách</h2>
        <div className="card shadow-sm p-3 mb-4">
          <h5>Tạo phiếu mượn mới</h5>
          <BorrowRecordForm onSubmit={handleCreate} books={books} members={members} />
        </div>
        <div className="card shadow-sm p-3">
          <h5>Danh sách phiếu mượn</h5>
          <BorrowRecordTable records={records} books={books} members={members} onReturn={handleReturn} />
        </div>
      </div>
    </div>
  );
}
