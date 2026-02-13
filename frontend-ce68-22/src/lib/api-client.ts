import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // เปิดรับ Cookie/Token
});

let isRedirecting = false;

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // ป้องกันการทำงานซ้ำซ้อน
      if (!isRedirecting) {
        isRedirecting = true;
        window.location.href = "/login";
      }
      // คืนค่า Promise ที่ไม่จบ (Pending) เพื่อหยุด Logic ของคนเรียก
      return new Promise(() => {}); 
    }
    return Promise.reject(error);
  }
);

export default apiClient;