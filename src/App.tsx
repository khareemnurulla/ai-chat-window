import MessageThread from "./components/MessageThread";
import InputArea from "./components/InputArea";
import { useAppContext } from "./context/AppContext";

function App() {
  const { isLoading, error, clearMessages } = useAppContext();

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-medium text-gray-800">AI Chat Window</h1>
        <button 
          className="text-gray-600 hover:text-gray-800 px-4 py-1 rounded-full border border-gray-300 text-sm"
          onClick={clearMessages}
        >
          Clear chat
        </button>
      </header>

      <main className="flex-1 relative">
        <MessageThread />

        {isLoading && (
          <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm z-20">
            Processing...
          </div>
        )}

        {error && (
          <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm z-20">
            {error}
          </div>
        )}
      </main>

      <InputArea />
    </div>
  );
}

export default App;
