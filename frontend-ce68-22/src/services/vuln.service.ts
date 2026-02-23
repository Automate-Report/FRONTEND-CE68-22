import apiClient from "../lib/api-client";
import { SummaryStatusVlun } from "../types/vuln";

export const vulnService = {

  cntByProjectId: async (projectId: number) => {
    const { data } = await apiClient.get<number>(`/vulns/cnt/${projectId}`);
    return data;
  },
  cntStatusByProjectId: async (projectId: number) => {
    const { data } = await apiClient.get<SummaryStatusVlun>(`/vulns/summary/status/${projectId}`);
    return data;
  },

};