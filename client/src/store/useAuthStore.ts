import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import type { AuthUser, Contact } from "../types/auth-user";
import type { LoginData, SignUpData } from "../types/form-data";

interface AuthState {
  authUser: AuthUser;
  isAuthenticated: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: Contact[];
  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (data: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  authUser: {
    _id: null,
    username: "",
    email: "",
    avatar: "",
    createdAt: "",
  },
  isAuthenticated: false,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ isAuthenticated: true, authUser: res.data });
    } catch (e) {
      // console.log(e instanceof Error ? e.message : "Auth check failed.");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignUpData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully!");
      set({ isAuthenticated: true, authUser: res.data });
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
      set({ isAuthenticated: true, authUser: res.data });
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

  updateAvatar: async (data: string) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-avatar", {
        avatar: data,
      });
      set({ authUser: res.data });
      toast.success("Avatar updated successfully.");
    } catch (e) {
      console.log(e instanceof Error ? e : "An unknown error occurred.");
      toast.error("Failed to update avatar.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
