import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { LoginData, SignUpData } from "../types/form-data";
import type { AuthState } from "../types/auth-state";

const BASE_URL: string =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

export const useAuthStore = create<AuthState>()((set, get) => ({
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
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ isAuthenticated: true, authUser: res.data });
      get().connectSocket();
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
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
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

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, { query: { userId: authUser._id } });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (users: string[]) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
