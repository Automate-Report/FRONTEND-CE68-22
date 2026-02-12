import { Tag } from "../types/tag";
import apiClient from "../lib/api-client";

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