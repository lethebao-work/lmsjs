import api from './api';
import bookService from './bookService';
import bookCopyService from './bookCopyService';
import fineService, { FINE_AMOUNTS } from './fineService';
import notificationService from './notificationService';

const today = () => new Date().toISOString().split('T')[0];

const calculateOverdueDays = (dueDate, returnDate = today()) => {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  due.setHours(0, 0, 0, 0);
  returned.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((returned - due) / (1000 * 60 * 60 * 24)));
};

const ensureMemberCanBorrow = async (memberId) => {
  const isBlocked = await fineService.isMemberBlocked(memberId);
  if (isBlocked) {
    throw new Error('Thành viên đang còn phí phạt chưa thanh toán nên tạm thời không được mượn sách mới.');
  }
};

const borrowRecordService = {
  getAllRecords: async () => (await api.get('/borrowRecords')).data,

  getRecordsByMemberId: async (memberId) =>
    (await api.get(`/borrowRecords?memberId=${memberId}`)).data,

  createBorrowRecord: async ({ bookId, memberId, dueDate, status = 'borrowed' }) => {
    await ensureMemberCanBorrow(memberId);

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
      borrowDate: status === 'borrowed' ? today() : null,
      returnDate: null,
      status,
      copyId: null,
      renewalCount: 0,
      returnCondition: null,
      fineAmount: 0
    })).data;

    // Giảm availableCopies nếu mượn trực tiếp
    if (status === 'borrowed') {
      const copy = await bookCopyService.allocateAvailableCopy(bookId, record.id);
      await bookService.updateBook(bookId, {
        ...book,
        availableCopies: book.availableCopies - 1
      });
      await api.patch(`/borrowRecords/${record.id}`, { copyId: copy.id });
      await notificationService.createNotification({
        memberId,
        type: 'borrow',
        title: 'Phiếu mượn đã được tạo',
        message: `Bạn đang mượn "${book.title}". Hạn trả: ${dueDate}.`
      });
    }

    return record;
  },

  approveBorrowRecord: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status !== 'pending') throw new Error('Yêu cầu không ở trạng thái chờ duyệt!');
    await ensureMemberCanBorrow(record.memberId);

    const book = await bookService.getBookById(record.bookId);
    if (book.availableCopies <= 0) throw new Error('Sách đã hết, không thể duyệt!');

    // Tính ngày mượn và hạn trả (14 ngày kể từ hôm nay)
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 14);
    const dueDateString = due.toISOString().split('T')[0];
    const copy = await bookCopyService.allocateAvailableCopy(record.bookId, recordId);

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDateString,
      status: 'borrowed',
      copyId: copy.id,
      renewalCount: record.renewalCount || 0
    });

    const newAvailableCopies = book.availableCopies - 1;

    // Giảm availableCopies
    await bookService.updateBook(record.bookId, {
      ...book,
      availableCopies: newAvailableCopies
    });

    await notificationService.createNotification({
      memberId: record.memberId,
      type: 'borrow_approved',
      title: 'Yêu cầu mượn sách đã được duyệt',
      message: `Bạn đã được duyệt mượn "${book.title}". Hạn trả: ${dueDateString}.`
    });

    // Nếu sách đã hết (về 0), càn quét các phiếu mượn pending khác của sách này và reject
    if (newAvailableCopies <= 0) {
      const allRecords = (await api.get(`/borrowRecords?bookId=${record.bookId}&status=pending`)).data;
      // Lọc bỏ chính nó (dù nó đã được update thành borrowed rồi, nhưng để cho an toàn)
      const pendingOthers = allRecords.filter(r => String(r.id) !== String(recordId));
      for (const pRecord of pendingOthers) {
        await api.patch(`/borrowRecords/${pRecord.id}`, { status: 'rejected' });
      }
    }

    return true;
  },

  returnBook: async (recordId, { condition = 'normal', note = '' } = {}) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status !== 'borrowed') throw new Error('Phiếu này không ở trạng thái đang mượn!');

    const returnDate = today();
    const overdueDays = calculateOverdueDays(record.dueDate, returnDate);
    const overdueFine = overdueDays * FINE_AMOUNTS.overduePerDay;
    const conditionFine =
      condition === 'damaged' ? FINE_AMOUNTS.damaged :
      condition === 'lost' ? FINE_AMOUNTS.lost :
      0;
    const fineAmount = overdueFine + conditionFine;
    const statusByCondition = {
      normal: 'returned',
      damaged: 'damaged_returned',
      lost: 'lost'
    };

    // Cập nhật record
    await api.patch(`/borrowRecords/${recordId}`, {
      returnDate,
      status: statusByCondition[condition] || 'returned',
      returnCondition: condition,
      fineAmount,
      overdueDays,
      returnNote: note
    });

    const book = await bookService.getBookById(record.bookId);
    await bookCopyService.returnCopyForRecord(record, condition);

    if (condition === 'normal') {
      await bookService.updateBook(record.bookId, {
        ...book,
        availableCopies: book.availableCopies + 1
      });
    } else if (condition === 'lost') {
      await bookService.updateBook(record.bookId, {
        ...book,
        totalCopies: Math.max(0, Number(book.totalCopies || 0) - 1)
      });
    }

    if (fineAmount > 0) {
      await fineService.createFine({
        memberId: record.memberId,
        borrowRecordId: record.id,
        bookId: record.bookId,
        type: condition === 'normal' ? 'overdue' : condition,
        amount: fineAmount,
        daysOverdue: overdueDays,
        note: note || [
          overdueDays > 0 ? `Quá hạn ${overdueDays} ngày` : '',
          condition === 'damaged' ? 'Sách trả bị hỏng' : '',
          condition === 'lost' ? 'Báo mất sách' : ''
        ].filter(Boolean).join('. ')
      });
    }

    return true;
  },

  renewBorrowRecord: async (recordId, days = 7) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    if (record.status !== 'borrowed') throw new Error('Chỉ có thể gia hạn phiếu đang mượn!');
    await ensureMemberCanBorrow(record.memberId);
    if (calculateOverdueDays(record.dueDate) > 0) throw new Error('Phiếu đã quá hạn, không thể gia hạn!');
    if (Number(record.renewalCount || 0) >= 2) throw new Error('Phiếu này đã đạt số lần gia hạn tối đa!');

    const due = new Date(record.dueDate);
    due.setDate(due.getDate() + Number(days || 7));
    const dueDate = due.toISOString().split('T')[0];

    await api.patch(`/borrowRecords/${recordId}`, {
      dueDate,
      renewalCount: Number(record.renewalCount || 0) + 1
    });

    await notificationService.createNotification({
      memberId: record.memberId,
      type: 'renewal',
      title: 'Phiếu mượn đã được gia hạn',
      message: `Hạn trả mới của bạn là ${dueDate}.`
    });

    return true;
  },

  rejectBorrowRecord: async (recordId) => {
    const record = (await api.get(`/borrowRecords/${recordId}`)).data;
    await api.patch(`/borrowRecords/${recordId}`, {
      status: 'rejected'
    });
    await notificationService.createNotification({
      memberId: record.memberId,
      type: 'borrow_rejected',
      title: 'Yêu cầu mượn sách bị từ chối',
      message: 'Yêu cầu mượn sách của bạn đã bị thủ thư từ chối.'
    });
    return true;
  }
};

export default borrowRecordService;
