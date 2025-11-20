import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import type { SignUpData, LoginData } from "../types/SignUpData";

interface AuthState {
  isAuthenticated: null | boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
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
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully!");
      set({ isAuthenticated: true });
    } catch (e) {
      set({ isAuthenticated: false });
      toast.error(e instanceof Error ? e.message : "Signup failed.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ isAuthenticated: true });
      toast.success("Logged in successfully.");
    } catch (e) {
      set({ isAuthenticated: false });
      toast.error("Unable to login.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ isAuthenticated: false });
      toast.success("Logged out successfully.");
    } catch (e) {
      toast.error("Failed to logout.");
    }
  },
}));
