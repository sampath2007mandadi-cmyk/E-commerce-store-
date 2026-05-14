import axios from "axios";
import { auth } from "../config/firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Auto-attach Firebase token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Products
export const getProducts = (params) => api.get("/products", { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Orders
export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my");
export const getAllOrders = (params) => api.get("/orders", { params });
export const updateOrderStatus = (id, status, trackingId) => api.put(`/orders/${id}/status`, { status, trackingId });
export const checkDelivery = (data) => api.post("/orders/check-delivery", data);

// Payments
export const createRazorpayOrder = (amount) => api.post("/payments/create-order", { amount });
export const verifyPayment = (data) => api.post("/payments/verify", data);

// Admin
export const getDashboard = () => api.get("/admin/dashboard");
export const getSettings = () => api.get("/admin/settings");
export const updateStoreSettings = (data) => api.put("/admin/settings/store", data);
export const updateDeliverySettings = (data) => api.put("/admin/settings/delivery", data);
export const updateSocialSettings = (data) => api.put("/admin/settings/social", data);
