import { useState } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import LoadingDots from './LoadingDots';

interface ChatMessage {
  content: string;
  isAi: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // ユーザーメッセージを追加
    setMessages(prev => [...prev, { content, isAi: false }]);
    setIsLoading(true);

    try {
      // ここにAI応答の処理を実装
      await new Promise(resolve => setTimeout(resolve, 1000)); // デモ用の遅延
      setMessages(prev => [...prev, {
        content: "申し訳ありませんが、現在AIモデルは接続されていません。",
        isAi: true
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <LoadingDots />
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;