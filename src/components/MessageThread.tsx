import { useAppContext } from "../context/AppContext";
import { useEffect, useRef } from "react";

const MessageThread = () => {
  const { messages } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pt-4 pb-40 space-y-4">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl py-2 px-4 ${message.role === "user" ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-200 text-gray-800 rounded-bl-md"}`}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
};

export default MessageThread;
