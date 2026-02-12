// src/lib/api-client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // เปิดรับ Cookie/Token
});

//ใส่ Interceptor ดัก Error (401) ที่นี่ที่เดียว จบครบทุก Service
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    const isLoginRequest = originalRequest.url?.includes("/auth/login");
    
    // ถ้าเจอ 401 และ "ไม่ใช่" การยิง Login ให้ค่อยสั่ง Redirect
    if (error.response?.status === 401 && !isLoginRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== "undefined") {
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;