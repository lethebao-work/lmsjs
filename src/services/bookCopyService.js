import api from './api';
import bookService from './bookService';

const today = () => new Date().toISOString().split('T')[0];

const pad = (value) => String(value).padStart(2, '0');

const makeBookCode = (book, index = 0) => {
  if (book.bookCode) return book.bookCode;
  return `BOOK-${pad(index + 1).padStart(4, '0')}`;
};

const bookCopyService = {
  getAllCopies: async () => (await api.get('/bookCopies')).data,

  getCopiesByBookId: async (bookId) =>
    (await api.get(`/bookCopies?bookId=${bookId}`)).data,

  ensureCopiesForBook: async (book) => {
    const existingCopies = await bookCopyService.getCopiesByBookId(book.id);
    const desiredTotal = Number(book.totalCopies || 0);
    const baseCode = book.bookCode || makeBookCode(book);

    if (existingCopies.length >= desiredTotal) return existingCopies;

    const created = [];
    for (let index = existingCopies.length; index < desiredTotal; index += 1) {
      const copyCode = `${baseCode}-C${pad(index + 1)}`;
      if ([...existingCopies, ...created].some(copy => copy.copyCode === copyCode)) continue;
      created.push((await api.post('/bookCopies', {
        bookId: book.id,
        copyCode,
        status: 'available',
        condition: 'good',
        currentBorrowRecordId: null,
        createdAt: today()
      })).data);
    }

    return [...existingCopies, ...created];
  },

  allocateAvailableCopy: async (bookId, borrowRecordId) => {
    const book = await bookService.getBookById(bookId);
    const copies = await bookCopyService.ensureCopiesForBook(book);
    const availableCopy = copies.find(copy => copy.status === 'available');

    if (!availableCopy) throw new Error('Không còn bản sao sách khả dụng!');

    return (await api.patch(`/bookCopies/${availableCopy.id}`, {
      status: 'borrowed',
      condition: 'good',
      currentBorrowRecordId: borrowRecordId,
      borrowedAt: today()
    })).data;
  },

  returnCopyForRecord: async (record, returnCondition) => {
    const copies = await bookCopyService.getCopiesByBookId(record.bookId);
    const borrowedCopy = copies.find(copy => String(copy.currentBorrowRecordId) === String(record.id));
    if (!borrowedCopy) return null;

    const statusByCondition = {
      normal: 'available',
      damaged: 'damaged',
      lost: 'lost'
    };

    return (await api.patch(`/bookCopies/${borrowedCopy.id}`, {
      status: statusByCondition[returnCondition] || 'available',
      condition: returnCondition === 'normal' ? 'good' : returnCondition,
      currentBorrowRecordId: null,
      returnedAt: today()
    })).data;
  },

  updateCopyStatus: async (copyId, status, condition = null) => {
    const copy = (await api.get(`/bookCopies/${copyId}`)).data;
    if (copy.status === 'borrowed') {
      throw new Error('Không thể đổi trạng thái bản sao đang được mượn!');
    }

    return (await api.patch(`/bookCopies/${copyId}`, {
      status,
      condition: condition || (status === 'available' ? 'good' : status),
      currentBorrowRecordId: null,
      updatedAt: today()
    })).data;
  },

  syncCopiesWithInventory: async (books = [], borrowRecords = []) => {
    const syncedCopies = [];

    for (const book of books) {
      let copies = await bookCopyService.ensureCopiesForBook(book);
      const activeRecords = borrowRecords.filter(record =>
        String(record.bookId) === String(book.id) && record.status === 'borrowed'
      );

      for (const record of activeRecords) {
        const existingCopy = record.copyId
          ? copies.find(copy => String(copy.id) === String(record.copyId))
          : copies.find(copy => String(copy.currentBorrowRecordId) === String(record.id));

        if (existingCopy) {
          if (existingCopy.status !== 'borrowed' || String(existingCopy.currentBorrowRecordId) !== String(record.id)) {
            const updated = (await api.patch(`/bookCopies/${existingCopy.id}`, {
              status: 'borrowed',
              condition: 'good',
              currentBorrowRecordId: record.id,
              borrowedAt: record.borrowDate || today()
            })).data;
            copies = copies.map(copy => String(copy.id) === String(updated.id) ? updated : copy);
          }
          if (!record.copyId) {
            await api.patch(`/borrowRecords/${record.id}`, { copyId: existingCopy.id });
          }
          continue;
        }

        const availableCopy = copies.find(copy => copy.status === 'available');
        if (!availableCopy) continue;

        const updated = (await api.patch(`/bookCopies/${availableCopy.id}`, {
          status: 'borrowed',
          condition: 'good',
          currentBorrowRecordId: record.id,
          borrowedAt: record.borrowDate || today()
        })).data;
        await api.patch(`/borrowRecords/${record.id}`, { copyId: updated.id });
        copies = copies.map(copy => String(copy.id) === String(updated.id) ? updated : copy);
      }

      syncedCopies.push(...copies);
    }

    return syncedCopies;
  }
};

export default bookCopyService;
