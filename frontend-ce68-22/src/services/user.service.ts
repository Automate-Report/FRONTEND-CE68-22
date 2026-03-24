import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const userService = {
    checkExist: async (email: string) => {
        const { data } = await api.get<boolean>(`/user/check`,{ params: { email }});
        return data;
    },
};