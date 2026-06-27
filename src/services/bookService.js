import api from './api';

const bookService = {
  getAllBooks: async () => (await api.get('/books')).data,
  getBookById: async (id) => (await api.get(`/books/${id}`)).data,
  createBook: async (data) => (await api.post('/books', data)).data,
  updateBook: async (id, data) => (await api.put(`/books/${id}`, data)).data,
  deleteBook: async (id) => { await api.delete(`/books/${id}`); return true; },
};

export default bookService;
