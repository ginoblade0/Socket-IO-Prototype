import { ArrowLeftToLine, Bell, BellOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, isSoundEnabled, setSelectedUser, toggleSound } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex gap-4">
        <button
          className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          onClick={() => setSelectedUser(null)}
        >
          <ArrowLeftToLine />
        </button>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.avatar || "/avatar.png"}
                alt={selectedUser.username}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.username}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button
          className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          onClick={() => toggleSound()}
        >
          {isSoundEnabled ? <Bell /> : <BellOff />}
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
