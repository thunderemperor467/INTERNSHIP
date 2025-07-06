// clients/src/services/api.js
import axios from "axios";

// CRA: set REACT_APP_API_BASE_URL in .env or fall back to localhost
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// auth
export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser    = (payload) => api.post("/auth/login", payload);

// Excel endpoints
export const uploadExcelFile = (formData) =>
  api.post("/excel/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getStats     = () => api.get("/excel/stats");
export const getChartData = () => api.get("/excel/chart-data");

// 👉 default export so pages can simply `import api from "../services/api"`
export default api;

