import { 
  Inbox, 
  GitBranch, 
  Shield, 
  Plus, 
  Play,
  Settings,
  FileText,
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';

const agentStatuses = [
  { name: 'TriageAgent', status: 'active' as const },
  { name: 'LogAnalyzerAgent', status: 'processing' as const },
  { name: 'SpareAgent', status: 'idle' as const },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuthStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400';
      case 'processing':
        return 'bg-yellow-400';
      case 'idle':
        return 'bg-slate-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'processing':
        return 'Processing';
      case 'idle':
        return 'Idle';
      default:
        return 'Unknown';
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        href: `/mesh`,
        icon: GitBranch,
        label: 'Agent Mesh',
        badge: null,
        indicator: 'pulse',
      },
      {
        href: `/runs/latest`,
        icon: Shield,
        label: 'Evidence Packs',
        badge: null,
        indicator: null,
      },
    ];

    switch (user?.role) {
      case 'engineer':
        return [
          {
            href: `/engineer/work-queue`,
            icon: Inbox,
            label: 'Work Queue',
            badge: '12',
            indicator: null,
          },
          ...baseItems,
        ];
      case 'head':
        return [
          {
            href: `/head/operations`,
            icon: BarChart3,
            label: 'Operations',
            badge: null,
            indicator: null,
          },
          ...baseItems,
          {
            href: `/settings/policies`,
            icon: Settings,
            label: 'Policies',
            badge: null,
            indicator: null,
          },
        ];
      case 'exec':
        return [
          {
            href: `/exec/roi`,
            icon: BarChart3,
            label: 'ROI Dashboard',
            badge: null,
            indicator: null,
          },
          ...baseItems,
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="w-60 bg-surface border-r border-slate-700 p-4">
      <div className="space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Workspace
          </h3>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    location === item.href
                      ? "bg-slate-700 text-primary"
                      : "text-slate-300 hover:bg-slate-700"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.indicator === 'pulse' && (
                    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
                  )}
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Active Agents
          </h3>
          <div className="space-y-2">
            {agentStatuses.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center space-x-3 px-3 py-2 bg-slate-800 rounded-lg"
              >
                <div className={`w-2 h-2 ${getStatusColor(agent.status)} rounded-full`} />
                <span className="text-sm text-slate-300">{agent.name}</span>
                <span className="ml-auto text-xs text-slate-500">
                  {getStatusText(agent.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="justify-start w-full text-slate-300 hover:bg-slate-700"
            >
              <Plus className="w-4 h-4 mr-3" />
              <span className="text-sm">Create Jira (G)</span>
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-slate-300 hover:bg-slate-700"
            >
              <Play className="w-4 h-4 mr-3" />
              <span className="text-sm">Execute (E)</span>
            </Button>
            <Link href="/agentfile">
              <a className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Agentfile</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
