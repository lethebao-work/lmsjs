import api from './api';

const makeBookCode = (index) => `BOOK-${String(index + 1).padStart(4, '0')}`;

const validateBookInventory = (data) => {
  const totalCopies = Number(data.totalCopies);
  const availableCopies = Number(data.availableCopies);

  if (!Number.isInteger(totalCopies) || totalCopies < 1) {
    throw new Error('Tổng số sách phải là số nguyên và lớn hơn hoặc bằng 1!');
  }
  if (!Number.isInteger(availableCopies) || availableCopies < 0) {
    throw new Error('Số sách còn lại phải là số nguyên và không được âm!');
  }
  if (availableCopies > totalCopies) {
    throw new Error('Số sách còn lại không được vượt quá tổng số!');
  }
};

const bookService = {
  getAllBooks: async () => {
    const books = (await api.get('/books')).data;
    return books.map((book, index) => ({
      ...book,
      bookCode: book.bookCode || makeBookCode(index)
    }));
  },
  getBookById: async (id) => {
    const book = (await api.get(`/books/${id}`)).data;
    const books = (await api.get('/books')).data;
    const index = books.findIndex(item => String(item.id) === String(id));
    return {
      ...book,
      bookCode: book.bookCode || makeBookCode(Math.max(index, 0))
    };
  },
  createBook: async (data) => {
    validateBookInventory(data);
    const books = (await api.get('/books')).data;
    const nextCode = data.bookCode || makeBookCode(books.length);
    return (await api.post('/books', { ...data, bookCode: nextCode })).data;
  },
  updateBook: async (id, data) => {
    validateBookInventory(data);
    return (await api.patch(`/books/${id}`, data)).data;
  },
  deleteBook: async (id) => {
    const borrowRecords = (await api.get(`/borrowRecords?bookId=${id}`)).data;
    const activeRecords = borrowRecords.filter(r => r.status === 'borrowed' || r.status === 'pending');
    if (activeRecords.length > 0) {
      throw new Error('Không thể xóa sách vì đang có độc giả mượn hoặc yêu cầu mượn!');
    }
    await api.delete(`/books/${id}`);
    return true;
  },
};

export default bookService;
