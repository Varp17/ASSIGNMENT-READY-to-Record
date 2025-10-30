import axios from "axios";

// =======================
// Create API instance
// =======================
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ crucial for sending/receiving cookies (JWT)
});

// =======================
// Request interceptor: attach JWT (if localStorage token exists)
// =======================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// Response interceptor: global error handler
// =======================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized globally
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        console.warn("Session expired — redirecting to login...");
        // Optionally redirect to login
        // window.location.href = "/login";
      }

      console.error(
        `API Error (${error.response.status}):`,
        error.response.data?.message || error.message
      );
    } else {
      console.error("Network/Server Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// =======================
// AUTH APIs
// =======================
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const logout = () => API.post("/auth/logout");
export const getProfile = () => API.get("/auth/profile"); // ✅ your protected route

// =======================
// TASK APIs
// =======================
export const fetchTasks = () => API.get("/tasks");
export const createTask = (payload) => API.post("/tasks", payload);
export const updateTask = (id, payload) => API.put(`/tasks/${id}`, payload);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// =======================
// FILE upload helper
// =======================
export const uploadFile = (formData) =>
  API.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// =======================
// Default export
// =======================
export default API;
