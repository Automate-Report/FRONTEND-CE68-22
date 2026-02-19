import axios from "axios";


import apiClient from "../lib/api-client";

export const vulnService = {

  cntByProjectId: async (projectId: number) => {
    const { data } = await apiClient.get<number>(`/vulns/cnt/${projectId}`);
    return data;
  }

};