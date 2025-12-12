import axios from "axios";
import { LoginPayload } from "../types/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const login = async (loginPayload: LoginPayload) => {
    const res = await api.post("/auth/login", loginPayload);
    return res.data;
};

export const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
};