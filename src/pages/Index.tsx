import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-ai-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-ai-foreground">
          AI チャットアシスタント
        </h1>
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;