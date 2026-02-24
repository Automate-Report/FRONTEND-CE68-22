import { Project, CreateProjectPayload, ProjectSummary } from "../types/project";
import { PaginatedResult } from "../types/common";
import { getMe } from "./auth.service";

import apiClient from "../lib/api-client";
import { Member, ChangeRole } from "../types/project";

export const projectService = {
  // รับค่า page และ size (กำหนด default ไว้กันเหนียว)
  getAll: async (page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none", search?: string | null, filter?: string | "ALL") => {

    
    // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;
    const getme = await getMe();


    const { data } = await apiClient.get<PaginatedResult<ProjectSummary>>("/projects/all", {
      params: {
        user_id: getme["user"],
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

  getById: async (id: number, customHeaders = {}) =>{
    const { data } = await apiClient.get<Project>(`/projects/${id}`, {headers: customHeaders});
    return data;
  },

  create: async (payload: CreateProjectPayload) => {
    const { data } = await apiClient.post("/projects/", payload);
    return data;
  },

  edit: async (id: number, payload: CreateProjectPayload) => {
    const { data } = await apiClient.put(`/projects/${id}`, payload);
    return data;
  },

  changeRole: async (projectId: number, payload: ChangeRole) => {
    const { data } = await apiClient.put(`/projects/change_role/${projectId}`, payload);
    return data;
  },

  getMember: async (projectId: number, page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none", search?: string | null, filter?: string | "ALL") => {
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;
    
    const { data } = await apiClient.get<PaginatedResult<Member>>(`/projects/members/${projectId}`, {
    
      params: {
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

  delete: async (id: number) => {
    // method delete ปกติจะไม่ return content
    await apiClient.delete(`/projects/${id}`);
  },

  deleteMember: async (projectId: number, userId: string) => {
    await apiClient.delete(`/projects/rel/${projectId}/${userId}`);
  }

};