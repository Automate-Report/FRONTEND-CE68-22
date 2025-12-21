import axios from "axios";
import { AccessKey } from "../types/access_key";



// สร้าง Instance Axios (ควรย้ายไป lib/axios.ts ในอนาคต)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const accessKeyService = {

  getById: async (id: number) =>{
    const { data } = await apiClient.get<AccessKey>(`/access-keys/${id}`);
    return data;
  },

  create: async () => {
    const { data } = await apiClient.post("/access-keys/");
    return data;
  },

};