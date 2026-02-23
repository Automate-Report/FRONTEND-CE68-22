import apiClient from "../lib/api-client";
import { SummaryStatusVlun, VulnIssue, VulnDetails } from "../types/vuln";
import { PaginatedResult } from "../types/common";

export const vulnService = {
  getAll: async (projectId: number, page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none", search?: string | null, filter?: string | "ALL") => {
    
    // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;

    const { data } = await apiClient.get<PaginatedResult<VulnIssue>>(`vulns/all/${projectId}`, {
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

  getById: async (vulnId: number) => {
    const { data } = await apiClient.get<VulnDetails>(`/vulns/${vulnId}`);
    return data;
  },

  cntByProjectId: async (projectId: number) => {
    const { data } = await apiClient.get<number>(`/vulns/cnt/${projectId}`);
    return data;
  },
  cntStatusByProjectId: async (projectId: number) => {
    const { data } = await apiClient.get<SummaryStatusVlun>(`/vulns/summary/status/${projectId}`);
    return data;
  },

};