import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/stores/chat';
import { cn } from '@/lib/utils';

export function ChatCopilot() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isOpen,
    isMinimized,
    isLoading,
    sendMessage,
    toggleChat,
    minimizeChat,
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content?: string) => {
    const messageToSend = content || message;
    if (!messageToSend.trim()) return;

    await sendMessage(messageToSend);
    setMessage('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 w-80 bg-surface rounded-lg shadow-2xl border border-slate-600 animate-fade-in",
        isMinimized && "h-auto"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-slate-200">Chat Copilot</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={minimizeChat}
            className="text-slate-400 hover:text-slate-300 h-6 w-6 p-0"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={cn(
                      "rounded-lg p-3 text-sm",
                      msg.role === 'user'
                        ? "bg-primary text-white ml-6"
                        : "bg-slate-800 text-slate-300"
                    )}
                  >
                    <p>{msg.content}</p>
                  </div>
                  
                  {/* Suggestions */}
                  {msg.role === 'assistant' && msg.suggestions && (
                    <div className="mt-2 space-y-1">
                      {msg.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full justify-start text-xs text-secondary hover:text-blue-400 transition-colors h-auto p-1"
                        >
                          💡 {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Ask about this ticket..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-slate-800 border-slate-600 focus:ring-primary focus:border-transparent"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !message.trim()}
                className="bg-primary hover:bg-orange-600 text-white p-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
