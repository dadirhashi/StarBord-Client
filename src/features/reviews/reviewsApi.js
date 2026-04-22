import api from "../../shared/api/axiosInstance";

export const getReviews = (businessId) =>
  api.get("/Reviews", { params: { businessId } }).then((r) => r.data);

export const fetchGoogleReviews = (businessId) =>
  api.post(`/GoogleReviews/fetch/${businessId}`).then((r) => r.data);

export const respondToReview = (reviewId, content) =>
  api.post("/Responses", { reviewId, content }).then((r) => r.data);

export const getResponses = (reviewId) =>
  api.get("/Responses", { params: { reviewId } }).then((r) => r.data);