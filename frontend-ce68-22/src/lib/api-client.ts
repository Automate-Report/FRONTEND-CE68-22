// src/lib/api-client.ts
import axios from "axios";

// 1. สร้าง Instance แค่ที่เดียว
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // เปิดรับ Cookie/Token
});

// 2. ใส่ Interceptor ดัก Error (401) ที่นี่ที่เดียว จบครบทุก Service
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // ดัก 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"; // ดีดไปหน้า Login
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;