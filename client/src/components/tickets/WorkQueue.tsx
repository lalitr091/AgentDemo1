import { useState, useEffect } from 'react';
import { RefreshCw, Clock, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTicketsStore } from '@/stores/tickets';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';

export function WorkQueue() {
  const {
    tickets,
    selectedTicket,
    filters,
    setTickets,
    setSelectedTicket,
    updateFilters,
  } = useTicketsStore();

  const { data: ticketsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/tickets'],
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  useEffect(() => {
    if (ticketsData?.tickets) {
      setTickets(ticketsData.tickets);
    }
  }, [ticketsData, setTickets]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-red-500';
      case 'P2':
        return 'bg-orange-500';
      case 'P3':
        return 'bg-blue-500';
      case 'P4':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'hardware':
        return 'bg-orange-500';
      case 'software':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.site !== 'all' && ticket.site !== filters.site) return false;
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
    if (filters.type !== 'all' && ticket.routing.track !== filters.type) return false;
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="w-1/2 border-r border-slate-700 flex flex-col">
      {/* Queue Header */}
      <div className="bg-surface-2 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Work Queue</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-white border-primary hover:bg-orange-600"
            >
              Auto Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-slate-400 hover:text-slate-300"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-3">
          <Select value={filters.site} onValueChange={(value) => updateFilters({ site: value })}>
            <SelectTrigger className="bg-slate-800 border-slate-600">
              <SelectValue placeholder="All Sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              <SelectItem value="ATL-1">ATL-1</SelectItem>
              <SelectItem value="DFW-2">DFW-2</SelectItem>
              <SelectItem value="LHR-1">LHR-1</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => updateFilters({ priority: value })}>
            <SelectTrigger className="bg-slate-800 border-slate-600">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="P1">P1</SelectItem>
              <SelectItem value="P2">P2</SelectItem>
              <SelectItem value="P3">P3</SelectItem>
              <SelectItem value="P4">P4</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.type} onValueChange={(value) => updateFilters({ type: value })}>
            <SelectTrigger className="bg-slate-800 border-slate-600">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="software">Software</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className={cn(
              "p-4 border-b border-slate-700 hover:bg-slate-800 cursor-pointer transition-colors",
              selectedTicket?.id === ticket.id && "bg-slate-800/50"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${getPriorityColor(ticket.priority)} rounded-full`} />
                <span className="font-medium text-slate-200">{ticket.id}</span>
                <span className={`${getPriorityColor(ticket.priority)} text-white text-xs px-2 py-0.5 rounded-full`}>
                  {ticket.priority}
                </span>
                <span className={`${getTrackColor(ticket.routing.track)} text-white text-xs px-2 py-0.5 rounded-full`}>
                  {ticket.routing.track === 'hardware' ? 'Hardware' : 'Software'}
                </span>
                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded">
                  {ticket.site}
                </span>
              </div>
              <span className="text-xs text-slate-500">{getTimeAgo(ticket.createdAt)}</span>
            </div>

            <h3 className="font-medium text-slate-200 mb-1">{ticket.subject}</h3>
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{ticket.ai.summary}</p>

            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span className="text-slate-400">{ticket.customerTier} Customer</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="text-slate-400">SLA: {getTimeAgo(ticket.sla.dueBy)} remaining</span>
              </div>
              {ticket.linkedJira && (
                <div className="flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3" />
                  <span className="text-slate-400">{ticket.linkedJira.key}</span>
                </div>
              )}
            </div>

            {/* AI Confidence */}
            <div className="mt-2 flex items-center space-x-2">
              <div className="bg-slate-700 rounded-full px-2 py-1">
                <span className="text-xs text-slate-300">
                  Intent: {ticket.ai.intent.charAt(0).toUpperCase() + ticket.ai.intent.slice(1)}
                </span>
                <span className="text-xs text-green-400 ml-1">
                  {Math.round(ticket.ai.confidence * 100)}%
                </span>
              </div>
              {ticket.routing.track === 'hardware' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-secondary hover:text-blue-400 h-auto p-0"
                >
                  Why Hardware?
                </Button>
              )}
              {ticket.policyFlags.p1_requires_approval && ticket.priority === 'P1' && (
                <div className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                  Pending Approval
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && !isLoading && (
          <div className="p-8 text-center text-slate-400">
            <p>No tickets match your current filters.</p>
          </div>
        )}

        {isLoading && (
          <div className="p-8 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
            <p className="text-slate-400">Loading tickets...</p>
          </div>
        )}
      </div>
    </div>
  );
}
