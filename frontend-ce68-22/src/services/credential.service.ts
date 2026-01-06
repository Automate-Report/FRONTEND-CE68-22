import axios from "axios";
import { Credential, CreateCredentialPayload } from "../types/asset";


// สร้าง Instance Axios (ควรย้ายไป lib/axios.ts ในอนาคต)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  proxy: false,
});

export const credentialService = {

  getById: async (id: number) =>{
    const { data } = await apiClient.get<Credential>(`/credentials/${id}`);
    return data;
  },

  getByAssetId: async (assetId: number) =>{
    const { data } = await apiClient.get<Credential>(`/credentials/byAsset/${assetId}`);
    return data;
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