import { useState } from 'react';
import { ExternalLink, Upload, Shield, Repeat, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentActivity } from '../agents/AgentActivity';
import { useTicketsStore } from '@/stores/tickets';
import { Ticket } from '@/types';

export function TicketDetail() {
  const { selectedTicket } = useTicketsStore();

  if (!selectedTicket) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="text-lg">Select a ticket to view details</p>
          <p className="text-sm mt-2">Choose a ticket from the work queue to see full information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Detail Header */}
      <div className="bg-surface-2 p-6 border-b border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-slate-200">{selectedTicket.id}</h2>
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {selectedTicket.priority} {selectedTicket.ai.intent.charAt(0).toUpperCase() + selectedTicket.ai.intent.slice(1)}
              </span>
              <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
                {selectedTicket.routing.track === 'hardware' ? 'Hardware' : 'Software'}
              </span>
            </div>
            <h3 className="text-lg text-slate-300 mb-2">{selectedTicket.subject}</h3>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <span>{selectedTicket.site}</span>
              <span>•</span>
              <span>{selectedTicket.customerTier} Customer</span>
              <span>•</span>
              <span>Created {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600">
              View in Zendesk
            </Button>
            {selectedTicket.linkedJira && (
              <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600">
                View {selectedTicket.linkedJira.key}
              </Button>
            )}
            <Button className="bg-primary hover:bg-orange-600 text-white">
              Execute Action
            </Button>
          </div>
        </div>

        {/* Decision Rationale */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-slate-200">TriageAgent Decision Rationale</h4>
            <span className="text-xs text-green-400">
              {Math.round(selectedTicket.routing.confidence * 100)}% confidence
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Classification:</span>
              <span className="text-slate-200 ml-2">
                {selectedTicket.routing.track === 'hardware' ? 'Hardware' : 'Software'} → {selectedTicket.ai.intent.charAt(0).toUpperCase() + selectedTicket.ai.intent.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Similar Tickets:</span>
              <span className="text-slate-200 ml-2">{selectedTicket.ai.similarTickets.length} matches found</span>
            </div>
            <div>
              <span className="text-slate-400">Rationale:</span>
              <span className="text-slate-200 ml-2">{selectedTicket.routing.rationale}</span>
            </div>
            <div>
              <span className="text-slate-400">Sentiment:</span>
              <span className="text-slate-200 ml-2">
                {selectedTicket.ai.sentiment < 0 ? 'Negative' : selectedTicket.ai.sentiment > 0 ? 'Positive' : 'Neutral'}
                ({Math.round(selectedTicket.ai.sentiment * 100) / 100})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Description</h4>
          <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300 leading-relaxed">
            <p>{selectedTicket.body}</p>
          </div>
        </div>

        {/* Agent Activity Timeline */}
        <AgentActivity ticket={selectedTicket} />

        {/* Action Panel */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Available Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-primary hover:bg-orange-600 text-white border-primary p-3 h-auto justify-start"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Log File</span>
              </div>
              <p className="text-xs opacity-90 text-left">Attach system logs for analysis</p>
            </Button>
            
            <Button
              variant="outline"
              className="bg-secondary hover:bg-blue-600 text-white border-secondary p-3 h-auto justify-start"
            >
              <div className="flex items-center space-x-2 mb-1">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">View Jira Issue</span>
              </div>
              <p className="text-xs opacity-90 text-left">
                Open {selectedTicket.linkedJira?.key || 'new issue'} in new tab
              </p>
            </Button>
            
            <Button
              variant="outline"
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600 p-3 h-auto justify-start"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Evidence Pack</span>
              </div>
              <p className="text-xs opacity-90 text-left">Download tamper-evident audit trail</p>
            </Button>
            
            <Button
              variant="outline"
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600 p-3 h-auto justify-start"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Repeat className="w-4 h-4" />
                <span className="text-sm font-medium">Replay Run</span>
              </div>
              <p className="text-xs opacity-90 text-left">View complete agent interaction</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
