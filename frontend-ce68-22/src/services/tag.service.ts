import axios from "axios";
import { Tag } from "../types/tag";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const tagService = {
    getAll: async () => {
      const { data } = await apiClient.get<Tag[]>(`/tags/all/`);
      return data;
    },

    getAllProjectId: async (projectId: number) => {
      const { data } = await apiClient.get<Tag[]>(`/tags/project/${projectId}`);
      return data;
    },

    getById: async (tagId: number) => {
      const { data } = await apiClient.get<Tag>(`/tags/${tagId}`);
      return data;
    },

    create: async (name: string) => {
        const { data } = await apiClient.post('/tags/', { name });
        return data;
    },
    
    delete: async (id: number) => {
    await apiClient.delete(`/tags/${id}`);
  }
};