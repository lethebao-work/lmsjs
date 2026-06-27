import { useState, useEffect } from 'react';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';

export default function BorrowRecordForm({ onSubmit }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ bookId: '', memberId: '', dueDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    bookService.getAllBooks().then(data => setBooks(data.filter(b => b.availableCopies > 0)));
    memberService.getAllMembers().then(setMembers);
  }, []);

  const handleSubmit = () => {
    if (!form.bookId || !form.memberId || !form.dueDate) {
      setError('Vui lòng chọn đầy đủ thông tin!');
      return;
    }
    setError('');
    onSubmit({ ...form, bookId: parseInt(form.bookId), memberId: parseInt(form.memberId) });
    setForm({ bookId: '', memberId: '', dueDate: '' });
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Sách *</label>
          <select className="form-select" value={form.bookId} onChange={e => setForm({...form, bookId: e.target.value})}>
            <option value="">-- Chọn sách --</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title} (còn {b.availableCopies})</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Độc giả *</label>
          <select className="form-select" value={form.memberId} onChange={e => setForm({...form, memberId: e.target.value})}>
            <option value="">-- Chọn độc giả --</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Hạn trả *</label>
          <input type="date" className="form-control" value={form.dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({...form, dueDate: e.target.value})} />
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleSubmit}>Tạo</button>
        </div>
      </div>
    </div>
  );
}
