// src/lib/api-client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // เปิดรับ Cookie/Token
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. ถ้าอยู่บน Server (Node.js) ให้โยน Error กลับไปเฉยๆ
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    // 2. ถ้าอยู่บน Browser (Client) ค่อยทำ Logic Redirect
    if (error.response?.status === 401 && !error.config.url.includes("/auth/login")) {
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default apiClient;