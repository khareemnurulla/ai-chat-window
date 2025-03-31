import noop from "lodash/noop";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface AppContextProps extends AppState {
  addMessage: (message: Message) => void;
  streamToLatestMessage: (content: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

const fallbackSetter = import.meta.env.DEV
  ? () => {
      throw new Error("AppContext.Provider is required for AppContext");
    }
  : noop;

export const AppContext = createContext<AppContextProps>({
  messages: [],
  isLoading: false,
  error: null,
  addMessage: fallbackSetter,
  streamToLatestMessage: fallbackSetter,
  setLoading: fallbackSetter,
  setError: fallbackSetter,
  clearMessages: fallbackSetter,
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
      addMessage,
      streamToLatestMessage,
      setLoading,
      setError,
      clearMessages,
    }),
    [messages, isLoading, error, addMessage, streamToLatestMessage, setLoading, setError, clearMessages]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
