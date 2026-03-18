import { Invite } from "../types/invite";
import apiClient from "../lib/api-client";

export const inviteService = {
    getInvitations: async () => {
        const { data } = await apiClient.get<Invite[]>("/invite/all");
        return data;
    },
};