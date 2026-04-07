
import apiClient from "../lib/api-client";
import { PaginatedResult } from "../types/common";
import { SummaryInfoByWorker, GetJobByWorker } from "../types/job";


export const jobService = {
  getSummaryInfoByWorker: async (workerId: number, projectId: number) =>{
    const { data } = await apiClient.get<SummaryInfoByWorker>(`/jobs/summary/${workerId}?project_id=${projectId}`);
    return data;
  },
  getJobByWorker: async (projectId: number, workerId: number, page: number, size: number, sortBy?: string | null, sortOrder?: "asc" | "desc" | "none", search?: string | null, filter?: string | "ALL") =>{
    const orderParam = sortOrder === "none" ? undefined : sortOrder;
    const sortParam = sortBy || undefined;

    const { data } = await apiClient.get<PaginatedResult<GetJobByWorker>>(`/jobs/worker/${workerId}?project_id=${projectId}`, {
      params: {
        worker_id: workerId,
        page,
        size,
        sort_by: sortParam, // ชื่อต้องตรงกับ Backend (FastAPI)
        order: orderParam,
        search,
        filter
      },
    });
    return data;
  }
};