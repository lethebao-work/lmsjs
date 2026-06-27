import api from './api';

const memberService = {
  getAllMembers: async () => (await api.get('/members')).data,
  getMemberByUserId: async (userId) => {
    const data = (await api.get(`/members?userId=${userId}`)).data;
    return data[0] || null; // trả về member hoặc null
  },
  createMember: async (data) => (await api.post('/members', data)).data,
  updateMember: async (id, data) => (await api.put(`/members/${id}`, data)).data,
  deleteMember: async (id) => { await api.delete(`/members/${id}`); return true; },
};

export default memberService;
