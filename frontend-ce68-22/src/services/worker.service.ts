import axios from "axios";
import { CreateWorkerPayload, Worker } from "../types/worker";
import { PaginatedResult } from "../types/common";


// สร้าง Instance Axios (ควรย้ายไป lib/axios.ts ในอนาคต)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const workerService = {
  // รับค่า page และ size (กำหนด default ไว้กันเหนียว)
  getAll: async (page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none") => {
    
    // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;

    const { data } = await apiClient.get<PaginatedResult<Worker>>("/workers/all", {
      params: {
        page,
        size,
        sort_by: sortParam, // ชื่อต้องตรงกับ Backend (FastAPI)
        order: orderParam
      },
    });
    return data;
  },

  getById: async (id: number) =>{
    const { data } = await apiClient.get<Worker>(`/workers/${id}`);
    return data;
  },

  updateKey: async (workerId: number, accessKeyId:number) =>{
    const { data } = await apiClient.post<Worker>(`/workers/key`,
      {
        worker_id: workerId,
        access_key_id: accessKeyId
      }
    );
    return data;
  },

  create: async (payload: CreateWorkerPayload) => {
    const { data } = await apiClient.post("/workers/", payload);
    return data;
  },

  delete: async (id: number) => {
    // method delete ปกติจะไม่ return content
    await apiClient.delete(`/workers/${id}`);
  },


};