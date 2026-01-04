import axios from "axios";
import { Asset, CreateAssetPayload } from "../types/asset";
import { PaginatedResult } from "../types/common";


// สร้าง Instance Axios (ควรย้ายไป lib/axios.ts ในอนาคต)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  proxy: false,
});

export const assetService = {
  // รับค่า page และ size (กำหนด default ไว้กันเหนียว)
  getAll: async (project_id: number, page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none", search?: string | null, filter?: string | "ALL") => {
    
    // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;

    const { data } = await apiClient.get<PaginatedResult<Asset>>(`/assets/all/${project_id}`, {
      params: {
        project_id,
        page,
        size,
        sort_by: sortParam, // ชื่อต้องตรงกับ Backend (FastAPI)
        order: orderParam,
        search,
        filter
      },
    });

    return data;
  },

  create: async (payload: CreateAssetPayload) => {
      const { data } = await apiClient.post("/assets/", payload);
      return data;
  },
 

};