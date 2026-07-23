import api from './api';

const today = () => new Date().toISOString().split('T')[0];

const notificationService = {
  getNotificationsByMemberId: async (memberId) =>
    (await api.get(`/notifications?memberId=${memberId}`)).data,

  createNotification: async ({ memberId, title, message, type = 'info' }) => {
    if (!memberId) return null;

    return (await api.post('/notifications', {
      memberId,
      title,
      message,
      type,
      read: false,
      createdAt: today()
    })).data;
  },

  markAsRead: async (id) =>
    (await api.patch(`/notifications/${id}`, { read: true })).data,
};

export default notificationService;
