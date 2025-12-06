import axios from "axios";
import { Project, CreateProjectPayload } from "../types/project";
import { PaginatedResult } from "../types/common";


// สร้าง Instance Axios (ควรย้ายไป lib/axios.ts ในอนาคต)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const projectService = {
  // รับค่า page และ size (กำหนด default ไว้กันเหนียว)
  getAll: async (page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none") => {
    
    // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;

    const { data } = await apiClient.get<PaginatedResult<Project>>("/projects/all", {
      params: {
        page,
        size,
        sort_by: sortParam, // ชื่อต้องตรงกับ Backend (FastAPI)
        order: orderParam,
      },
    });

    return data;
  },

  getById: async (id: number) =>{
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  create: async (payload: CreateProjectPayload) => {
    const { data } = await apiClient.post("/projects", payload);
    return data;
  },

};