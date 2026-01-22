import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types/auth";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            userNow: null,
            setUserNow: (user) => set({ userNow: user }),
            clearUser: () => set({ userNow: null }),
        }),
        {
            name: "auth-store",
        }
    )
);

