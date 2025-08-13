import { useState } from 'react';
import { useLocation } from 'wouter';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Settings, 
  Activity, 
  FileText, 
  Network,
  Brain,
  FileSearch,
  Package,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const mockConversation = [
  {
    id: '1',
    agent: 'TriageAgent',
    timestamp: '2025-01-13T10:15:00Z',
    type: 'message',
    content: 'Processing ZD-14231: Totes misrouted after firmware v3.18. Classification in progress...',
    status: 'completed'
  },
  {
    id: '2',
    agent: 'TriageAgent',
    timestamp: '2025-01-13T10:16:30Z',
    type: 'tool_call',
    content: 'Called classifyTicket() with confidence 91%. Result: Hardware incident',
    status: 'completed',
    toolData: {
      input: { ticketId: 'ZD-14231', content: 'firmware v3.18 totes misrouted' },
      output: { track: 'hardware', confidence: 0.91, rationale: 'firmware + routing keywords' }
    }
  },
  {
    id: '3',
    agent: 'TriageAgent',
    timestamp: '2025-01-13T10:17:45Z',
    type: 'handoff',
    content: 'Created GO-1012, linked similar tickets. Handoff to LogAnalyzerAgent when logs available.',
    status: 'completed'
  },
  {
    id: '4',
    agent: 'LogAnalyzerAgent',
    timestamp: '2025-01-13T11:30:00Z',
    type: 'message',
    content: 'Received log file conveyor-ctrl_2025-08-11.log (18MB). Starting analysis...',
    status: 'processing'
  },
  {
    id: '5',
    agent: 'LogAnalyzerAgent',
    timestamp: '2025-01-13T11:32:15Z',
    type: 'tool_call',
    content: 'Called analyzeLog() - Found CRC mismatch patterns at 02:14 and 02:37',
    status: 'processing',
    toolData: {
      input: { logFile: 'conveyor-ctrl_2025-08-11.log', issueKey: 'GO-1012' },
      output: { errorBursts: ['02:14:23', '02:37:45'], rootCause: 'Motor driver board failure' }
    }
  },
  {
    id: '6',
    agent: 'SpareAgent',
    timestamp: '2025-01-13T12:15:00Z',
    type: 'message',
    content: 'Standby for spare part reservation based on LogAnalyzer findings...',
    status: 'pending'
  }
];

const mockTools = [
  {
    name: 'classifyTicket',
    agent: 'TriageAgent',
    calls: 3,
    avgLatency: '1.2s',
    lastUsed: '2 min ago'
  },
  {
    name: 'createJiraFromTicket',
    agent: 'TriageAgent',
    calls: 2,
    avgLatency: '0.8s',
    lastUsed: '5 min ago'
  },
  {
    name: 'analyzeLog',
    agent: 'LogAnalyzerAgent',
    calls: 1,
    avgLatency: '15.3s',
    lastUsed: 'Processing...'
  },
  {
    name: 'reserveSpare',
    agent: 'SpareAgent',
    calls: 0,
    avgLatency: '-',
    lastUsed: 'Never'
  }
];

export default function AgentMesh() {
  const [isRunning, setIsRunning] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [, setLocation] = useLocation();

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
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50 flex items-center space-x-3">
              <Network className="w-6 h-6" />
              <span>Agent Mesh Console</span>
            </h1>
            <p className="text-slate-400">Real-time collaboration between TriageAgent, LogAnalyzerAgent, and SpareAgent</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-sm text-slate-300">{isRunning ? 'Active' : 'Paused'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="border-slate-600 hover:bg-slate-700"
            >
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Replay
            </Button>
          </div>
        </div>

        {/* Agent Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card 
            className="bg-surface border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors"
            onClick={() => setLocation('/agents/triageagent')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-50">TriageAgent</h3>
                  <p className="text-sm text-slate-400">Classifier • v2.1.3</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">Classifies tickets and routes to appropriate track</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">1,247 invocations</span>
                <span className="text-green-400">94.2% success</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-surface border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors"
            onClick={() => setLocation('/agents/loganalyzeragent')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <FileSearch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-50">LogAnalyzerAgent</h3>
                  <p className="text-sm text-slate-400">Analyzer • v1.8.2</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">Analyzes uploaded logs and extracts actionable insights</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">342 invocations</span>
                <span className="text-green-400">89.1% success</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-surface border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors"
            onClick={() => setLocation('/agents/spareagent')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-50">SpareAgent</h3>
                  <p className="text-sm text-slate-400">Inventory • v1.4.1</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">Manages spare parts inventory and reservations</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">156 invocations</span>
                <span className="text-green-400">96.4% success</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conversation" className="space-y-6">
          <TabsList className="bg-surface border border-slate-700">
            <TabsTrigger value="conversation" className="data-[state=active]:bg-slate-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-slate-700">
              <Settings className="w-4 h-4 mr-2" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="trace" className="data-[state=active]:bg-slate-700">
              <Activity className="w-4 h-4 mr-2" />
              Trace
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="data-[state=active]:bg-slate-700">
              <FileText className="w-4 h-4 mr-2" />
              Artifacts
            </TabsTrigger>
            <TabsTrigger value="graph" className="data-[state=active]:bg-slate-700">
              <Network className="w-4 h-4 mr-2" />
              Graph
            </TabsTrigger>
          </TabsList>

          {/* Conversation Tab */}
          <TabsContent value="conversation">
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Agent Conversation</CardTitle>
                <CardDescription>Real-time message flow between collaborative agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {mockConversation.map((item) => {
                    const AgentIcon = getAgentIcon(item.agent);
                    
                    return (
                      <div key={item.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 ${getAgentColor(item.agent)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <AgentIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-slate-800 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span 
                                  className="text-sm font-medium text-slate-200 hover:text-primary cursor-pointer" 
                                  onClick={() => setLocation(`/agents/${item.agent.toLowerCase()}`)}
                                >
                                  {item.agent}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {item.type.replace('_', ' ')}
                                </Badge>
                              </div>
                              <span className="text-xs text-slate-500">{getTimeAgo(item.timestamp)}</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{item.content}</p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                              {item.toolData && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-secondary hover:text-blue-400 h-auto p-0"
                                  onClick={() => setSelectedTool(item.id)}
                                >
                                  View Details →
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools">
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Tool Usage</CardTitle>
                <CardDescription>Monitor agent tool calls and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockTools.map((tool) => (
                    <div key={tool.name} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-medium text-slate-200">{tool.name}()</span>
                          <Badge 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-slate-700"
                            onClick={() => setLocation(`/agents/${tool.agent.toLowerCase()}`)}
                          >
                            {tool.agent}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400">
                          {tool.calls} calls • Avg: {tool.avgLatency} • Last: {tool.lastUsed}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${tool.calls > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                          {tool.calls > 0 ? 'Active' : 'Unused'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trace Tab */}
          <TabsContent value="trace">
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Execution Trace</CardTitle>
                <CardDescription>OpenTelemetry-style timeline of agent operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { span: 'ticket.classify', duration: '1.2s', agent: 'TriageAgent', status: 'completed' },
                    { span: 'jira.create', duration: '0.8s', agent: 'TriageAgent', status: 'completed' },
                    { span: 'similarity.search', duration: '0.4s', agent: 'TriageAgent', status: 'completed' },
                    { span: 'log.analyze', duration: '15.3s', agent: 'LogAnalyzerAgent', status: 'processing' },
                    { span: 'spare.lookup', duration: '-', agent: 'SpareAgent', status: 'pending' },
                  ].map((span, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-slate-200">{span.span}</span>
                          <Badge variant="outline" className="text-xs">
                            {span.agent}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">{span.duration}</div>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(span.status)}`}>
                        {span.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artifacts Tab */}
          <TabsContent value="artifacts">
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Generated Artifacts</CardTitle>
                <CardDescription>Files, reports, and data generated during agent execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'GO-1012-creation.json', type: 'Jira Issue', size: '2.1 KB', agent: 'TriageAgent' },
                    { name: 'similarity-analysis.json', type: 'Analysis Report', size: '1.8 KB', agent: 'TriageAgent' },
                    { name: 'conveyor-ctrl_findings.json', type: 'Log Analysis', size: '12.4 KB', agent: 'LogAnalyzerAgent' },
                    { name: 'spare-reservation.json', type: 'Inventory Record', size: '0.9 KB', agent: 'SpareAgent' },
                  ].map((artifact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-200">{artifact.name}</div>
                          <div className="text-xs text-slate-500">{artifact.type} • {artifact.size}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {artifact.agent}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-secondary hover:text-blue-400">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Graph Tab */}
          <TabsContent value="graph">
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Agent Flow Graph</CardTitle>
                <CardDescription>Visual representation of agent interactions and data flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-slate-800 rounded-lg">
                  <div className="text-center text-slate-400">
                    <Network className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-lg font-medium">Agent Flow Visualization</p>
                    <p className="text-sm">Interactive graph showing ZD-14231 → GO-1012 workflow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
