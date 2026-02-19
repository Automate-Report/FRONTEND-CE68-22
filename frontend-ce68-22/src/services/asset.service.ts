import axios from "axios";
import { Asset, AssetNameAndId, CreateAssetPayload } from "../types/asset";
import { PaginatedResult } from "../types/common";

import apiClient from "../lib/api-client";

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

  getAllNameAndId: async (project_id: number) => {
    const { data } = await apiClient.get<AssetNameAndId[]>(`/assets/names/${project_id}`);
    return data;
  },

  getById: async (id: number) =>{
    const { data } = await apiClient.get<Asset>(`/assets/${id}`);
    return data;
  },

  create: async (payload: CreateAssetPayload) => {
    const { data } = await apiClient.post("/assets/", payload);
    return data;
  },
  edit: async (id: number, payload: CreateAssetPayload) => {
    const { data } = await apiClient.put(`/assets/${id}`, payload);
    return data;
  },
  
  delete: async (id: number) => {
    // method delete ปกติจะไม่ return content
    await apiClient.delete(`/assets/${id}`);
  },

  cntByProjectId: async (projectId: number) => {
    const { data } = await apiClient.get<number>(`/assets/cnt/${projectId}`);
    return data;
  }

};