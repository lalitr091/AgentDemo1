export interface User {
  id: string;
  email: string;
  name: string;
  role: 'engineer' | 'head' | 'exec';
}

export interface Ticket {
  id: string;
  subject: string;
  body: string;
  site: 'ATL-1' | 'DFW-2' | 'LHR-1';
  customerTier: 'Gold' | 'Standard';
  channel: 'email' | 'web';
  language: string;
  createdAt: string;
  status: 'new' | 'open' | 'pending' | 'solved';
  assignee?: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  sla: {
    dueBy: string;
    breachRisk: number;
  };
  ai: {
    summary: string;
    intent: 'bug' | 'feature' | 'incident' | 'question';
    confidence: number;
    sentiment: number;
    similarTickets: string[];
  };
  routing: {
    track: 'software' | 'hardware';
    rationale: string;
    confidence: number;
  };
  suggestedAction: 'reply' | 'route' | 'knowledge' | 'create_jira';
  policyFlags: {
    contains_pii: boolean;
    external_impact: boolean;
    p1_requires_approval: boolean;
  };
  linkedJira?: {
    key: string;
    project: string;
  };
  timeline: TimelineEvent[];
}

export interface JiraIssue {
  key: string;
  project: string;
  summary: string;
  description: string;
  priority: string;
  status: string;
  assignee?: string;
  labels: string[];
  linkedTicketId?: string;
  createdAt: string;
  attachments: Attachment[];
  findings?: {
    rootCause: string;
    signals: string[];
    errorBursts: string[];
    recommendedAction: string;
    confidence: number;
  };
  spares?: {
    partNo: string;
    location: string;
    qtyReserved: number;
    eta: string;
  };
  history: any[];
}

export interface Attachment {
  name: string;
  size: number;
  type: string;
}

export interface EvidencePack {
  runId: string;
  ticketId: string;
  startedAt: string;
  finishedAt: string;
  steps: EvidenceStep[];
  approvals: Approval[];
  policies: {
    strictMode: boolean;
    p1NeedsApproval: boolean;
    piiRedaction: boolean;
  };
  rationale: {
    decisionTree: any;
    featuresUsed: string[];
    similarTicketRefs: string[];
  };
  attestation: {
    sha256: string;
    signedBy: string;
    version: string;
  };
}

export interface EvidenceStep {
  idx: number;
  agent: 'TriageAgent' | 'LogAnalyzerAgent' | 'SpareAgent';
  type: 'MSG' | 'TOOL' | 'DECISION';
  input: any;
  output: any;
  latencyMs: number;
  tokensEst: number;
}

export interface Approval {
  actor: string;
  role: string;
  channel: string;
  decision: 'approved' | 'rejected';
  at: string;
}

export interface SpareInventory {
  partNo: string;
  name: string;
  location: 'ATL-DC' | 'DFW-DC' | 'LHR-DC';
  qtyAvailable: number;
  leadDays: number;
  vendor: string;
}

export interface AuditLog {
  at: string;
  actor: string;
  role: string;
  action: string;
  details: any;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  agent: string;
  type: 'classification' | 'jira_creation' | 'log_analysis' | 'spare_reservation' | 'approval';
  message: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  data?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface AgentStatus {
  name: string;
  status: 'active' | 'processing' | 'idle';
  lastActivity?: string;
}
