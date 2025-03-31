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
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-2 rounded-lg py-2 px-3 shadow-md ${message.role === "user" ? "bg-blue-100 text-blue-800 ml-auto w-fit" : "bg-gray-100 text-gray-800 mr-auto w-fit"}`}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {message.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageThread;
