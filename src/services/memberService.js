import api from './api';

const withBorrowingDefaults = (member) => ({
  ...member,
  borrowingStatus: member.borrowingStatus || 'active',
  unpaidFineAmount: Number(member.unpaidFineAmount || 0),
  blockedReason: member.blockedReason || ''
});

const memberService = {
  getAllMembers: async () => {
    const [membersRes, usersRes] = await Promise.all([
      api.get('/members'),
      api.get('/users')
    ]);
    const users = usersRes.data;
    return membersRes.data.map(m => {
      const user = users.find(u => u.id === m.userId);
      return withBorrowingDefaults({
        ...m,
        name: user?.fullname || 'N/A',
        email: user?.email || 'N/A'
      });
    });
  },
  getMemberByUserId: async (userId) => {
    const data = (await api.get(`/members?userId=${userId}`)).data;
    const m = data[0];
    if (!m) return null;
    const userRes = await api.get(`/users/${userId}`);
    return withBorrowingDefaults({ ...m, name: userRes.data?.fullname || 'N/A', email: userRes.data?.email || 'N/A' });
  },
  createMember: async (data) => (await api.post('/members', {
    ...data,
    borrowingStatus: data.borrowingStatus || 'active',
    unpaidFineAmount: Number(data.unpaidFineAmount || 0),
    blockedReason: data.blockedReason || ''
  })).data,
  updateMember: async (id, data) => (await api.patch(`/members/${id}`, data)).data,
  deleteMember: async (id) => { await api.delete(`/members/${id}`); return true; },
};

export default memberService;
