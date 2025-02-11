import type React from "react";
import { type ReactNode, createContext, useContext, useState } from "react";
import type { Chat } from "./types";

interface ChatContextType {
  chats: Chat[];
  createChat: (name: string, members: string[]) => void;
  addMessage: (chatId: string, sender: string, content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const createChat = (name: string, members: string[]) => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name,
      members,
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    return newChat;
  };

  const addMessage = (chatId: string, sender: string, content: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          const newMessageId = crypto.randomUUID();
          const newMessage = {
            id: newMessageId,
            sender,
            content,
            timestamp: Date.now(),
          };
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      })
    );
  };

  return (
    <ChatContext.Provider value={{ chats, createChat, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
