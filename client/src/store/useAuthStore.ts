import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { SignUpData, LoginData } from "../types/SignUpData";

interface AuthState {
  isAuthenticated: null | boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  //   login: (data: LoginData) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
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

  signup: async (data: SignUpData) => {
    set({ isSigningUp: true });
    try {
      await axiosInstance.post("/auth/signup", data);
      set({ isAuthenticated: true });
    } catch (e) {
      set({ isAuthenticated: false });
    } finally {
      set({ isSigningUp: false });
    }
  },

  //   login: async (data: LoginData) => {
  //     set({ isLoggingIn: true });
  //     try {
  //       await axiosInstance.post("/auth/login", data);
  //       set({ isAuthenticated: true });
  //     } catch (e) {
  //       set({ isAuthenticated: false });
  //     } finally {
  //       set({ isLoggingIn: false });
  //     }
  //   },
}));
