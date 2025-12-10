import { useChatStore } from "../store/useChatStore";

const ChatContactsTab = () => {
  const { activeTab, setActiveTab } = useChatStore();

  const getActiveTab = (e: string) => {
    return e === activeTab ? "tab-active" : "";
  };

  return (
    <div className="flex tabs tabs-border bg-transparent">
      <a
        role="tab"
        className={`flex-auto tab ${getActiveTab("recent")}`}
        onClick={() => setActiveTab("recent")}
      >
        Recent
      </a>
      <a
        role="tab"
        className={`flex-auto tab ${getActiveTab("contacts")}`}
        onClick={() => setActiveTab("contacts")}
      >
        Contacts
      </a>
    </div>
  );
};

export default ChatContactsTab;
