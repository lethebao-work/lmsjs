import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import memberService from '../services/memberService';
import borrowRecordService from '../services/borrowRecordService';
import bookService from '../services/bookService';
import MyBorrowRecordHistory from '../components/borrowRecord/MyBorrowRecordHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Sidebar from '../components/common/Sidebar';

export default function MyBorrowRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uId) {
        setLoading(false);
        return;
      }

      try {
        const member = await memberService.getMemberByUserId(user.uId);
        if (member) {
          const [recs, bks] = await Promise.all([
            borrowRecordService.getRecordsByMemberId(member.id),
            bookService.getAllBooks()
          ]);
          setRecords(recs);
          setBooks(bks);
        }
      } catch {
        setError('Không thể tải lịch sử mượn sách!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">Lịch sử mượn sách của tôi</h2>
        <MyBorrowRecordHistory records={records} books={books} />
      </div>
    </div>
  );
}
