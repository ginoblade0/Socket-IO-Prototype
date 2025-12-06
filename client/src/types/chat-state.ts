import type { Contact } from "./auth-user";
import type { MessageData } from "./message-data";

export interface ChatState {
  contacts: Contact[];
  chats: Contact[];
  messages: any[];
  activeTab: string;
  selectedUser: Contact | null;
  isContactsLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedUser: (selectedUser: Contact | null) => void;
  getContacts: () => Promise<void>;
  getChats: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}
