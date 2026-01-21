import axios from "axios";
import { AccessKey } from "../types/access_key";



// สร้าง Instance Axios (ควรย้ายไป lib/axios.ts ในอนาคต)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const accessKeyService = {

  getById: async (id: number) =>{
    const { data } = await apiClient.get<AccessKey>(`/access-keys/${id}`);
    return data;
  },

  getByWorkerId: async (workerId: number): Promise<AccessKey | null> => {
    try {
      const response = await apiClient.get<AccessKey>(`/access-keys/byWorkerId/${workerId}`);
      
      // 2. ถ้าเจอ Status 210 (หรือ 204) ให้คืนค่า null
      if (response.status === 210 || response.status === 204) {
        return null;
      }
      
      return response.data;
    } catch (error: any) {
      // (Optional) ถ้า Backend ส่ง 404 แล้วอยากให้ถือว่า "ไม่มีข้อมูล" (ไม่ใช่ Error)
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error; // Error อื่นๆ ให้โยนออกไปตามปกติ
    }
  },

  create: async () => {
    const { data } = await apiClient.post("/access-keys/");
    return data;
  },

  revoke: async (id: number) => {
    await apiClient.delete(`/access-keys/${id}`);
  }

};