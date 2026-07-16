import api from './api';

const bookSuggestionService = {
  getAllSuggestions: async () => (await api.get('/bookSuggestions')).data,

  getSuggestionsByMemberId: async (memberId) =>
    (await api.get(`/bookSuggestions?memberId=${memberId}`)).data,

  createSuggestion: async (data) =>
    (await api.post('/bookSuggestions', {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      reviewedAt: null,
      librarianNote: ''
    })).data,

  approveSuggestion: async (id, librarianNote = '') => {
    await api.patch(`/bookSuggestions/${id}`, {
      status: 'approved',
      reviewedAt: new Date().toISOString().split('T')[0],
      librarianNote
    });
    return true;
  },

  rejectSuggestion: async (id, librarianNote = '') => {
    await api.patch(`/bookSuggestions/${id}`, {
      status: 'rejected',
      reviewedAt: new Date().toISOString().split('T')[0],
      librarianNote
    });
    return true;
  }
};

export default bookSuggestionService;
