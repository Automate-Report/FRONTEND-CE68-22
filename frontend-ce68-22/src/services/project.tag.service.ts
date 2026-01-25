import axios from "axios";
import { Tag } from "../types/tag";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  proxy: false,
});

export const projectTagService = {
    getAll: async (projectId: number) => {
        
        const { data } = await apiClient.get<Tag[]>(`/project-tags/all/${projectId}`);
        return data;
    },

    create: async (name: string, userId: string) => {
        const { data } = await apiClient.post('/project-tags/', { name, user_id: userId });
        return data;
    },
    
    delete: async (id: number) => {
    await apiClient.delete(`/project-tags/${id}`);
  }
};