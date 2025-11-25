import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading } =
    useChatStore();

  const selectedUserId = selectedUser?._id;

  useEffect(() => {
    if (selectedUserId) {
      getMessages(selectedUserId);
    }
  }, [selectedUserId, getMessages]);

  if (isMessagesLoading) return <div>Loading . . .</div>;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <p>messages . . .</p>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
