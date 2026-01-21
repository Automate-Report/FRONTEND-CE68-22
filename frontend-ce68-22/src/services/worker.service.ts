import axios from "axios";
import { AxiosResponse } from "axios";

import { CreateWorkerPayload, DownloadReponse, Worker } from "../types/worker";
import { AccessKey } from "../types/access_key";
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
  
  genKey: async (workerId: number) =>{
    const { data } = await apiClient.post<AccessKey>(`/workers/gen-key/${workerId}`);
    return data;
  },

  removeKey: async (workerId: number) =>{
    const { data } = await apiClient.post<Worker>(`/workers/remove-key/${workerId}`);
    return data;
  },

  create: async (payload: CreateWorkerPayload) => {
    const { data } = await apiClient.post("/workers/", payload);
    return data;
  },

  edit: async (id: number, payload: CreateWorkerPayload) => {
      const { data } = await apiClient.put(`/workers/${id}`, payload);
      return data;
    },

  delete: async (id: number) => {
    // method delete ปกติจะไม่ return content
    await apiClient.delete(`/workers/${id}`);
  },

  download_worker: async (workerId: number): Promise<AxiosResponse<Blob>> =>{
    return apiClient.get<Blob>(`workers/download/${workerId}`,
      {
        responseType: "blob", // ขอเป็น Binary File
      }
    );
  }

};