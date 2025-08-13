import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Shield, 
  FileCheck,
  Download,
  Settings
} from 'lucide-react';
import { useState } from 'react';

export default function ROI() {
  const [automationLevel, setAutomationLevel] = useState([75]);
  const [teamSize, setTeamSize] = useState([12]);
  const [avgTicketValue, setAvgTicketValue] = useState([250]);
  const [strictMode, setStrictMode] = useState(false);

  // Calculate ROI metrics based on sliders
  const calculateROI = () => {
    const baseTickets = 1000;
    const automationFactor = automationLevel[0] / 100;
    const teamFactor = teamSize[0] / 10;
    const valueFactor = avgTicketValue[0] / 100;

    const monthlySavings = baseTickets * automationFactor * teamFactor * valueFactor * 0.35;
    const yearlyARR = monthlySavings * 12;
    const paybackMonths = 180000 / monthlySavings; // Assuming $180k implementation cost

    return {
      monthlySavings: Math.round(monthlySavings),
      yearlyARR: Math.round(yearlyARR),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
    };
  };

  const roi = calculateROI();

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">ROI Dashboard</h1>
            <p className="text-slate-400">Financial impact and governance oversight for Agent Mesh automation</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300">Strict Mode</span>
              <Switch 
                checked={strictMode}
                onCheckedChange={setStrictMode}
              />
            </div>
            <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Before/After Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-surface border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription>Mean Time to Assignment (MTTA)</CardDescription>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Before: 45min</div>
                  <div className="text-2xl font-bold text-green-400">8.2min</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-semibold">-82%</span>
                  </div>
                  <div className="text-xs text-slate-500">35% reduction</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription>Mean Time to Resolution (MTTR)</CardDescription>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Before: 4.2hrs</div>
                  <div className="text-2xl font-bold text-green-400">2.4hrs</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-semibold">-43%</span>
                  </div>
                  <div className="text-xs text-slate-500">28% reduction</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardHeader className="pb-3">
              <CardDescription>Ticket Backlog</CardDescription>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Before: 127</div>
                  <div className="text-2xl font-bold text-green-400">42</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-semibold">-67%</span>
                  </div>
                  <div className="text-xs text-slate-500">22% reduction</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ROI Calculator */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>ROI Calculator</span>
              </CardTitle>
              <CardDescription>Adjust parameters to model financial impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Automation Level</label>
                  <span className="text-sm text-slate-400">{automationLevel[0]}%</span>
                </div>
                <Slider
                  value={automationLevel}
                  onValueChange={setAutomationLevel}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Team Size</label>
                  <span className="text-sm text-slate-400">{teamSize[0]} engineers</span>
                </div>
                <Slider
                  value={teamSize}
                  onValueChange={setTeamSize}
                  max={25}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Avg Ticket Value</label>
                  <span className="text-sm text-slate-400">${avgTicketValue[0]}</span>
                </div>
                <Slider
                  value={avgTicketValue}
                  onValueChange={setAvgTicketValue}
                  max={500}
                  min={50}
                  step={25}
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Monthly Savings</span>
                    <span className="text-lg font-semibold text-green-400">${roi.monthlySavings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Annual ARR Impact</span>
                    <span className="text-lg font-semibold text-green-400">${roi.yearlyARR.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Payback Period</span>
                    <span className="text-lg font-semibold text-primary">{roi.paybackMonths} months</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governance & Trust */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Governance & Trust</span>
              </CardTitle>
              <CardDescription>Audit trail and compliance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-50 mb-1">1,247</div>
                  <div className="text-sm text-slate-400">Evidence Packs</div>
                  <div className="text-xs text-green-400 mt-1">100% tamper-evident</div>
                </div>
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-50 mb-1">89</div>
                  <div className="text-sm text-slate-400">Approvals</div>
                  <div className="text-xs text-slate-400 mt-1">This month</div>
                </div>
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-50 mb-1">24</div>
                  <div className="text-sm text-slate-400">Audit Exports</div>
                  <div className="text-xs text-slate-400 mt-1">Compliance reports</div>
                </div>
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-50 mb-1">99.7%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                  <div className="text-xs text-green-400 mt-1">SLA compliant</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">SOC 2 Type II</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">GDPR Data Protection</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">ISO 27001</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Certified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Impact Overview */}
        <Card className="bg-surface border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Financial Impact Summary</CardTitle>
            <CardDescription>Comprehensive view of automation benefits and cost savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">$2.4M</div>
                <div className="text-sm text-slate-400">Annual Cost Savings</div>
                <div className="text-xs text-slate-500 mt-1">Labor + efficiency gains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">$180K</div>
                <div className="text-sm text-slate-400">Implementation Cost</div>
                <div className="text-xs text-slate-500 mt-1">One-time investment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">1,340%</div>
                <div className="text-sm text-slate-400">ROI</div>
                <div className="text-xs text-slate-500 mt-1">3-year projection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">8.2</div>
                <div className="text-sm text-slate-400">Payback (months)</div>
                <div className="text-xs text-slate-500 mt-1">Break-even point</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strict Mode Impact */}
        {strictMode && (
          <Card className="bg-red-950/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Strict Mode Active</span>
              </CardTitle>
              <CardDescription className="text-red-300">
                Enhanced governance controls for hardware replacements over $500 and cross-site moves
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-400">+15%</div>
                  <div className="text-sm text-red-300">Approval Time</div>
                </div>
                <div className="text-center p-3 bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-400">100%</div>
                  <div className="text-sm text-red-300">Audit Coverage</div>
                </div>
                <div className="text-center p-3 bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-400">3</div>
                  <div className="text-sm text-red-300">Pending Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
