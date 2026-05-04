import axiosInstance from '../../shared/api/axiosInstance';

export const businessesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/api/Businesses');
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/api/Businesses/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await axiosInstance.post('/api/Businesses', payload);
    return data;
  },

  delete: async (id) => {
    await axiosInstance.delete(`/api/Businesses/${id}`);
  },
};