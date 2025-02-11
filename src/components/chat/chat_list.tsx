import type React from "react";
import { useChatContext } from "./chat_context";
import type { Chat } from "./types";

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  onSelectChat,
  onCreateNewChat,
}) => {
  const { chats } = useChatContext();

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          type="button"
          onClick={onCreateNewChat}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          + New Chat
        </button>
      </div>

      {/* List of Chats */}
      <ul className="flex-1 overflow-y-auto">
        {chats.map((chat: Chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-medium">{chat.name}</div>
            <div className="text-sm text-gray-600">
              {chat.members.length === 1
                ? "(Private)"
                : `(${chat.members.length} members)`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
