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

  // Find the current chat
  const chat = useMemo(
    () => chats.find((c) => c.id === chatId),
    [chats, chatId]
  );

  if (!chat) {
    return (
      <div className="flex flex-col w-full h-full bg-neutral-900 text-white p-3">
        <button
          type="button"
          onClick={onBack}
          className="text-green-500 hover:text-green-400 mb-2"
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
    <div className="flex flex-col w-full h-full bg-neutral-900 text-white">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-neutral-700">
        <button
          type="button"
          onClick={onBack}
          className="text-green-400 hover:text-green-500 mr-2"
        >
          &larr; Back
        </button>
        <h3 className="text-lg font-semibold">{chat.name}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {chat.messages.map((msg: ChatMessage) => {
          const isCurrentUser = msg.sender === currentUserPublicKey;
          return (
            <div
              key={msg.id}
              className={`mb-3 p-2 max-w-[60%] rounded ${
                isCurrentUser
                  ? "ml-auto bg-green-600 text-white"
                  : "mr-auto bg-neutral-800 text-gray-200"
              }`}
            >
              <div className="text-xs text-gray-300 mb-1">
                {isCurrentUser ? "You" : `${msg.sender.slice(0, 6)}...`}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-right text-xs text-gray-200 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="flex p-3 border-t border-neutral-700">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-neutral-700 rounded bg-neutral-800 text-white placeholder-gray-400 focus:outline-none"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};
