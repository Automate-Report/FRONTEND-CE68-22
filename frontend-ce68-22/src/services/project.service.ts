import axios from "axios";
import { Project } from "../types/project";
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
  getAll: async (page: number = 1, size: number = 10) => {
    // เปลี่ยน Type การรับค่าเป็น PaginatedResponse<Project>
    const { data } = await apiClient.get<PaginatedResult<Project>>("/projects/all", {
      // Axios มี property 'params' ช่วยจัดการ Query String ให้ (ไม่ต้องพิมพ์ ?page=... เอง)
      params: {
        page: page,
        size: size,
      },
    });

    return data; 
  },

  getById: async (id: number) =>{
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  }

};