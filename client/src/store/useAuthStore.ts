import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create<{
  isAuthenticated: null | boolean;
  checkAuth: () => Promise<void>;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
}>((set) => ({
  isAuthenticated: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ isAuthenticated: res.data });
    } catch (e) {
      set({ isAuthenticated: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
