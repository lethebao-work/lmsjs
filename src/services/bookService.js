import api from './api';

const bookService = {
  getAllBooks: async () => (await api.get('/books')).data,
  getBookById: async (id) => (await api.get(`/books/${id}`)).data,
  createBook: async (data) => (await api.post('/books', data)).data,
  updateBook: async (id, data) => (await api.put(`/books/${id}`, data)).data,
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
