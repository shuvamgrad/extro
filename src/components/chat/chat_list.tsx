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
    <div className="flex flex-col w-full h-full bg-neutral-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-neutral-700">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          type="button"
          onClick={onCreateNewChat}
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
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
            onKeyUp={() => onSelectChat(chat.id)}
            className="p-3 border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer"
          >
            <div className="font-medium text-white">{chat.name}</div>
            <div className="text-sm text-gray-400">
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
