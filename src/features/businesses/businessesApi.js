import api from "../../shared/api/axiosInstance";

export const getBusinesses = () =>
  api.get("/Businesses").then((r) => r.data);

export const getBusiness = (id) =>
  api.get(`/Businesses/${id}`).then((r) => r.data);

export const createBusiness = (data) =>
  api.post("/Businesses", data).then((r) => r.data);

export const updateBusiness = (id, data) =>
  api.put(`/Businesses/${id}`, data).then((r) => r.data);

export const deleteBusiness = (id) =>
  api.delete(`/Businesses/${id}`).then((r) => r.data);