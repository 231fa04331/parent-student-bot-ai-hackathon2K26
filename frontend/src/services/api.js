import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  verifyStudent: (payload) => api.post("/auth/verify-student", payload),
  sendOtp: (payload) => api.post("/auth/send-otp", payload),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  profile: () => api.get("/auth/profile"),
};

export const attendanceApi = {
  overall: (studentId) => api.get(`/attendance/overall/${studentId}`),
  subject: (studentId) => api.get(`/attendance/subject/${studentId}`),
  semester: (studentId) => api.get(`/attendance/semester/${studentId}`),
};

export const performanceApi = {
  cgpa: (studentId) => api.get(`/performance/cgpa/${studentId}`),
  semester: (studentId) => api.get(`/performance/semester/${studentId}`),
  marks: (studentId) => api.get(`/performance/marks/${studentId}`),
};

export const financeApi = {
  status: (studentId) => api.get(`/finance/status/${studentId}`),
  history: (studentId) => api.get(`/finance/history/${studentId}`),
};

export const notificationApi = {
  list: () => api.get("/notifications"),
};

export const facultyApi = {
  all: () => api.get("/faculty"),
  bySubject: (subject) => api.get(`/faculty/${encodeURIComponent(subject)}`),
};

export const chatbotApi = {
  query: (payload) => api.post("/chatbot/query", payload),
};

export default api;
