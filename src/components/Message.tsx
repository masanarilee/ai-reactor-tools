interface MessageProps {
  content: string;
  isAi: boolean;
}

const Message = ({ content, isAi }: MessageProps) => {
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isAi
            ? 'bg-ai-primary text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

export default Message;