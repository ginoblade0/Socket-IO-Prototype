import type { Socket } from "socket.io-client";
import type { AuthUser } from "./auth-user";
import type { LoginData, SignUpData } from "../types/form-data";

export interface AuthState {
  authUser: AuthUser;
  isAuthenticated: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (data: string) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}
