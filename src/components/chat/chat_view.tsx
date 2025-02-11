import type React from "react";
import { useMemo, useState } from "react";
import { useChatContext } from "./chat_context";
import type { ChatMessage } from "./types";

interface ChatViewProps {
  chatId: string;
  onBack: () => void;
  currentUserPublicKey: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chatId,
  onBack,
  currentUserPublicKey,
}) => {
  const { chats, addMessage } = useChatContext();
  const [messageContent, setMessageContent] = useState("");

  // Find the chat by ID
  const chat = useMemo(
    () => chats.find((c) => c.id === chatId),
    [chats, chatId]
  );

  if (!chat) {
    return (
      <div className="flex flex-col w-full h-full p-3">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 mb-2"
        >
          &larr; Back
        </button>
        <p className="text-red-500">Chat not found.</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (messageContent.trim() === "") return;
    addMessage(chat.id, currentUserPublicKey, messageContent.trim());
    setMessageContent("");
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 mr-2"
        >
          &larr; Back
        </button>
        <h3 className="text-lg font-semibold">{chat.name}</h3>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {chat.messages.map((msg: ChatMessage) => {
          const isCurrentUser = msg.sender === currentUserPublicKey;
          return (
            <div
              key={msg.id}
              className={`mb-3 p-2 max-w-[60%] rounded ${
                isCurrentUser ? "ml-auto bg-green-100" : "mr-auto bg-gray-100"
              }`}
            >
              <div className="text-xs text-gray-600 mb-1">
                {isCurrentUser ? "You" : `${msg.sender.slice(0, 6)}...`}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <div className="flex p-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};
