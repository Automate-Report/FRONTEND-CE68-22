import apiClient from "../lib/api-client";
import { CreateWorkerPayload, Worker } from "../types/worker";
import { PaginatedResult } from "../types/common";

export const workerService = {
  // รับค่า page และ size (กำหนด default ไว้กันเหนียว)
  getAll: async (projectId: number, page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none", search?: string | null, filter?: string | "ALL") => {
    
    // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;

    const { data } = await apiClient.get<PaginatedResult<Worker>>(`/workers/${projectId}/all`, {
      params: {
        project_id: projectId,
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

  getById: async (id: number, projectId: number) =>{
    const { data } = await apiClient.get<Worker>(`/workers/${id}?project_id=${projectId}`);
    return data;
  },

  reGenKey: async (workerId: number, projectId: number) =>{
    const { data } = await apiClient.post<Worker>(`/workers/regen-key/${workerId}?project_id=${projectId}`);
    return data;
  },

  create: async (payload: CreateWorkerPayload, project_id: number) => {
    const { data } = await apiClient.post(`/workers/${project_id}`, payload);
    return data;
  },

  edit: async (id: number, projectId: number, payload: CreateWorkerPayload) => {
      const { data } = await apiClient.put(`/workers/${id}?project_id=${projectId}`, payload);
      return data;
    },

  delete: async (id: number, projectId: number) => {
    // method delete ปกติจะไม่ return content
    await apiClient.delete(`/workers/${id}?project_id=${projectId}`);
  },

  download_worker: async (workerId: number, projectId: number, onProgress: (percent: number) => void) => {
    return apiClient.get(`workers/download/${workerId}?project_id=${projectId}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const total = progressEvent.total || 0;
        const current = progressEvent.loaded;
        if (total > 0) {
          const percentCompleted = Math.round((current * 100) / total);
          onProgress(percentCompleted); // ✅ ส่งเปอร์เซ็นต์กลับไป
        }
      },
    });
  },

  info: async (project_id: number) => {
    const { data } = await apiClient.get(`/workers/info/${project_id}`);
    return data;
  },

  unLink: async (workerId: number, projectId: number) => {
    const { data } = await apiClient.get(`/workers/unlink/${workerId}?project_id=${projectId}`);
    return data;
  },
  unLinkAll: async (projectId: number) => {
    const { data } = await apiClient.get(`/workers/unlink/all/${projectId}`);
    return data;
  },

  markAsDownloaded: async (workerId: number) => {
    // ส่ง Request ไปบอก Backend (จะใช้ POST หรือ PATCH ก็ได้ตามการออกแบบ API)
    return apiClient.post(`/workers/${workerId}/mark-downloaded`);
  },

};

    