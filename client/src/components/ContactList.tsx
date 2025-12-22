import { BellOff, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import NoRecentChat from "./NoRecentChat";
import { useState } from "react";
import type { Contact } from "../types/auth-user";

interface ContactListProps {
  currentTab: string;
}

const ContactList = ({ currentTab }: ContactListProps) => {
  const { contacts, chats, showOnlineOnly, selectedUser, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const users = currentTab === "recent" ? chats : contacts;
  const filteredUsers = showOnlineOnly
    ? users.filter((contact) => onlineUsers.includes(contact._id))
    : users;
  const searchedItems = filteredUsers.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterMessage = () => {
    if (searchTerm.length !== 0 && searchedItems.length === 0) {
      if (currentTab === "recent") {
        return <p>User not found.</p>;
      } else if (currentTab === "contacts") {
        return <p>Contact not found.</p>;
      }
    } else if (filteredUsers.length === 0 && showOnlineOnly) {
      if (currentTab === "recent") {
        return <p>No users are online.</p>;
      } else if (currentTab === "contacts") {
        return <p>No online contacts.</p>;
      }
    } else if (filteredUsers.length === 0) {
      if (currentTab === "recent") {
        return <NoRecentChat />;
      } else if (currentTab === "contacts") {
        return <p>No contacts.</p>;
      }
    }
  };

  const messagePreview = (user: Contact) => {
    if (currentTab === "contacts") {
      return onlineUsers.includes(user._id) ? "Online" : "Offline";
    } else if (currentTab === "recent") {
      let message: string;
      if (user.lastMsg.length <= 20) {
        message = user.lastMsg;
      } else {
        message = user.lastMsg.substring(0, 20) + "...";
      }
      if (!user.isSender) {
        return "You: " + message;
      } else {
        return message;
      }
    }
  };

  return (
    <div className="relative h-full overflow-hidden py-3">
      {searchedItems.map((user) => (
        <button
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user.avatar || "/avatar.png"}
              alt={user.username}
              className="size-12 object-cover rounded-full"
            />
            {onlineUsers.includes(user._id) && (
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
              />
            )}
          </div>
          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium flex items-center gap-1">
              <span>{user.username}</span>
              {user.isMuted && <BellOff className="w-4 h-4 opacity-50" />}
            </div>
            <div className="text-sm text-zinc-400">{messagePreview(user)}</div>
          </div>
        </button>
      ))}
      <div className="flex items-center justify-center h-2/3 text-neutral-400 mb-1">
        {filterMessage()}
      </div>
      <div className="absolute bottom-0 w-full py-4 px-2">
        <label className="input rounded-lg">
          <Search className="opacity-50" />
          <input
            type="search"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default ContactList;
