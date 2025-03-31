import MessageThread from "./components/MessageThread";
import InputArea from "./components/InputArea";
import { useAppContext } from "./context/AppContext";

function App() {
  const { isLoading, error, clearMessages } = useAppContext();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">AI Chat Window</h1>
          <button className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600" onClick={clearMessages}>
            Clear
          </button>
        </div>
      </header>

      <MessageThread />

      {isLoading && (
        <div className="p-4 text-center">
          Loading...
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-500">
          Error: {error}
        </div>
      )}

      <InputArea />
    </div>
  );
}

export default App;
