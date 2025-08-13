import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Settings
} from 'lucide-react';

export default function Operations() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">Operations Dashboard</h1>
            <p className="text-slate-400">Team performance, SLA monitoring, and approval workflows</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Audit
            </Button>
            <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
              <Settings className="w-4 h-4 mr-2" />
              Policies
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-surface border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription>Average Time to Assignment</CardDescription>
              <CardTitle className="text-2xl text-slate-50">8.2min</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">-12% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription>Mean Time to Resolution</CardDescription>
              <CardTitle className="text-2xl text-slate-50">2.4hrs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">-28% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription>SLA Breach Risk</CardDescription>
              <CardTitle className="text-2xl text-slate-50">3.2%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-yellow-400">2 tickets at risk</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription>AI Acceptance Rate</CardDescription>
              <CardTitle className="text-2xl text-slate-50">91.3%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">+5% this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Board */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Team Board</span>
              </CardTitle>
              <CardDescription>Current workload by assignee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Chen', active: 5, pending: 2, aging: 1 },
                  { name: 'Mike Rodriguez', active: 3, pending: 1, aging: 0 },
                  { name: 'Alex Thompson', active: 7, pending: 3, aging: 2 },
                  { name: 'Priya Patel', active: 4, pending: 1, aging: 0 },
                ].map((member) => (
                  <div key={member.name} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-200">{member.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {member.active} active
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                        {member.pending} pending
                      </Badge>
                      {member.aging > 0 && (
                        <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                          {member.aging} aging
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Approvals Inbox */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Approvals Inbox</span>
                </div>
                <Badge className="bg-primary text-white">3 pending</Badge>
              </CardTitle>
              <CardDescription>P1 incidents and policy exceptions requiring approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 'ZD-14231',
                    type: 'P1 Hardware Incident',
                    description: 'Totes misrouted after firmware v3.18',
                    requestedBy: 'TriageAgent',
                    time: '2h ago',
                  },
                  {
                    id: 'ZD-14248',
                    type: 'P1 Bug Report',
                    description: 'AGV dock sensor malfunction',
                    requestedBy: 'TriageAgent',
                    time: '4h ago',
                  },
                  {
                    id: 'ZD-14250',
                    type: 'PII Data Processing',
                    description: 'Customer log contains sensitive information',
                    requestedBy: 'LogAnalyzerAgent',
                    time: '1h ago',
                  },
                ].map((approval) => (
                  <div key={approval.id} className="p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-slate-200">{approval.id}</span>
                          <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                            {approval.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300">{approval.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Requested by {approval.requestedBy} • {approval.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SLA Performance */}
        <Card className="bg-surface border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>SLA Performance</span>
            </CardTitle>
            <CardDescription>Service level agreement compliance and breach risk analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">96.8%</div>
                <div className="text-sm text-slate-400">P1 SLA Compliance</div>
                <div className="text-xs text-slate-500 mt-1">Target: 95%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">89.2%</div>
                <div className="text-sm text-slate-400">P2 SLA Compliance</div>
                <div className="text-xs text-slate-500 mt-1">Target: 90%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">98.5%</div>
                <div className="text-sm text-slate-400">P3/P4 SLA Compliance</div>
                <div className="text-xs text-slate-500 mt-1">Target: 95%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Quality */}
        <Card className="bg-surface border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Automation Quality Metrics</CardTitle>
            <CardDescription>AI agent performance and accuracy tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Suggestion Acceptance</span>
                  <span className="text-sm font-medium text-slate-200">91.3%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '91.3%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Rollback Rate</span>
                  <span className="text-sm font-medium text-slate-200">2.1%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '2.1%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Jira Handoff Quality</span>
                  <span className="text-sm font-medium text-slate-200">94.7%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '94.7%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
