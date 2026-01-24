import axios from "axios";
import { Tag } from "../types/tag";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  proxy: false,
});

export const TagService = {
    getAll: async (userId: string) => {
        // 1. ดักจับค่าว่าง หรือ undefined หรือ null หรือ string ว่าง
        if (!userId || userId === "undefined" || userId === "null" || userId.trim() === "") {
            console.warn("TagService: Skipped fetching tags because userId is missing.");
            return []; // Return array ว่างทันที ไม่ต้องยิง API ให้เกิด 422
        }

        // 2. ถ้ารอดมาถึงตรงนี้ แสดงว่า userId มีค่าจริง ค่อยยิง
        const { data } = await apiClient.get<Tag[]>(`/tags/all/${userId}`);
        return data;
    },

    create: async (name: string, userId: string) => {
        const { data } = await apiClient.post('/tags/', { name, user_id: userId });
        return data;
    },
    delete: async (id: number) => {
    await apiClient.delete(`/tags/${id}`);
  }
};