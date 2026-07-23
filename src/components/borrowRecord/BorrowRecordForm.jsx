import { useMemo, useState, useEffect } from 'react';
import bookService from '../../services/bookService';
import memberService from '../../services/memberService';

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function BorrowRecordForm({ onSubmit, books: availableBooks, members: availableMembers }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ bookId: '', memberId: '', dueDate: '' });
  const [bookQuery, setBookQuery] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [activePicker, setActivePicker] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (availableBooks && availableMembers) {
      setBooks(availableBooks.filter(b => b.availableCopies > 0));
      setMembers(availableMembers);
      return;
    }

    Promise.all([
      bookService.getAllBooks(),
      memberService.getAllMembers()
    ]).then(([bookData, memberData]) => {
      setBooks(bookData.filter(b => b.availableCopies > 0));
      setMembers(memberData);
    });
  }, [availableBooks, availableMembers]);

  const handleSubmit = () => {
    if (!form.bookId || !form.memberId || !form.dueDate) {
      setError('Vui lòng chọn đầy đủ thông tin!');
      return;
    }
    setError('');
    const selectedMember = members.find(m => String(m.id) === String(form.memberId));
    if (selectedMember?.borrowingStatus === 'blocked') {
      setError('Thành viên này đang bị tạm khóa quyền mượn do còn phí phạt chưa thanh toán!');
      return;
    }

    onSubmit({ ...form });
    setForm({ bookId: '', memberId: '', dueDate: '' });
    setBookQuery('');
    setMemberQuery('');
    setActivePicker(null);
  };

  const selectedBook = books.find(b => String(b.id) === String(form.bookId));
  const selectedMember = members.find(m => String(m.id) === String(form.memberId));

  const filteredBooks = useMemo(() => {
    const keyword = normalizeText(bookQuery.trim());
    if (!keyword) return books.slice(0, 8);

    return books
      .filter(book => normalizeText([
        book.title,
        book.author,
        book.bookCode,
        book.id
      ].join(' ')).includes(keyword))
      .slice(0, 8);
  }, [books, bookQuery]);

  const filteredMembers = useMemo(() => {
    const keyword = normalizeText(memberQuery.trim());
    if (!keyword) return members.slice(0, 8);

    return members
      .filter(member => normalizeText([
        member.name,
        member.email,
        member.studentId,
        member.department,
        member.phone,
        member.id
      ].join(' ')).includes(keyword))
      .slice(0, 8);
  }, [members, memberQuery]);

  const selectBook = (book) => {
    setForm({...form, bookId: book.id});
    setBookQuery(`${book.title} - ${book.bookCode || book.id}`);
    setActivePicker(null);
  };

  const selectMember = (member) => {
    if (member.borrowingStatus === 'blocked') return;
    setForm({...form, memberId: member.id});
    setMemberQuery(`${member.name}${member.studentId ? ` - ${member.studentId}` : ''}`);
    setActivePicker(null);
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="quick-borrow-form">
        <div className="live-search-field">
          <label className="form-label">
            Sách *
          </label>
          <i className="bi bi-search live-search-icon"></i>
          <input
            className="form-control live-search-input"
            value={bookQuery}
            onChange={(e) => {
              setBookQuery(e.target.value);
              setForm({...form, bookId: ''});
              setActivePicker('book');
            }}
            onFocus={() => setActivePicker('book')}
            placeholder="Gõ tên sách, tác giả hoặc mã sách..."
          />
          {activePicker === 'book' && (
            <div className="live-search-results">
              {filteredBooks.length === 0 ? (
                <div className="live-search-empty">Không tìm thấy sách phù hợp.</div>
              ) : filteredBooks.map(book => (
                <button key={book.id} type="button" className="live-search-result" onClick={() => selectBook(book)}>
                  <i className="bi bi-book mt-1 text-primary"></i>
                  <span>
                    <span className="fw-semibold d-block">{book.title}</span>
                    <small className="text-muted">{book.author} · {book.bookCode || book.id} · còn {book.availableCopies}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
          {selectedBook && (
            <div className="selected-pill">
              <span className="small"><strong>{selectedBook.bookCode}</strong> · còn {selectedBook.availableCopies} cuốn</span>
              <button className="btn btn-sm btn-light border py-0" type="button" onClick={() => { setForm({...form, bookId: ''}); setBookQuery(''); }}>
                <i className="bi bi-x"></i>
              </button>
            </div>
          )}
        </div>
        <div className="live-search-field">
          <label className="form-label">
            Độc giả *
          </label>
          <i className="bi bi-search live-search-icon"></i>
          <input
            className="form-control live-search-input"
            value={memberQuery}
            onChange={(e) => {
              setMemberQuery(e.target.value);
              setForm({...form, memberId: ''});
              setActivePicker('member');
            }}
            onFocus={() => setActivePicker('member')}
            placeholder="Gõ tên, email, MSSV, khoa..."
          />
          {activePicker === 'member' && (
            <div className="live-search-results">
              {filteredMembers.length === 0 ? (
                <div className="live-search-empty">Không tìm thấy độc giả phù hợp.</div>
              ) : filteredMembers.map(member => (
                <button
                  key={member.id}
                  type="button"
                  className="live-search-result"
                  disabled={member.borrowingStatus === 'blocked'}
                  onClick={() => selectMember(member)}
                >
                  <i className={`bi ${member.memberType === 'teacher' ? 'bi-person-workspace' : 'bi-person'} mt-1 text-primary`}></i>
                  <span>
                    <span className="fw-semibold d-block">{member.name}</span>
                    <small className={member.borrowingStatus === 'blocked' ? 'text-danger' : 'text-muted'}>
                      {member.email} · {member.memberType === 'teacher' ? 'Giảng viên' : 'Sinh viên'}
                      {member.borrowingStatus === 'blocked' ? ` · khóa mượn ${Number(member.unpaidFineAmount || 0).toLocaleString('vi-VN')}đ` : ''}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}
          {selectedMember && (
            <div className="selected-pill">
              <span className="small"><strong>{selectedMember.name}</strong> · {selectedMember.memberType === 'teacher' ? 'Giảng viên' : 'Sinh viên'}</span>
              <button className="btn btn-sm btn-light border py-0" type="button" onClick={() => { setForm({...form, memberId: ''}); setMemberQuery(''); }}>
                <i className="bi bi-x"></i>
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="form-label">
            Hạn trả *
          </label>
          <input type="date" className="form-control" value={form.dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({...form, dueDate: e.target.value})} />
        </div>
      </div>
      <div className="quick-borrow-actions">
        <button
          className="btn btn-light border"
          type="button"
          onClick={() => {
            setForm({ bookId: '', memberId: '', dueDate: '' });
            setBookQuery('');
            setMemberQuery('');
            setActivePicker(null);
          }}
        >
          Xóa nhập liệu
        </button>
        <button className="btn btn-success quick-borrow-submit" type="button" onClick={handleSubmit}>
          <i className="bi bi-plus-lg me-1"></i> Tạo phiếu
        </button>
      </div>
    </div>
  );
}
