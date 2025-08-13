import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Shield, 
  Clock, 
  FileCheck, 
  Eye,
  Activity,
  Brain,
  FileSearch,
  Package
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface EvidencePackProps {
  runId: string;
}

export default function EvidencePack({ runId }: EvidencePackProps) {
  const { data: evidencePack, isLoading } = useQuery({
    queryKey: ['/api/evidence-packs', runId === 'latest' ? 'ZD-14231-001' : runId],
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400">Loading Evidence Pack...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const mockEvidencePack = {
    runId: 'ZD-14231-001',
    ticketId: 'ZD-14231',
    startedAt: '2025-01-13T10:15:00Z',
    finishedAt: '2025-01-13T12:30:00Z',
    steps: [
      {
        idx: 1,
        agent: 'TriageAgent',
        type: 'DECISION',
        input: 'Ticket classification and routing',
        output: 'Hardware incident with 91% confidence',
        latencyMs: 1250,
        tokensEst: 450,
      },
      {
        idx: 2,
        agent: 'TriageAgent',
        type: 'TOOL',
        input: 'Create Jira issue GO-1012',
        output: 'Successfully created with labels and priority mapping',
        latencyMs: 820,
        tokensEst: 200,
      },
      {
        idx: 3,
        agent: 'LogAnalyzerAgent',
        type: 'TOOL',
        input: 'Analyze conveyor-ctrl_2025-08-11.log',
        output: 'CRC mismatch errors detected, motor driver board replacement recommended',
        latencyMs: 15300,
        tokensEst: 1200,
      },
      {
        idx: 4,
        agent: 'SpareAgent',
        type: 'TOOL',
        input: 'Reserve MD-BRD-V2 from DFW-DC',
        output: 'Part reserved, ETA 2 business days',
        latencyMs: 450,
        tokensEst: 150,
      },
    ],
    approvals: [
      {
        actor: 'head@greyorange.com',
        role: 'Support Head',
        channel: 'Agent Mesh',
        decision: 'approved',
        at: '2025-01-13T10:20:00Z',
      },
    ],
    policies: {
      strictMode: false,
      p1NeedsApproval: true,
      piiRedaction: true,
    },
    rationale: {
      decisionTree: {
        keywords: ['firmware', 'totes', 'misrouted'],
        patterns: ['hardware_failure', 'routing_error'],
        confidence_factors: ['similar_tickets', 'keyword_match', 'priority_escalation'],
      },
      featuresUsed: ['keyword_analysis', 'similarity_search', 'priority_mapping'],
      similarTicketRefs: ['ZD-14001', 'ZD-14002', 'ZD-14003'],
    },
    attestation: {
      sha256: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      signedBy: 'Initializ Demo CA',
      version: 'v1.0',
    },
  };

  const pack = evidencePack || mockEvidencePack;

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

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const downloadEvidencePack = () => {
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence-pack-${pack.runId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50 flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <span>Evidence Pack: {pack.runId}</span>
            </h1>
            <p className="text-slate-400">
              Tamper-evident audit trail for ticket {pack.ticketId} • 
              Duration: {formatDuration(pack.startedAt, pack.finishedAt)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-slate-600 hover:bg-slate-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Replay Run
            </Button>
            <Button
              onClick={downloadEvidencePack}
              className="bg-primary hover:bg-orange-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
          </div>
        </div>

        {/* Attestation */}
        <Card className="bg-green-950/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center space-x-2">
              <FileCheck className="w-5 h-5" />
              <span>Cryptographic Attestation</span>
            </CardTitle>
            <CardDescription className="text-green-300">
              This evidence pack is tamper-evident and cryptographically signed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-green-300 mb-1">SHA-256 Hash</div>
                <div className="font-mono text-xs text-green-400 break-all bg-green-900/20 p-2 rounded">
                  {pack.attestation.sha256}
                </div>
              </div>
              <div>
                <div className="text-sm text-green-300 mb-1">Signed By</div>
                <div className="text-sm text-green-400">{pack.attestation.signedBy}</div>
              </div>
              <div>
                <div className="text-sm text-green-300 mb-1">Version</div>
                <div className="text-sm text-green-400">{pack.attestation.version}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50 flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Execution Timeline</span>
                </CardTitle>
                <CardDescription>Step-by-step agent actions and decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pack.steps.map((step) => {
                    const AgentIcon = getAgentIcon(step.agent);
                    
                    return (
                      <div key={step.idx} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 ${getAgentColor(step.agent)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <AgentIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-slate-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-slate-200">{step.agent}</span>
                                <Badge variant="outline" className="text-xs">
                                  {step.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-500">
                                {step.latencyMs}ms • ~{step.tokensEst} tokens
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-slate-400 mb-1">Input:</div>
                                <div className="text-sm text-slate-300 bg-slate-900 p-2 rounded font-mono">
                                  {step.input}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-400 mb-1">Output:</div>
                                <div className="text-sm text-slate-300 bg-slate-900 p-2 rounded font-mono">
                                  {step.output}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata & Rationale */}
          <div className="space-y-6">
            {/* Approvals */}
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Approvals</CardTitle>
                <CardDescription>Human oversight and governance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pack.approvals.map((approval, index) => (
                    <div key={index} className="p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="bg-green-500/20 text-green-400">
                          {approval.decision.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(approval.at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300">{approval.actor}</div>
                      <div className="text-xs text-slate-500">{approval.role} via {approval.channel}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Policy Context</CardTitle>
                <CardDescription>Active governance rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Strict Mode</span>
                    <Badge variant={pack.policies.strictMode ? "destructive" : "secondary"}>
                      {pack.policies.strictMode ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">P1 Approval Required</span>
                    <Badge variant={pack.policies.p1NeedsApproval ? "default" : "secondary"}>
                      {pack.policies.p1NeedsApproval ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">PII Redaction</span>
                    <Badge variant={pack.policies.piiRedaction ? "default" : "secondary"}>
                      {pack.policies.piiRedaction ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decision Rationale */}
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Decision Rationale</CardTitle>
                <CardDescription>AI reasoning and evidence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-slate-300 mb-2">Features Used</div>
                  <div className="flex flex-wrap gap-1">
                    {pack.rationale.featuresUsed.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="bg-slate-700" />
                
                <div>
                  <div className="text-sm font-medium text-slate-300 mb-2">Similar Tickets</div>
                  <div className="space-y-1">
                    {pack.rationale.similarTicketRefs.map((ticket, index) => (
                      <div key={index} className="text-xs text-slate-400 font-mono">{ticket}</div>
                    ))}
                  </div>
                </div>
                
                <Separator className="bg-slate-700" />
                
                <div>
                  <div className="text-sm font-medium text-slate-300 mb-2">Decision Tree</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Keywords: {pack.rationale.decisionTree.keywords.join(', ')}</div>
                    <div>Patterns: {pack.rationale.decisionTree.patterns.join(', ')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
