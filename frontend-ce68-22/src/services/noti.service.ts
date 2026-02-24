import { Notification } from "../types/noti";
import apiClient from "../lib/api-client";

export const notiService = {
    getNoti: async (skip: number, limit: number, isUnread: boolean) => {
        const { data } = await apiClient.get<Notification[]>("/notification", {
            params: {
                skip,
                limit,
                isUnread
            }
        });
        return data;
    },

};