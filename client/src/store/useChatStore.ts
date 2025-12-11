import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { Contact } from "../types/auth-user";
import type { MessageData } from "../types/message-data";
import { useAuthStore } from "./useAuthStore";
import type { ChatState } from "../types/chat-state";

export const useChatStore = create<ChatState>()((set, get) => ({
  refreshKey: 0,
  contacts: [],
  chats: [],
  messages: [],
  activeTab: "recent",
  showOnlineOnly: false,
  selectedUser: null,
  isContactsLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("chat-sound") === "on" ? true : false,

  refreshRecentChat: () => {
    set({ refreshKey: get().refreshKey + 1 });
  },

  toggleSound: () => {
    const toggle = get().isSoundEnabled;
    localStorage.setItem("chat-sound", toggle === true ? "off" : "on");
    set({ isSoundEnabled: toggle === true ? false : true });
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
    if (tab === "recent") {
      get().refreshRecentChat();
    }
  },

  setShowOnlineOnly: (toggle: boolean) => set({ showOnlineOnly: toggle }),

  setSelectedUser: (selectedUser: Contact | null) => set({ selectedUser }),

  getContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ contacts: res.data });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load contacts.");
    } finally {
      set({ isContactsLoading: false });
    }
  },

  getChats: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load chats.");
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
      if (get().activeTab === "recent") {
        get().refreshRecentChat();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send message.");
    }
  },

  subscribeToUser: () => {
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

  unsubscribeFromUser: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.on("newUnreadMessage", () => {
        // TODO: Handle unread message notification (e.g., update unread count, refresh chat list)
      });
    }
  },
  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newUnreadMessage");
    }
  },
}));
