import type { Contact } from "./auth-user";
import type { Message, MessageData } from "./message-data";

export interface ChatState {
  contacts: Contact[];
  chats: Contact[];
  messages: Message[];
  activeTab: string;
  showOnlineOnly: boolean;
  selectedUser: Contact | null;
  isContactsLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: string) => void;
  setShowOnlineOnly: (toggle: boolean) => void;
  setSelectedUser: (selectedUser: Contact | null) => void;
  getContacts: () => Promise<void>;
  getChats: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}
