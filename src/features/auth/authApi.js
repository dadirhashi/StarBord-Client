import api from "../../shared/api/axiosInstance";

export async function login(email, password) {
  const response = await api.post("/Auth/login", { email, password });
  return response.data;
}

export async function register(email, password) {
  const response = await api.post("/Auth/register", { email, password });
  return response.data;
}