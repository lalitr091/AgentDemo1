import { Search, Command, MessageCircle, Cpu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';
import { useLocation } from 'wouter';

export function Header() {
  const { user, logout } = useAuthStore();
  const { toggleChat } = useChatStore();
  const [, setLocation] = useLocation();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'engineer':
        return 'bg-blue-500';
      case 'head':
        return 'bg-green-500';
      case 'exec':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'engineer':
        return 'Engineer';
      case 'head':
        return 'Head';
      case 'exec':
        return 'Exec';
      default:
        return 'User';
    }
  };

  return (
    <header className="bg-surface border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Initializ Agent Mesh Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">Initializ Agent Mesh</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">First-Action Worker</span>
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">
                GO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search tickets, agents... (Press /)"
            className="bg-slate-800 border-slate-600 w-80 pl-10 pr-8 focus:ring-primary focus:border-transparent"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <span className="absolute right-3 top-2.5 text-xs text-slate-500">/</span>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-300"
            title="Command Palette (⌘K)"
          >
            <Command className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-300"
            title="Chat Copilot (?)"
            onClick={toggleChat}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2 hover:bg-slate-700">
                <div className={`w-6 h-6 ${getRoleColor(user?.role || '')} rounded-full flex items-center justify-center text-xs font-semibold text-white`}>
                  {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <span className="text-sm">{user?.email}</span>
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                  {getRoleLabel(user?.role || '')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-red-900 hover:text-red-300"
                onClick={() => {
                  logout();
                  setLocation('/auth/login');
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
