import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users,
  Save,
  RotateCcw,
  Info
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';

export default function Policies() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [policies, setPolicies] = useState({
    p1NeedsApproval: true,
    piiRedaction: true,
    containsPiiApproval: true,
    externalImpactApproval: true,
    confidenceThreshold: [80],
    maxAutoCreatesPerHour: [10],
    strictMode: false, // Only exec can modify
  });

  const [hasChanges, setHasChanges] = useState(false);

  const canModifyStrictMode = user?.role === 'exec';

  const updatePolicy = (key: string, value: any) => {
    setPolicies(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const savePolicies = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Policies Updated',
        description: 'All policy changes have been applied successfully.',
      });
      
      setHasChanges(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update policies. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetPolicies = () => {
    setPolicies({
      p1NeedsApproval: true,
      piiRedaction: true,
      containsPiiApproval: true,
      externalImpactApproval: true,
      confidenceThreshold: [80],
      maxAutoCreatesPerHour: [10],
      strictMode: false,
    });
    setHasChanges(true);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50 flex items-center space-x-3">
              <Settings className="w-6 h-6" />
              <span>Policy Configuration</span>
            </h1>
            <p className="text-slate-400">Configure automation rules and governance controls</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={resetPolicies}
              className="border-slate-600 hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              onClick={savePolicies}
              disabled={!hasChanges}
              className="bg-primary hover:bg-orange-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* User Role Notice */}
        <Card className="bg-blue-950/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-400 font-medium">
                  Policy Access Level: {user?.role === 'head' ? 'Support Head' : 'Executive'}
                </p>
                <p className="text-blue-300 text-sm">
                  {user?.role === 'head' 
                    ? 'You can modify all policies except Strict Mode (Executive only)'
                    : 'You have full access to all policy configurations including Strict Mode'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Approval Policies */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Approval Requirements</span>
              </CardTitle>
              <CardDescription>Configure when human approval is required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-slate-300">P1 Incidents Need Approval</Label>
                  <p className="text-sm text-slate-500">Require head approval for P1 priority tickets</p>
                </div>
                <Switch
                  checked={policies.p1NeedsApproval}
                  onCheckedChange={(checked) => updatePolicy('p1NeedsApproval', checked)}
                />
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-slate-300">PII Data Processing</Label>
                  <p className="text-sm text-slate-500">Require approval when PII is detected</p>
                </div>
                <Switch
                  checked={policies.containsPiiApproval}
                  onCheckedChange={(checked) => updatePolicy('containsPiiApproval', checked)}
                />
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-slate-300">External Impact</Label>
                  <p className="text-sm text-slate-500">Require approval for customer-facing issues</p>
                </div>
                <Switch
                  checked={policies.externalImpactApproval}
                  onCheckedChange={(checked) => updatePolicy('externalImpactApproval', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Processing */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Data Processing</span>
              </CardTitle>
              <CardDescription>Configure how sensitive data is handled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-slate-300">Redact PII in Jira</Label>
                  <p className="text-sm text-slate-500">Automatically redact personal information</p>
                </div>
                <Switch
                  checked={policies.piiRedaction}
                  onCheckedChange={(checked) => updatePolicy('piiRedaction', checked)}
                />
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Confidence Threshold</Label>
                  <Badge variant="outline">{policies.confidenceThreshold[0]}%</Badge>
                </div>
                <p className="text-sm text-slate-500">Minimum confidence required for auto-execution</p>
                <Slider
                  value={policies.confidenceThreshold}
                  onValueChange={(value) => updatePolicy('confidenceThreshold', value)}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Rate Limiting</Label>
                  <Badge variant="outline">{policies.maxAutoCreatesPerHour[0]}/hour</Badge>
                </div>
                <p className="text-sm text-slate-500">Maximum automatic Jira creations per hour</p>
                <Slider
                  value={policies.maxAutoCreatesPerHour}
                  onValueChange={(value) => updatePolicy('maxAutoCreatesPerHour', value)}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strict Mode */}
        <Card className={`border-slate-700 ${canModifyStrictMode ? 'bg-surface' : 'bg-slate-800/50'}`}>
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Strict Mode</span>
              {!canModifyStrictMode && (
                <Badge variant="secondary" className="ml-2">Executive Only</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Enhanced governance for hardware replacements over $500 and cross-site operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className={`${canModifyStrictMode ? 'text-slate-300' : 'text-slate-500'}`}>
                  Enable Strict Mode
                </Label>
                <p className={`text-sm ${canModifyStrictMode ? 'text-slate-500' : 'text-slate-600'}`}>
                  Require executive approval for high-value operations
                </p>
              </div>
              <Switch
                checked={policies.strictMode}
                onCheckedChange={(checked) => updatePolicy('strictMode', checked)}
                disabled={!canModifyStrictMode}
              />
            </div>

            {policies.strictMode && (
              <div className="mt-4 p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="font-medium text-red-400">Strict Mode Active</span>
                </div>
                <ul className="text-sm text-red-300 space-y-1 list-disc list-inside">
                  <li>Hardware replacements over $500 require approval</li>
                  <li>Cross-site inventory moves require approval</li>
                  <li>Priority escalations are logged and audited</li>
                  <li>Extended evidence pack retention (180 days)</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mapping Rules */}
        <Card className="bg-surface border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Field Mapping Rules</CardTitle>
            <CardDescription>Configure how Zendesk fields map to Jira</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-300 mb-3">Priority Mapping</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">P1 →</span>
                    <span className="text-slate-200">Highest</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">P2 →</span>
                    <span className="text-slate-200">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">P3 →</span>
                    <span className="text-slate-200">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">P4 →</span>
                    <span className="text-slate-200">Low</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-300 mb-3">Component Assignment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hardware →</span>
                    <span className="text-slate-200">Site Component</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Software →</span>
                    <span className="text-slate-200">App/Service</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            <div>
              <h4 className="font-medium text-slate-300 mb-3">Standard Labels</h4>
              <div className="flex flex-wrap gap-2">
                {['first-action', 'ai-suggested', 'GO', 'automated'].map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
