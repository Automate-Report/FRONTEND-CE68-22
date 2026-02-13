import axios from "axios";
import { ScheduleDisplay, ScheduleCreatePayload, ScheduleItem, JobDisplay } from "../types/schedule";
import { PaginatedResult } from "../types/common";

const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const scheduleService = {
    getAll: async (
        project_id: number,
        page: number, 
        size: number, 
        sortBy?: string | null, 
        sortOrder?: "asc" | "desc" | "none", 
        search?: string | null, 
        filter?: string | "ALL") => {

        // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
        const orderParam = sortOrder === "none" ? undefined : sortOrder;
        const sortParam = sortBy || undefined;

        const { data } = await api.get<PaginatedResult<ScheduleDisplay>>(`/schedule/all/${project_id}`, {
            params: {
                project_id,
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

    getByID: async (schedule_id: number) => {
        const { data } = await api.get<ScheduleItem>(`/schedule/${schedule_id}`);
        return data;
    },

    getJobByScheduleID: async (
        schedule_id: number,
        page: number, 
        size: number, 
        sortBy?: string | null, 
        sortOrder?: "asc" | "desc" | "none") => {

        // แปลงค่า sortOrder ให้เป็น string ที่ Backend เข้าใจ (ถ้าเป็น none ให้ส่ง undefined)
        const orderParam = sortOrder === "none" ? undefined : sortOrder;
        const sortParam = sortBy || undefined;

        const { data } = await api.get<PaginatedResult<JobDisplay>>(`jobs/schedule/${schedule_id}`, {
            params: {
                schedule_id,
                page,
                size,
                sort_by: sortParam, // ชื่อต้องตรงกับ Backend (FastAPI)
                order: orderParam,
            },
        });

        return data; 
    },

    create: async (payload: ScheduleCreatePayload) => {
        const { data } = await api.post("/schedule/create", payload);
        return data;
    },

    edit: async (schedule_id: number, payload: ScheduleCreatePayload) => {
        const { data } = await api.put(`/schedule/${schedule_id}/update`, payload);
        return data;
    },

    delete: async (schedule_id: number) => {
        // method delete ปกติจะไม่ return content
        await api.delete(`/schedule/${schedule_id}/delete`);
    }
};