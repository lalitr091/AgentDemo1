import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Copy, 
  Download, 
  Eye,
  Brain,
  FileSearch,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const agentfileContent = `# Initializ Agent Mesh - GreyOrange Configuration
# Version: 1.0
# Generated: 2025-01-13T10:00:00Z

metadata:
  name: "greyorange-first-action-worker"
  version: "1.0"
  tenant: "greyorange"
  description: "Three-agent collaboration for Zendesk→Jira automation"
  
policies:
  strict_mode: false
  p1_needs_approval: true
  pii_redaction: true
  confidence_threshold: 0.8
  max_auto_creates_per_hour: 10

agents:
  - name: "TriageAgent"
    type: "classifier"
    version: "2.1.3"
    description: "Classifies tickets and routes to appropriate track"
    
    capabilities:
      - ticket_classification
      - similarity_search
      - jira_creation
      - zendesk_updates
    
    tools:
      - name: "classifyTicket"
        description: "Analyze ticket content and determine track (hardware/software)"
        parameters:
          - body: string
          - history: array
        returns:
          - track: enum[hardware, software]
          - confidence: float
          - rationale: string
          - similar_tickets: array
      
      - name: "createJiraFromTicket" 
        description: "Create Jira issue with mapped fields and labels"
        parameters:
          - ticket: object
        returns:
          - issue_key: string
          - url: string
    
    decision_tree:
      hardware_keywords: 
        - "firmware"
        - "totes" 
        - "misrouted"
        - "sensor"
        - "charging"
        - "AGV"
        - "dock"
        - "motor"
        - "driver"
        - "board"
      
      software_keywords:
        - "API"
        - "interface"
        - "login"
        - "export"
        - "report"
        - "dashboard"
        - "configuration"
      
      confidence_factors:
        - keyword_match: 0.4
        - similar_tickets: 0.3
        - priority_escalation: 0.2
        - customer_tier: 0.1

  - name: "LogAnalyzerAgent"
    type: "analyzer"
    version: "1.8.2"
    description: "Analyzes uploaded logs and extracts actionable insights"
    
    capabilities:
      - log_parsing
      - error_detection
      - pattern_analysis
      - recommendation_generation
    
    tools:
      - name: "analyzeLog"
        description: "Parse log file and identify error patterns"
        parameters:
          - issue_key: string
          - log_file: binary
        returns:
          - findings: object
            - root_cause: string
            - signals: array
            - error_bursts: array
            - recommended_action: string
            - confidence: float
    
    patterns:
      error_signatures:
        - name: "CRC_MISMATCH"
          regex: "CRC.*mismatch.*error"
          severity: "high"
          action: "hardware_replacement"
        
        - name: "TIMEOUT_ERROR"
          regex: "timeout.*connection.*failed"
          severity: "medium" 
          action: "network_investigation"
        
        - name: "MEMORY_LEAK"
          regex: "OutOfMemoryError|memory.*leak"
          severity: "high"
          action: "restart_service"
      
      burst_detection:
        window_seconds: 300
        threshold_count: 5
        correlation_patterns:
          - temporal_clustering
          - error_code_grouping

  - name: "SpareAgent"
    type: "inventory"
    version: "1.4.1" 
    description: "Manages spare parts inventory and reservations"
    
    capabilities:
      - inventory_lookup
      - part_reservation
      - eta_calculation
      - cross_site_logistics
    
    tools:
      - name: "recommendSpare"
        description: "Recommend spare part based on findings"
        parameters:
          - findings: object
        returns:
          - part_no: string
          - location: string
          - eta: string
      
      - name: "reserveSpare"
        description: "Reserve part and update inventory"
        parameters:
          - part_no: string
          - location: string
          - quantity: integer
        returns:
          - reservation_id: string
          - confirmation: object
    
    inventory_locations:
      - "ATL-DC"  # Atlanta Distribution Center
      - "DFW-DC"  # Dallas Distribution Center  
      - "LHR-DC"  # London Distribution Center
    
    shipping_rules:
      same_region: "1-2 business days"
      cross_region: "3-5 business days"
      expedited: "next business day (+$200)"
    
    cost_thresholds:
      low_value: 0..100      # Auto-approve
      medium_value: 101..500 # Manager approval
      high_value: 501+       # Executive approval (strict mode)

workflows:
  golden_path_p1_hardware:
    trigger: "ticket.priority == P1 && ticket.track == hardware"
    steps:
      1. TriageAgent.classifyTicket()
      2. TriageAgent.createJiraFromTicket() 
      3. [APPROVAL_GATE] if policies.p1_needs_approval
      4. LogAnalyzerAgent.analyzeLog() # when attachment uploaded
      5. SpareAgent.recommendSpare()
      6. SpareAgent.reserveSpare()
      7. Update Jira and Zendesk with findings + ETA
    
    evidence_retention: 90 days
    audit_level: full

field_mappings:
  priority:
    P1: "Highest"
    P2: "High" 
    P3: "Medium"
    P4: "Low"
  
  components:
    hardware: "{{ site }}"  # e.g., "ATL-1", "DFW-2"
    software: "App/Service"
  
  labels:
    - "first-action"
    - "ai-suggested" 
    - "GO"
    - "{{ track }}"  # hardware or software

monitoring:
  metrics:
    - suggestion_acceptance_rate
    - false_positive_rate
    - avg_time_to_resolution
    - customer_satisfaction_delta
  
  alerts:
    - confidence_below_threshold
    - approval_queue_backlog
    - sla_breach_risk
    - agent_error_rate_spike

compliance:
  data_residency: "US/EU"
  retention_policy: "7 years"
  encryption: "AES-256"
  audit_trail: "immutable"
  certifications:
    - "SOC 2 Type II"
    - "ISO 27001"
    - "GDPR Compliant"`;

export default function Agentfile() {
  const { toast } = useToast();
  const [isRawView, setIsRawView] = useState(true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(agentfileContent).then(() => {
      toast({
        title: 'Copied!',
        description: 'Agentfile content copied to clipboard',
      });
    });
  };

  const downloadAgentfile = () => {
    const blob = new Blob([agentfileContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agentfile.yaml';
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
              <FileText className="w-6 h-6" />
              <span>Agentfile Configuration</span>
            </h1>
            <p className="text-slate-400">
              Complete agent mesh definition for GreyOrange First-Action Worker
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsRawView(!isRawView)}
              className="border-slate-600 hover:bg-slate-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isRawView ? 'Structured View' : 'Raw YAML'}
            </Button>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="border-slate-600 hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button
              onClick={downloadAgentfile}
              className="bg-primary hover:bg-orange-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download YAML
            </Button>
          </div>
        </div>

        {isRawView ? (
          /* Raw YAML View */
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">agentfile.yaml</CardTitle>
              <CardDescription>
                Read-only configuration defining the three-agent collaboration system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                  {agentfileContent}
                </pre>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Structured View */
          <div className="space-y-6">
            {/* Metadata */}
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Configuration Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Name</div>
                    <div className="text-slate-200">greyorange-first-action-worker</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Version</div>
                    <div className="text-slate-200">1.0</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Tenant</div>
                    <div className="text-slate-200">GreyOrange</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Generated</div>
                    <div className="text-slate-200">2025-01-13T10:00:00Z</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-surface border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>TriageAgent</span>
                  </CardTitle>
                  <CardDescription>Classifier • v2.1.3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Classifies tickets and routes to appropriate track
                  </p>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">Capabilities</div>
                    <div className="space-y-1">
                      {['ticket_classification', 'similarity_search', 'jira_creation', 'zendesk_updates'].map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs mr-1 mb-1">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">Tools</div>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div>• classifyTicket()</div>
                      <div>• createJiraFromTicket()</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50 flex items-center space-x-2">
                    <FileSearch className="w-5 h-5 text-yellow-500" />
                    <span>LogAnalyzerAgent</span>
                  </CardTitle>
                  <CardDescription>Analyzer • v1.8.2</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Analyzes uploaded logs and extracts actionable insights
                  </p>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">Capabilities</div>
                    <div className="space-y-1">
                      {['log_parsing', 'error_detection', 'pattern_analysis', 'recommendation_generation'].map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs mr-1 mb-1">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">Error Patterns</div>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div>• CRC_MISMATCH</div>
                      <div>• TIMEOUT_ERROR</div>
                      <div>• MEMORY_LEAK</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50 flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span>SpareAgent</span>
                  </CardTitle>
                  <CardDescription>Inventory • v1.4.1</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Manages spare parts inventory and reservations
                  </p>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">Capabilities</div>
                    <div className="space-y-1">
                      {['inventory_lookup', 'part_reservation', 'eta_calculation', 'cross_site_logistics'].map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs mr-1 mb-1">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">Locations</div>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div>• ATL-DC (Atlanta)</div>
                      <div>• DFW-DC (Dallas)</div>
                      <div>• LHR-DC (London)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Policies & Workflows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-surface border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50">Active Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Strict Mode</span>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">P1 Needs Approval</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">PII Redaction</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Confidence Threshold</span>
                      <Badge variant="outline">80%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Rate Limit</span>
                      <Badge variant="outline">10/hour</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50">Golden Path Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-400">P1 Hardware Incident Flow:</div>
                    <div className="space-y-1 text-slate-300 ml-4">
                      <div>1. TriageAgent classifies ticket</div>
                      <div>2. Create Jira issue GO-####</div>
                      <div>3. [Approval Gate] if P1</div>
                      <div>4. LogAnalyzer processes uploads</div>
                      <div>5. SpareAgent reserves parts</div>
                      <div>6. Update both systems with ETA</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-3">
                      Evidence retention: 90 days • Audit level: Full
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
