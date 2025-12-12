import { create } from "zustand";
import { AuthState } from "../types/auth";

export const useAuthStore = create<AuthState>((set) => ({
    userNow: null,
    setUserNow: (user) => set({ userNow: user }),
    clearUser: () => set({ userNow: null }),
}));