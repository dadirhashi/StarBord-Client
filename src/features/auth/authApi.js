import axiosInstance from '../../shared/api/axiosInstance';

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/Auth/login', {
      email,
      password,
    });
    return response.data; // { token, user }
  },
};