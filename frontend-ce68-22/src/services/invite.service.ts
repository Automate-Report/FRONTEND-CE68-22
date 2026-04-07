import { Invite } from "../types/invite";
import apiClient from "../lib/api-client";

export const inviteService = {
    getInvitations: async () => {
        const { data } = await apiClient.get<Invite[]>("/invitations/all");
        return data;
    },
    acceptInvitation: async (project_id: number) => {
        const { data } = await apiClient.put(`/invitations/accept/${project_id}`);
        return data;
    },
    declineInvitation: async (project_id: number) => {
        const { data } = await apiClient.delete(`/invitations/decline/${project_id}`);
        return data;
    }
};