interface AgentDetailProps {
  agentName: string;
}
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  FileSearch, 
  Package, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function AgentDetail({ agentName }: AgentDetailProps) {
  const [, setLocation] = useLocation();

  const getAgentInfo = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'triageagent':
        return {
          name: 'TriageAgent',
          type: 'Classifier',
          version: 'v2.1.3',
          icon: Brain,
          color: 'text-primary',
          description: 'Classifies tickets and routes to appropriate track',
          capabilities: ['ticket_classification', 'similarity_search', 'jira_creation', 'zendesk_updates'],
          tools: [
            {
              name: 'classifyTicket',
              description: 'Analyze ticket content and determine track (hardware/software)',
              usage: 'Called on every new ticket to determine routing',
              avgLatency: '1.2s',
              successRate: '94.2%'
            },
            {
              name: 'createJiraFromTicket', 
              description: 'Create Jira issue with mapped fields and labels',
              usage: 'Creates Jira issues after classification',
              avgLatency: '0.8s',
              successRate: '98.7%'
            }
          ],
          metrics: {
            totalInvocations: 1247,
            successRate: 94.2,
            avgLatency: 1050,
            todayInvocations: 23
          },
          recentActivity: [
            { time: '10:45 AM', action: 'Classified ZD-14231 as hardware (91% confidence)', status: 'success' },
            { time: '10:30 AM', action: 'Created Jira issue GO-1012 for hardware incident', status: 'success' },
            { time: '10:15 AM', action: 'Classified ZD-14230 as software (87% confidence)', status: 'success' },
            { time: '09:58 AM', action: 'Classification failed for ZD-14229 - insufficient context', status: 'error' }
          ]
        };
      case 'loganalyzeragent':
        return {
          name: 'LogAnalyzerAgent',
          type: 'Analyzer',
          version: 'v1.8.2',
          icon: FileSearch,
          color: 'text-yellow-500',
          description: 'Analyzes uploaded logs and extracts actionable insights',
          capabilities: ['log_parsing', 'error_detection', 'pattern_analysis', 'recommendation_generation'],
          tools: [
            {
              name: 'analyzeLog',
              description: 'Parse log file and identify error patterns',
              usage: 'Processes log files uploaded to hardware tickets',
              avgLatency: '15.3s',
              successRate: '89.1%'
            }
          ],
          metrics: {
            totalInvocations: 342,
            successRate: 89.1,
            avgLatency: 15300,
            todayInvocations: 8
          },
          recentActivity: [
            { time: '11:20 AM', action: 'Analyzed conveyor-ctrl_2025-08-11.log - CRC mismatch detected', status: 'success' },
            { time: '10:45 AM', action: 'Log analysis completed for GO-1012', status: 'success' },
            { time: '09:30 AM', action: 'Failed to parse malformed log file', status: 'error' }
          ]
        };
      case 'spareagent':
        return {
          name: 'SpareAgent',
          type: 'Inventory',
          version: 'v1.4.1',
          icon: Package,
          color: 'text-blue-500',
          description: 'Manages spare parts inventory and reservations',
          capabilities: ['inventory_lookup', 'part_reservation', 'eta_calculation', 'cross_site_logistics'],
          tools: [
            {
              name: 'recommendSpare',
              description: 'Recommend spare part based on findings',
              usage: 'Suggests parts for hardware replacements',
              avgLatency: '2.1s',
              successRate: '96.4%'
            },
            {
              name: 'reserveSpare',
              description: 'Reserve part and update inventory',
              usage: 'Books inventory for approved requests',
              avgLatency: '1.8s',
              successRate: '99.2%'
            }
          ],
          metrics: {
            totalInvocations: 156,
            successRate: 96.4,
            avgLatency: 1950,
            todayInvocations: 4
          },
          recentActivity: [
            { time: '11:25 AM', action: 'Reserved motor driver board (P/N: MDR-2048) from ATL-DC', status: 'success' },
            { time: '10:50 AM', action: 'Recommended spare part for GO-1012', status: 'success' },
            { time: '09:15 AM', action: 'Cross-site transfer initiated: DFW-DC → ATL-DC', status: 'success' }
          ]
        };
      default:
        return null;
    }
  };

  const agent = getAgentInfo(agentName || '');

  if (!agent) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-50 mb-4">Agent Not Found</h1>
            <Button onClick={() => setLocation('/mesh')} className="bg-primary hover:bg-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Agent Mesh
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const IconComponent = agent.icon;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/mesh')}
              className="text-slate-400 hover:text-slate-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mesh
            </Button>
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-8 h-8 ${agent.color}`} />
              <div>
                <h1 className="text-2xl font-semibold text-slate-50">{agent.name}</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">{agent.type}</span>
                  <Badge variant="outline">{agent.version}</Badge>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>

        <p className="text-slate-300 text-lg">{agent.description}</p>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-surface border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Invocations</p>
                  <p className="text-2xl font-bold text-slate-50">{agent.metrics.totalInvocations.toLocaleString()}</p>
                </div>
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">{agent.metrics.successRate}%</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Latency</p>
                  <p className="text-2xl font-bold text-slate-50">{agent.metrics.avgLatency > 1000 ? `${(agent.metrics.avgLatency / 1000).toFixed(1)}s` : `${agent.metrics.avgLatency}ms`}</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Today</p>
                  <p className="text-2xl font-bold text-slate-50">{agent.metrics.todayInvocations}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Capabilities & Tools */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Capabilities & Tools</CardTitle>
              <CardDescription>Available functions and their performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-slate-300 mb-3">Core Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div>
                <h4 className="font-medium text-slate-300 mb-3">Available Tools</h4>
                <div className="space-y-4">
                  {agent.tools.map((tool, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-slate-200">{tool.name}()</h5>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{tool.avgLatency}</Badge>
                          <Badge variant="outline" className="text-xs text-green-400">{tool.successRate}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{tool.description}</p>
                      <p className="text-xs text-slate-500">{tool.usage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Recent Activity</CardTitle>
              <CardDescription>Latest agent invocations and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agent.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}