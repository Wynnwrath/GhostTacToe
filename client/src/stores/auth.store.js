import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (token, user) => {
        localStorage.setItem("auth-token", token);
        set({ token, user, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem("auth-token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      initialize: () => {
        const token = localStorage.getItem("auth-token");
        if (token) {
          set({ token, isAuthenticated: false });
        }
      },
    }),
    { name: "auth-store", partialize: (state) => ({ token: state.token }) }
  )
);
