import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatCopilot } from '../chat/ChatCopilot';
import { useGlobalKeyboardShortcuts } from '@/utils/keyboard';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  useGlobalKeyboardShortcuts();

  return (
    <div className="bg-slate-900 text-slate-50 min-h-screen">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      <ChatCopilot />
    </div>
  );
}
