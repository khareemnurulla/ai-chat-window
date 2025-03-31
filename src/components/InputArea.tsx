import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { callOpenRouterAPI } from "../services/api";

const InputArea = () => {
  const [input, setInput] = useState("");
  const { addMessage, streamToLatestMessage, setLoading, setError, isLoading } = useAppContext();

  const handleSend = async (prefix: string = "") => {
    if (isLoading) return;
    if (!input.trim()) return;

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    const prompt = prefix + input;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    addMessage(userMessage);

    const assistantMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: "" };
    addMessage(assistantMessage);

    setLoading(true);
    setInput("");

    try {
      await callOpenRouterAPI(
        prompt,
        apiKey,
        (content) => {
          streamToLatestMessage(content);
        },
        () => {
          setLoading(false);
        },
        (error) => {
          setError(error);
          setLoading(false);
        }
      );
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <textarea
        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
        rows={3}
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <div className="mt-2 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed mr-2"
          onClick={() => handleSend("Fix this sentence: ")}
          disabled={isLoading}
        >
          Fix
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          onClick={() => handleSend("Simplify this sentence: ")}
          disabled={isLoading}
        >
          Simplify
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default InputArea;
