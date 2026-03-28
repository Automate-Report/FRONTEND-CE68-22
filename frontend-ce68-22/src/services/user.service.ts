import { PasswordPayload, UserProfileDisplay, UserProfileEdit } from "../types/user";
import apiClient from "../lib/api-client";


export const userService = {
    checkExist: async (email: string) => {
        const { data } = await apiClient.get<boolean>(`/user/check`, { params: { email } });
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

    updateEmail: async (newemail: string) => {
        const { data } = await apiClient.put(`/user/edit/email`, null, {
            params: { user_new_email: newemail }
        })
        return data;
    },

    updatePassword: async (payload: PasswordPayload) => {
        const { data } = await apiClient.put(`/user/edit/password`, payload)
        return data;
    },
};