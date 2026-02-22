
import apiClient from "../lib/api-client";
import { PaginatedResult } from "../types/common";
import { SummaryInfoByWorker, GetJobByWorker } from "../types/job";


export const jobService = {
  getSummaryInfoByWorker: async (workerId: number) =>{
    const { data } = await apiClient.get<SummaryInfoByWorker>(`/jobs/summary/${workerId}`);
    return data;
  },
  getJobByWorker: async (workerId: number) =>{
    const { data } = await apiClient.get<PaginatedResult<GetJobByWorker>>(`/jobs/worker/${workerId}`);
    return data;
  }
};