import api from './api';

const reviewService = {
  // Lấy danh sách đánh giá của 1 sách, kèm thông tin người đánh giá (expand member)
  getReviewsByBookId: async (bookId) => {
    try {
      const response = await api.get(`/reviews?bookId=${bookId}&_expand=member&_sort=createdAt&_order=desc`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // Tạo đánh giá mới
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', {
        ...reviewData,
        createdAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }
};

export default reviewService;
