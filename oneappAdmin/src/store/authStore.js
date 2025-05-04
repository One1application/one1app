import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isloading: false,
  user: null,
  isAuthenticated: false,
  setLoading: (isLoading) => set({ isloading: isLoading }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
