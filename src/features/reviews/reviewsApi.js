import axiosInstance from '../../shared/api/axiosInstance';

export const reviewsApi = {
  // Backend: GET /api/reviews/business/{businessId}
  getByBusiness: async (businessId) => {
    const { data } = await axiosInstance.get(`/api/reviews/business/${businessId}`);
    return data;
  },

  // Backend: GET /api/reviews/{reviewId}
  getById: async (id) => {
    const { data } = await axiosInstance.get(`/api/reviews/${id}`);
    return data;
  },
};