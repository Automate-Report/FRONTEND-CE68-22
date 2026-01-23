import axios from "axios";
import { LoginPayload, RegisterPayload } from "../types/auth";

// const API = process.env.NEXT_PUBLIC_API_URL;
const API = "http://127.0.0.1:8000"

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const login = async (loginPayload: LoginPayload) => {
    const res = await api.post("/auth/login", loginPayload);
    return res.data;
};

export const register = async (registerPayload: RegisterPayload) => {
    const res = await api.post("/auth/register", registerPayload);
    return res.data;
}

export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
};

export const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const isAuthen = async () => {
    try {
        await api.get("/auth/me");
        return true;
    } catch {
        return false;
    }
};