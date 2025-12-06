import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { Contact } from "../types/auth-user";
import type { MessageData } from "../types/message-data";
import { useAuthStore } from "./useAuthStore";
import type { ChatState } from "../types/chat-state";

export const useChatStore = create<ChatState>()((set, get) => ({
  contacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isContactsLoading: false,
  isMessagesLoading: false,
  isSoundEnabled:
    localStorage.getItem("isSoundEnabled") === "yes" ? true : false,

  toggleSound: () => {
    const toggle = get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", toggle === true ? "" : "yes");
    set({ isSoundEnabled: toggle === true ? false : true });
  },

  setActiveTab: (tab: string) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser: Contact | null) => set({ selectedUser }),

  getContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ contacts: res.data });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load Users.");
    } finally {
      set({ isContactsLoading: false });
    }
  },

  getChats: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ contacts: res.data });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load Users.");
    } finally {
      set({ isContactsLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load Messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected.");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send message.");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        if (newMessage.sender !== selectedUser._id) return;
        set({ messages: [...get().messages, newMessage] });
      });
    }
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },
}));
