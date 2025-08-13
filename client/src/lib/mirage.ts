import { createServer, Model, Factory, RestSerializer } from 'miragejs';
import { Ticket, JiraIssue, EvidencePack, SpareInventory, User } from '@/types';

export function makeServer(environment = 'development') {
  return createServer({
    environment,
    serializers: {
      application: RestSerializer,
    },
    models: {
      ticket: Model,
      jiraIssue: Model,
      evidencePack: Model,
      spareInventory: Model,
      user: Model,
      auditLog: Model,
    },
    factories: {
      ticket: Factory.extend({
        id: (i: number) => `ZD-${14230 + i}`,
        subject: 'Sample ticket subject',
        body: 'Sample ticket description',
        site: 'ATL-1',
        customerTier: 'Gold',
        channel: 'email',
        language: 'en',
        createdAt: () => new Date().toISOString(),
        status: 'open',
        priority: 'P1',
        sla: {
          dueBy: () => new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          breachRisk: 0.3,
        },
        ai: {
          summary: 'AI-generated summary',
          intent: 'incident',
          confidence: 0.91,
          sentiment: -0.7,
          similarTickets: ['ZD-14001', 'ZD-14002', 'ZD-14003'],
        },
        routing: {
          track: 'hardware',
          rationale: 'Keywords indicate hardware issue',
          confidence: 0.91,
        },
        suggestedAction: 'create_jira',
        policyFlags: {
          contains_pii: false,
          external_impact: true,
          p1_requires_approval: true,
        },
        linkedJira: {
          key: 'GO-1012',
          project: 'GO',
        },
        timeline: [],
      }),
    },
    seeds(server) {
      // Create users
      server.create('user', {
        id: '1',
        email: 'engineer@greyorange.com',
        name: 'Support Engineer',
        role: 'engineer',
      });
      server.create('user', {
        id: '2',
        email: 'head@greyorange.com',
        name: 'Support Head',
        role: 'head',
      });
      server.create('user', {
        id: '3',
        email: 'exec@greyorange.com',
        name: 'C-Level Executive',
        role: 'exec',
      });

      // Create golden path tickets
      server.create('ticket', {
        id: 'ZD-14231',
        subject: 'Totes misrouted after firmware v3.18',
        body: 'After updating our sorting system firmware to v3.18 this morning, we\'re experiencing critical issues with tote routing. Approximately 40% of totes are being sent to incorrect destinations, causing significant delays in our order fulfillment process.',
        site: 'ATL-1',
        customerTier: 'Gold',
        priority: 'P1',
        ai: {
          intent: 'incident',
          confidence: 0.91,
          sentiment: -0.7,
          summary: 'Critical routing issue after firmware update',
          similarTickets: ['ZD-14001', 'ZD-14002', 'ZD-14003'],
        },
        routing: {
          track: 'hardware',
          rationale: 'firmware, totes, misrouted keywords indicate hardware issue',
          confidence: 0.91,
        },
        linkedJira: {
          key: 'GO-1012',
          project: 'GO',
        },
        timeline: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            agent: 'TriageAgent',
            type: 'classification',
            message: 'Classified ticket as P1 Hardware Incident. Created Jira issue GO-1012 and linked 3 similar historical tickets.',
            status: 'completed',
            data: { confidence: 0.91 },
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            agent: 'LogAnalyzerAgent',
            type: 'log_analysis',
            message: 'Analyzed conveyor-ctrl_2025-08-11.log (18MB). Found CRC mismatch spikes at 02:14 and 02:37.',
            status: 'processing',
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            agent: 'SpareAgent',
            type: 'spare_reservation',
            message: 'Reserved Motor driver board v2 (MD-BRD-V2) from DFW-DC. ETA: 2 business days.',
            status: 'completed',
          },
        ],
      });

      server.create('ticket', {
        id: 'ZD-14248',
        subject: 'AGV dock sensor malfunction causing charging issues',
        body: 'Battery gauge readings inconsistent, preventing proper charging cycles. Multiple AGVs affected.',
        site: 'DFW-2',
        customerTier: 'Standard',
        priority: 'P1',
        ai: {
          intent: 'bug',
          confidence: 0.88,
          sentiment: -0.5,
          summary: 'AGV charging system malfunction',
          similarTickets: ['ZD-14010', 'ZD-14011'],
        },
        routing: {
          track: 'hardware',
          rationale: 'sensor, charging, hardware keywords',
          confidence: 0.88,
        },
        linkedJira: {
          key: 'GO-1013',
          project: 'GO',
        },
        timeline: [],
      });

      server.create('ticket', {
        id: 'ZD-14345',
        subject: 'Question about audit export functionality',
        body: 'Customer needs guidance on exporting audit logs for compliance reporting.',
        site: 'DFW-2',
        customerTier: 'Standard',
        priority: 'P3',
        ai: {
          intent: 'question',
          confidence: 0.95,
          sentiment: 0.2,
          summary: 'Customer inquiry about audit features',
          similarTickets: [],
        },
        routing: {
          track: 'software',
          rationale: 'question about software feature',
          confidence: 0.95,
        },
        suggestedAction: 'reply',
        timeline: [],
      });

      // Create spare inventory
      server.create('spareInventory', {
        partNo: 'MD-BRD-V2',
        name: 'Motor driver board v2',
        location: 'DFW-DC',
        qtyAvailable: 5,
        leadDays: 2,
        vendor: 'TechCorp',
      });

      server.create('spareInventory', {
        partNo: 'SENSOR-BATT-A1',
        name: 'Battery gauge sensor A1',
        location: 'ATL-DC',
        qtyAvailable: 3,
        leadDays: 1,
        vendor: 'SensorTech',
      });
    },
    routes() {
      this.namespace = 'api';

      // Auth routes
      this.post('/auth/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email });
        
        if (user && password === 'demo123') {
          return { user: user.attrs, token: 'mock-jwt-token' };
        }
        
        return { error: 'Invalid credentials' };
      });

      this.get('/auth/me', (schema) => {
        // Return current user based on token
        return schema.users.first();
      });

      // Ticket routes
      this.get('/tickets', (schema) => {
        return schema.tickets.all();
      });

      this.get('/tickets/:id', (schema, request) => {
        return schema.tickets.find(request.params.id);
      });

      this.patch('/tickets/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.tickets.find(id).update(attrs);
      });

      // Jira routes
      this.get('/jira/issues', (schema) => {
        return schema.jiraIssues.all();
      });

      this.post('/jira/issues', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.jiraIssues.create(attrs);
      });

      // Agent tools
      this.post('/tools/classify-ticket', (schema, request) => {
        const { ticketId } = JSON.parse(request.requestBody);
        return {
          track: 'hardware',
          confidence: 0.91,
          rationale: 'Keywords indicate hardware issue',
          similarTickets: ['ZD-14001', 'ZD-14002'],
        };
      });

      this.post('/tools/create-jira', (schema, request) => {
        const { ticketId } = JSON.parse(request.requestBody);
        const issueKey = `GO-${1012 + Math.floor(Math.random() * 100)}`;
        return {
          key: issueKey,
          project: 'GO',
          url: `https://greyorange.atlassian.net/browse/${issueKey}`,
        };
      });

      this.post('/tools/analyze-log', (schema, request) => {
        const { issueKey, logFile } = JSON.parse(request.requestBody);
        return {
          findings: {
            rootCause: 'CRC mismatch in motor driver board',
            signals: ['error_burst_02:14', 'error_burst_02:37'],
            errorBursts: ['02:14:23', '02:37:45'],
            recommendedAction: 'Replace Motor driver board v2',
            confidence: 0.87,
          },
        };
      });

      this.post('/tools/reserve-spare', (schema, request) => {
        const { partNo, location } = JSON.parse(request.requestBody);
        return {
          reservation: {
            partNo,
            location,
            qtyReserved: 1,
            eta: '2 business days',
            confirmationId: `RSV-${Date.now()}`,
          },
        };
      });

      // Evidence packs
      this.get('/evidence-packs/:runId', (schema, request) => {
        const runId = request.params.runId;
        return {
          runId,
          ticketId: 'ZD-14231',
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          finishedAt: new Date().toISOString(),
          steps: [
            {
              idx: 1,
              agent: 'TriageAgent',
              type: 'DECISION',
              input: 'Ticket classification request',
              output: 'Hardware incident classification',
              latencyMs: 1250,
              tokensEst: 450,
            },
          ],
          approvals: [],
          policies: {
            strictMode: false,
            p1NeedsApproval: true,
            piiRedaction: true,
          },
          rationale: {
            decisionTree: {},
            featuresUsed: ['keywords', 'similarity', 'priority'],
            similarTicketRefs: ['ZD-14001', 'ZD-14002'],
          },
          attestation: {
            sha256: 'abc123def456...',
            signedBy: 'Initializ Demo CA',
            version: 'v1',
          },
        };
      });

      // Spare inventory
      this.get('/inventory/spares', (schema) => {
        return schema.spareInventories.all();
      });

      // Chat
      this.post('/chat/message', (schema, request) => {
        const { message, context } = JSON.parse(request.requestBody);
        
        // Mock AI responses based on message content
        let response = "I can help you with that. Here are some suggestions:";
        let suggestions: string[] = [];

        if (message.includes('hardware')) {
          response = "This ticket was classified as hardware based on keywords like 'firmware', 'totes', and 'misrouted' which indicate physical system issues.";
          suggestions = [
            "Show me the decision rationale",
            "What were the similar tickets found?",
            "Create a Jira issue for this"
          ];
        } else if (message.includes('log')) {
          response = "I can analyze the uploaded log file. The system found CRC mismatch errors at timestamps 02:14 and 02:37.";
          suggestions = [
            "Show detailed log analysis",
            "Reserve replacement part",
            "Update Jira with findings"
          ];
        }

        return {
          response,
          suggestions,
          timestamp: new Date().toISOString(),
        };
      });

      // Policies
      this.get('/policies', () => {
        return {
          p1NeedsApproval: true,
          piiRedaction: true,
          confidenceThreshold: 0.8,
          maxAutoCreatesPerHour: 10,
          strictMode: false,
        };
      });

      this.patch('/policies', (schema, request) => {
        const updates = JSON.parse(request.requestBody);
        return updates;
      });
    },
  });
}
