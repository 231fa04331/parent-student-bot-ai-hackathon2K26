import ChatbotWidget from "../components/ChatbotWidget";

const ChatbotPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 text-left">
        <h1 className="text-3xl font-bold text-secondary">Academic Assistant Chatbot</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ask questions like "What is my child attendance?" or "Any pending fees?"
        </p>
      </div>
      <ChatbotWidget />
    </div>
  );
};

export default ChatbotPage;
