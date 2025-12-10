import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

interface ContactListProps {
  currentTab: string;
}

const ContactList = ({ currentTab }: ContactListProps) => {
  const { contacts, chats, showOnlineOnly, selectedUser, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const users = currentTab === "recent" ? chats : contacts;
  const filteredUsers = showOnlineOnly
    ? users.filter((contact) => onlineUsers.includes(contact._id))
    : users;

  return (
    <div className="overflow-hidden w-full py-3">
      {filteredUsers.map((user) => (
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
            <div className="font-medium truncate">{user.username}</div>
            <div className="text-sm text-zinc-400">
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </div>
          </div>
        </button>
      ))}

      {filteredUsers.length === 0 && (
        <div className="text-center text-zinc-500 py-4">No online contacts</div>
      )}
    </div>
  );
};

export default ContactList;
