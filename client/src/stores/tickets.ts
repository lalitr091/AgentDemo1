import { create } from 'zustand';
import { Ticket, JiraIssue } from '@/types';

interface TicketsState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  filters: {
    site: string;
    priority: string;
    type: string;
    status: string;
  };
  isLoading: boolean;
  setTickets: (tickets: Ticket[]) => void;
  setSelectedTicket: (ticket: Ticket | null) => void;
  updateFilters: (filters: Partial<TicketsState['filters']>) => void;
  addTimelineEvent: (ticketId: string, event: any) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
}

export const useTicketsStore = create<TicketsState>((set, get) => ({
  tickets: [],
  selectedTicket: null,
  filters: {
    site: 'all',
    priority: 'all',
    type: 'all',
    status: 'all',
  },
  isLoading: false,

  setTickets: (tickets) => set({ tickets }),

  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  addTimelineEvent: (ticketId, event) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, timeline: [...ticket.timeline, event] }
          : ticket
      ),
      selectedTicket:
        state.selectedTicket?.id === ticketId
          ? { ...state.selectedTicket, timeline: [...state.selectedTicket.timeline, event] }
          : state.selectedTicket,
    })),

  updateTicket: (ticketId, updates) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      ),
      selectedTicket:
        state.selectedTicket?.id === ticketId
          ? { ...state.selectedTicket, ...updates }
          : state.selectedTicket,
    })),
}));
