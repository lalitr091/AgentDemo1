import { Brain, FileSearch, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Ticket, TimelineEvent } from '@/types';

interface AgentActivityProps {
  ticket: Ticket;
}

export function AgentActivity({ ticket }: AgentActivityProps) {
  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'TriageAgent':
        return Brain;
      case 'LogAnalyzerAgent':
        return FileSearch;
      case 'SpareAgent':
        return Package;
      default:
        return Brain;
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'TriageAgent':
        return 'bg-primary';
      case 'LogAnalyzerAgent':
        return 'bg-yellow-500';
      case 'SpareAgent':
        return 'bg-blue-500';
      default:
        return 'bg-primary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (!ticket.timeline || ticket.timeline.length === 0) {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Agent Activity</h4>
        <div className="bg-slate-800 rounded-lg p-4 text-center text-slate-400">
          <p>No agent activity yet. Actions will appear here once processing begins.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">Agent Activity</h4>
      <div className="space-y-3">
        {ticket.timeline.map((event) => {
          const AgentIcon = getAgentIcon(event.agent);
          
          return (
            <div key={event.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 ${getAgentColor(event.agent)} rounded-full flex items-center justify-center flex-shrink-0`}>
                <AgentIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">{event.agent}</span>
                    <span className="text-xs text-slate-500">{getTimeAgo(event.timestamp)}</span>
                  </div>
                  <p className="text-sm text-slate-300">{event.message}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    {event.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-secondary hover:text-blue-400 h-auto p-0"
                      >
                        View Evidence →
                      </Button>
                    )}
                    {event.data?.confidence && (
                      <span className="text-xs text-slate-400">
                        Confidence: {Math.round(event.data.confidence * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
