const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-ai-secondary rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-ai-secondary rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-ai-secondary rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default LoadingDots;