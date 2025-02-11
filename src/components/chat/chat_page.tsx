import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { Message, sendMessage } from "~/lib/messaging";
import { ChatList } from "./chat_list";
import { ChatView } from "./chat_view";
import { CreateChat } from "./create_chat";
// ^ Example placeholder. Adjust to your actual wallet context import.

export const ChatPage: React.FC = () => {
  const [activeView, setActiveView] = useState<"list" | "create" | "view">(
    "list"
  );
  const { data: current_account, isLoading } = useQuery({
    queryKey: [Message.ACCOUNT],
    queryFn: () => sendMessage(Message.ACCOUNT, undefined),
  });
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  if (!isLoading && current_account === undefined) {
    window.location.hash = "add-options";
    return;
  }
  // Suppose your wallet context provides the user's publicKey
  const publicKey = current_account?.publicKey;

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setActiveView("view");
  };

  const handleCreateNewChat = () => {
    setActiveView("create");
  };

  const handleChatCreated = (newChatId: string) => {
    setSelectedChatId(newChatId);
    setActiveView("view");
  };

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-white">
      {activeView === "list" && (
        <ChatList
          onSelectChat={handleSelectChat}
          onCreateNewChat={handleCreateNewChat}
        />
      )}

      {activeView === "create" && (
        <CreateChat
          onBack={() => setActiveView("list")}
          onChatCreated={handleChatCreated}
        />
      )}

      {activeView === "view" && selectedChatId && publicKey && (
        <ChatView
          chatId={selectedChatId}
          onBack={() => setActiveView("list")}
          currentUserPublicKey={publicKey}
        />
      )}
    </div>
  );
};
