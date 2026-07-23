import api from './api';
import notificationService from './notificationService';

const today = () => new Date().toISOString().split('T')[0];

export const FINE_AMOUNTS = {
  overduePerDay: 2000,
  damaged: 50000,
  lost: 150000
};

const getMember = async (memberId) => (await api.get(`/members/${memberId}`)).data;

const fineService = {
  getAllFines: async () => (await api.get('/fines')).data,

  getFinesByMemberId: async (memberId) =>
    (await api.get(`/fines?memberId=${memberId}`)).data,

  getUnpaidFinesByMemberId: async (memberId) =>
    (await api.get(`/fines?memberId=${memberId}&status=unpaid`)).data,

  syncMemberBorrowingStatus: async (memberId) => {
    const unpaidFines = await fineService.getUnpaidFinesByMemberId(memberId);
    const unpaidFineAmount = unpaidFines.reduce((sum, fine) => sum + Number(fine.amount || 0), 0);
    const borrowingStatus = unpaidFineAmount > 0 ? 'blocked' : 'active';

    await api.patch(`/members/${memberId}`, {
      borrowingStatus,
      unpaidFineAmount,
      blockedReason: borrowingStatus === 'blocked' ? 'Còn phí phạt chưa thanh toán' : ''
    });

    return { borrowingStatus, unpaidFineAmount };
  },

  createFine: async ({
    memberId,
    borrowRecordId,
    bookId,
    type,
    amount,
    note = '',
    daysOverdue = 0
  }) => {
    const fine = (await api.post('/fines', {
      memberId,
      borrowRecordId,
      bookId,
      type,
      amount: Number(amount || 0),
      note,
      daysOverdue,
      status: 'unpaid',
      createdAt: today(),
      paidAt: null
    })).data;

    await fineService.syncMemberBorrowingStatus(memberId);
    await notificationService.createNotification({
      memberId,
      type: 'fine',
      title: 'Phát sinh phí phạt thư viện',
      message: `Bạn có khoản phạt ${Number(amount || 0).toLocaleString('vi-VN')}đ. Vui lòng thanh toán để được mượn sách tiếp.`
    });

    return fine;
  },

  payFine: async (fineId) => {
    const fine = (await api.get(`/fines/${fineId}`)).data;
    if (fine.status === 'paid') return fine;

    const paidFine = (await api.patch(`/fines/${fineId}`, {
      status: 'paid',
      paidAt: today()
    })).data;

    const status = await fineService.syncMemberBorrowingStatus(fine.memberId);
    if (status.borrowingStatus === 'active') {
      await notificationService.createNotification({
        memberId: fine.memberId,
        type: 'fine_paid',
        title: 'Tài khoản mượn sách đã hoạt động lại',
        message: 'Bạn đã thanh toán hết phí phạt và có thể tiếp tục đăng ký mượn sách.'
      });
    }

    return paidFine;
  },

  isMemberBlocked: async (memberId) => {
    const member = await getMember(memberId);
    if (member.borrowingStatus === 'blocked') return true;
    const unpaidFines = await fineService.getUnpaidFinesByMemberId(memberId);
    return unpaidFines.length > 0;
  }
};

export default fineService;
