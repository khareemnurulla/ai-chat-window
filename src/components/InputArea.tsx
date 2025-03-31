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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSend("Fix this sentence: ")}
              disabled={isLoading}
            >
              Fix sentence
            </button>
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSend("Simplify this sentence: ")}
              disabled={isLoading}
            >
              Simplify
            </button>
          </div>
          <button
            className="px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
