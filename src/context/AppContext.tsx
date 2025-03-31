import { noop } from "lodash";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ModelOption {
  key: string;
  label: string;
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectedModel: string;
  modelOptions: ModelOption[];
}

export interface AppContextProps extends AppState {
  addMessage: (message: Message) => void;
  streamToLatestMessage: (content: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  setSelectedModel: (model: string) => void;
}

const fallbackSetter = import.meta.env.DEV
  ? () => {
      throw new Error("AppContext.Provider is required for AppContext");
    }
  : noop;

const MODEL_OPTIONS: ModelOption[] = [
  {
    key: "google/gemini-2.5-pro-exp-03-25:free",
    label: "Google Gemini 2.5 Pro"
  },
  {
    key: "google/gemini-2.0-flash-exp:free",
    label: "Google Gemini 2.0 Flash"
  },
  {
    key: "openai/chatgpt-4o-latest",
    label: "ChatGPT 4o"
  },
  {
    key: "openai/gpt-4o-mini",
    label: "ChatGPT 4o mini"
  }
];

export const AppContext = createContext<AppContextProps>({
  messages: [],
  isLoading: false,
  error: null,
  selectedModel: MODEL_OPTIONS[0].key,
  modelOptions: MODEL_OPTIONS,
  addMessage: fallbackSetter,
  streamToLatestMessage: fallbackSetter,
  setLoading: fallbackSetter,
  setError: fallbackSetter,
  clearMessages: fallbackSetter,
  setSelectedModel: fallbackSetter,
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("AppContext was used outside of a AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_OPTIONS[0].key);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const streamToLatestMessage = (content: string) => {
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) {
        console.warn("No messages to stream to");
        return prevMessages;
      }
      const latestMessage = prevMessages[prevMessages.length - 1];
      const updatedMessage = { ...latestMessage, content: latestMessage.content + content };
      const updatedMessages = [...prevMessages.slice(0, prevMessages.length - 1), updatedMessage];
      return updatedMessages;
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const contextValue = useMemo(
    () => ({
      messages,
      isLoading,
      error,
      selectedModel,
      modelOptions: MODEL_OPTIONS,
      addMessage,
      streamToLatestMessage,
      setLoading,
      setError,
      clearMessages,
      setSelectedModel,
    }),
    [messages, isLoading, error, selectedModel, addMessage, streamToLatestMessage, setLoading, setError, clearMessages]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
