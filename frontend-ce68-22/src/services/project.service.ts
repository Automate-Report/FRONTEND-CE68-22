import axios from "axios";
import { Project } from "../types/project";

// สร้าง Instance Axios (ควรย้ายไป lib/axios.ts ในอนาคต)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const projectService = {
  getAll: async () => {
    // ยิง GET ไปที่ http://localhost:8000/projects/
    const { data } = await apiClient.get<Project[]>("/projects/all");
    return data;
  },
};