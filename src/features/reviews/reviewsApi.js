import axiosInstance from '../../shared/api/axiosInstance';

export const reviewsApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/api/Reviews');
    return data;
  },

  getByBusiness: async (businessId) => {
    const { data } = await axiosInstance.get(`/api/Reviews/business/${businessId}`);
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/api/Reviews/${id}`);
    return data;
  },

  syncFromTrustpilot: async (businessId) => {
    const { data } = await axiosInstance.post(`/api/trustpilot/sync/${businessId}`);
    return data;
  },

  connectTrustpilot: async (businessId) => {
    const { data } = await axiosInstance.get(`/api/trustpilot/connect/${businessId}`);
    return data.authorizationUrl;
  },
};