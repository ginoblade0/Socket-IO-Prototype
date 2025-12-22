import { useEffect } from "react";
import useSound from "use-sound";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import ContactList from "./ContactList";
import SidebarTabs from "./SidebarTabs";
import notification from "../assets/sounds/notification.mp3";

const Sidebar = () => {
  const {
    refreshKey,
    activeTab,
    showOnlineOnly,
    isContactsLoading,
    setShowOnlineOnly,
    getContacts,
    getChats,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [play] = useSound(notification);

  useEffect(() => {
    getContacts();
    getChats();
    subscribeToMessages(play);
    return () => unsubscribeFromMessages();
  }, [
    refreshKey,
    getContacts,
    getChats,
    subscribeToMessages,
    unsubscribeFromMessages,
    play,
  ]);

  // [TODO] Update sidebar skeleton size (only users should be loading)

  if (isContactsLoading) return <SidebarSkeleton />;
  return (
    <aside
      className="hidden xs:flex h-full w-20 lg:w-72 border-r border-base-300
       flex-col transition-all duration-200"
    >
      <div className="border-b border-base-300 w-full sm:p-0 md:p-0 lg:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <SidebarTabs />
      <ContactList currentTab={`${activeTab}`} />
    </aside>
  );
};

export default Sidebar;
