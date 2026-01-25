import axios from "axios";
import { ScheduleDisplay, ScheduleCreatePayload } from "../types/schedule";
import { create } from "domain";

const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const scheduleService = {
    getAll: async (page: number, 
        size: number, 
        sortBy?: string | null, 
        sortOrder?: "asc" | "desc" | "none", 
        search?: string | null, 
        filter?: string | "ALL") => {

        // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
        const orderParam = sortOrder === "none" ? undefined : sortOrder;
        const sortParam = sortBy || undefined;

        const { data } = await api.get<ScheduleDisplay[]>("/schedule/all", {
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

    getATKtype: async (schedule_id: number) => {
        const { data } = await api.get<string[]>(`/${schedule_id}/type`);
        return data;
    },

    create: async (payload: ScheduleCreatePayload) => {
        const { data } = await api.post("/create", payload);
        return data;
    },

    edit: async (schedule_id: number, payload: ScheduleCreatePayload) => {
        const { data } = await api.put(`/${schedule_id}/update`, payload);
        return data;
    },

    delete: async (schedule_id: number) => {
        // method delete ปกติจะไม่ return content
        await api.delete(`/${schedule_id}/delete`);
    }
};