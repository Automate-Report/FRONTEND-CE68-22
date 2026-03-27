import { UserProfileDisplay } from "../types/user";
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
};