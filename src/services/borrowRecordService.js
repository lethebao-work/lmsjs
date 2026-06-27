import api from './api';
import bookService from './bookService';

const borrowRecordService = {
  getAllRecords: async () => (await api.get('/borrowRecords')).data,

  getRecordsByMemberId: async (memberId) =>
    (await api.get(`/borrowRecords?memberId=${memberId}`)).data,

  createBorrowRecord: async ({ bookId, memberId, dueDate }) => {
    // Kiểm tra sách còn không
    const book = await bookService.getBookById(bookId);
    if (book.availableCopies <= 0) throw new Error('Sách đã hết!');

    // Tạo borrow record
    const record = (await api.post('/borrowRecords', {
      bookId, memberId, dueDate,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: null,
      status: 'borrowed'
    })).data;

    // Giảm availableCopies
    await bookService.updateBook(bookId, {
      ...book,
      availableCopies: book.availableCopies - 1
    });

    return record;
  },

  returnBook: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status === 'returned') throw new Error('Sách đã được trả trước đó!');

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      returnDate: new Date().toISOString().split('T')[0],
      status: 'returned'
    });

    // Tăng availableCopies
    const book = await bookService.getBookById(record.bookId);
    await bookService.updateBook(record.bookId, {
      ...book,
      availableCopies: book.availableCopies + 1
    });

    return true;
  }
};

export default borrowRecordService;
