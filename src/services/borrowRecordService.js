import api from './api';
import bookService from './bookService';

const borrowRecordService = {
  getAllRecords: async () => (await api.get('/borrowRecords')).data,

  getRecordsByMemberId: async (memberId) =>
    (await api.get(`/borrowRecords?memberId=${memberId}`)).data,

  createBorrowRecord: async ({ bookId, memberId, dueDate, status = 'borrowed' }) => {
    // Kiểm tra sách còn không
    const book = await bookService.getBookById(bookId);
    if (book.availableCopies <= 0) throw new Error('Sách đã hết!');

    // Kiểm tra logic mượn sách:
    // 1. Tối đa 3 sách (đang mượn + đang chờ duyệt)
    // 2. Không mượn trùng cuốn sách
    const records = await borrowRecordService.getRecordsByMemberId(memberId);
    const activeRecords = records.filter(r => r.status === 'borrowed' || r.status === 'pending');
    
    if (activeRecords.length >= 3) {
      throw new Error('Bạn chỉ được mượn (hoặc đang yêu cầu) tối đa 3 cuốn sách cùng lúc!');
    }
    if (activeRecords.some(r => String(r.bookId) === String(bookId))) {
      throw new Error('Bạn đang mượn hoặc đã gửi yêu cầu mượn cuốn sách này rồi!');
    }

    // Tạo borrow record
    const record = (await api.post('/borrowRecords', {
      bookId, memberId, dueDate,
      borrowDate: status === 'borrowed' ? new Date().toISOString().split('T')[0] : null,
      returnDate: null,
      status
    })).data;

    // Giảm availableCopies nếu mượn trực tiếp
    if (status === 'borrowed') {
      await bookService.updateBook(bookId, {
        ...book,
        availableCopies: book.availableCopies - 1
      });
    }

    return record;
  },

  approveBorrowRecord: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status !== 'pending') throw new Error('Yêu cầu không ở trạng thái chờ duyệt!');

    const book = await bookService.getBookById(record.bookId);
    if (book.availableCopies <= 0) throw new Error('Sách đã hết, không thể duyệt!');

    // Tính ngày mượn và hạn trả (14 ngày kể từ hôm nay)
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 14);
    const dueDateString = due.toISOString().split('T')[0];

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDateString,
      status: 'borrowed'
    });

    // Giảm availableCopies
    await bookService.updateBook(record.bookId, {
      ...book,
      availableCopies: book.availableCopies - 1
    });

    return true;
  },

  returnBook: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status === 'returned') throw new Error('Sách đã được trả trước đó!');

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      returnDate: new Date().toISOString().split('T')[0],
      status: 'returned'
    });

    // Tăng availableCopies nếu trạng thái trước đó là borrowed
    if (record.status === 'borrowed') {
      const book = await bookService.getBookById(record.bookId);
      await bookService.updateBook(record.bookId, {
        ...book,
        availableCopies: book.availableCopies + 1
      });
    }

    return true;
  },

  rejectBorrowRecord: async (recordId) => {
    await api.patch(`/borrowRecords/${recordId}`, {
      status: 'rejected'
    });
    return true;
  }
};

export default borrowRecordService;
