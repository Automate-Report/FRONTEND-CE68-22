import axios from "axios";
import { Credential, CreateCredentialPayload } from "../types/asset";
import apiClient from "../lib/api-client";

export const assetCredentialService = {

  getById: async (id: number) =>{
    const { data } = await apiClient.get<Credential>(`/credentials/${id}`);
    return data;
  },

  getByAssetId: async (assetId: number) =>{
    const response = await apiClient.get<Credential>(`/credentials/byAsset/${assetId}`);
    if (response.status === 210){
      return null;
    }
    return response.data;
  },

  create: async (payload: CreateCredentialPayload) => {
    const { data } = await apiClient.post("/credentials/", payload);
    return data;
  },

  edit: async (id: number, payload: CreateCredentialPayload) => {
    const { data } = await apiClient.put(`/credentials/${id}`, payload);
    return data;
  },

  delete: async (id: number) => {
    // method delete ปกติจะไม่ return content
    await apiClient.delete(`/credentials/${id}`);
  },

};