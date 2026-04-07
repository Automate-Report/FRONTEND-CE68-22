import { PasswordPayload, UserProfileDisplay, UserProfileEdit } from "../types/user";
import apiClient from "../lib/api-client";


export const userService = {
    checkExist: async (email: string, project_id: number) => {
        const { data } = await apiClient.get<boolean>(`/user/check`, { params: { email, project_id } });
        return data;
    },

    getProfile: async () => {
        const { data } = await apiClient.get<UserProfileDisplay>(`/user/profile_display`);
        return data;
    },

    updateProfile: async (payload: UserProfileEdit) => {
        const { data } = await apiClient.put(`/user/edit/info`, payload)
        return data;
    },

    updatePassword: async (payload: PasswordPayload) => {
        const { data } = await apiClient.put(`/user/edit/password`, payload)
        return data;
    },
};