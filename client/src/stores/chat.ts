import { create } from 'zustand';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  context: {
    currentRoute: string;
    selectedTicketId?: string;
    userRole?: string;
  };
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  minimizeChat: () => void;
  setContext: (context: Partial<ChatState['context']>) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: 'I can help you with ticket management, agent analysis, and system operations. What would you like to know?',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Explain why this ticket was classified as hardware',
        'Show me similar tickets',
        'Create a Jira issue for this ticket',
      ],
    },
  ],
  isOpen: true,
  isMinimized: false,
  isLoading: false,
  context: {
    currentRoute: '/',
  },

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  sendMessage: async (content: string) => {
    const { addMessage, context } = get();
    
    // Add user message
    addMessage({ role: 'user', content });
    
    set({ isLoading: true });

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context,
        }),
      });

      const data = await response.json();

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: data.response,
        suggestions: data.suggestions,
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleChat: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isMinimized: false,
    })),

  minimizeChat: () =>
    set({ isMinimized: true }),

  setContext: (newContext) =>
    set((state) => ({
      context: { ...state.context, ...newContext },
    })),

  clearMessages: () =>
    set({ messages: [] }),
}));
