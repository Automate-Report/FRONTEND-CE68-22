import axios from "axios";
import { LoginPayload, RegisterPayload } from "../types/auth";
import apiClient from "../lib/api-client";

export const login = async (loginPayload: LoginPayload) => {
    const res = await apiClient.post("/auth/login", loginPayload);
    return res.data;
};

export const register = async (registerPayload: RegisterPayload) => {
    const res = await apiClient.post("/auth/register", registerPayload);
    return res.data;
}

export const logout = async () => {
    const res = await apiClient.post("/auth/logout");
    return res.data;
};

export const getMe = async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
};

export const isAuthen = async () => {
    try {
        await apiClient.get("/auth/me");
        return true;
    } catch {
        return false;
    }
};