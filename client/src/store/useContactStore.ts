import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "./useChatStore";
import type { ContactState } from "../types/contact-state";

export const useContactStore = create<ContactState>()((set, get) => ({
  updateContactSettings: async () => {
    const contactId = useChatStore.getState().selectedUser?._id;
    const isSoundEnabled = useChatStore.getState().isSoundEnabled;

    try {
      await axiosInstance.post(`/users/update-contact-settings/${contactId}`, {
        isMuted: !isSoundEnabled,
        // nickname: undefined,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to Update Settings");
    }
  },
}));
