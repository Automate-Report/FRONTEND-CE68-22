
import apiClient from "../lib/api-client";

import { SummaryInfoByWorker } from "../types/job";


export const jobService = {
  getSummaryInfoByWorker: async (workerId: number) =>{
    const { data } = await apiClient.get<SummaryInfoByWorker>(`/jobs/summary/${workerId}`);
    return data;
  }
};