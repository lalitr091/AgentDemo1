import { Link } from 'wouter';
import { Cpu, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';

const personas = [
  {
    role: 'engineer',
    title: 'Support Engineer',
    description: 'Manage work queue, create Jira issues, analyze logs',
    features: ['Full Work Queue access', 'Evidence Pack viewing', 'Chat Copilot'],
    href: '/engineer/work-queue',
    color: 'bg-blue-500',
    access: 'Full ticket management and agent interaction',
  },
  {
    role: 'head',
    title: 'Support Head',
    description: 'Operations oversight, approvals, policy management',
    features: ['Operations Dashboard', 'Approval Workflows', 'Policy Configuration'],
    href: '/head/operations',
    color: 'bg-green-500',
    access: 'Team management and process governance',
  },
  {
    role: 'exec',
    title: 'C-Level Executive',
    description: 'ROI insights, governance oversight, strategic controls',
    features: ['ROI Analytics', 'Strict Mode Control', 'Executive Reporting'],
    href: '/exec/roi',
    color: 'bg-purple-500',
    access: 'High-level metrics and governance controls',
  },
];

export default function PersonaChooser() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Please log in to continue</p>
      </div>
    );
  }

  const userPersona = personas.find(p => p.role === user.role);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Welcome to Initializ Agent Mesh</h1>
              <p className="text-slate-400">First-Action Worker — GreyOrange Edition</p>
            </div>
          </div>
          
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Experience AI-powered automation with three collaborative agents handling 
            Zendesk→Jira workflows with complete governance, evidence tracking, and replay capabilities.
          </p>
        </div>

        {/* Current User */}
        <div className="mb-8">
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${userPersona?.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {user.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-slate-50">Logged in as {user.name}</CardTitle>
                    <CardDescription>{user.email} • {userPersona?.title}</CardDescription>
                  </div>
                </div>
                {userPersona && (
                  <Link href={userPersona.href}>
                    <Button className="bg-primary hover:bg-orange-600 text-white">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Guided Tour */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-50 flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Start Guided Tour</span>
                  </CardTitle>
                  <CardDescription>
                    Learn how the three agents collaborate to handle a P1 hardware incident
                  </CardDescription>
                </div>
                <Link href="/engineer/work-queue">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Begin Tour
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-slate-200 mb-1">TriageAgent</h4>
                  <p className="text-xs text-slate-400">Classifies ZD-14231 as hardware incident, creates GO-1012</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-slate-200 mb-1">LogAnalyzerAgent</h4>
                  <p className="text-xs text-slate-400">Analyzes uploaded logs, finds CRC errors, recommends replacement</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-slate-200 mb-1">SpareAgent</h4>
                  <p className="text-xs text-slate-400">Reserves motor driver board, updates ETA in Jira and Zendesk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Personas */}
        <div>
          <h2 className="text-xl font-semibold text-slate-50 mb-6">Explore All Roles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {personas.map((persona) => (
              <Card
                key={persona.role}
                className={`bg-surface border-slate-700 transition-transform hover:scale-105 ${
                  persona.role === user.role ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-10 h-10 ${persona.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                      {persona.title.split(' ').map(word => word[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-slate-50">{persona.title}</CardTitle>
                      {persona.role === user.role && (
                        <span className="text-xs text-primary font-medium">Current Role</span>
                      )}
                    </div>
                  </div>
                  <CardDescription>{persona.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {persona.features.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-400">{persona.access}</p>
                  </div>
                  
                  <Link href={persona.href}>
                    <Button
                      variant={persona.role === user.role ? 'default' : 'outline'}
                      className={`w-full ${
                        persona.role === user.role
                          ? 'bg-primary hover:bg-orange-600 text-white'
                          : 'border-slate-600 hover:bg-slate-700'
                      }`}
                    >
                      {persona.role === user.role ? 'Go to Dashboard' : 'View as Demo'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-4">
            <Link href="/mesh">
              <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
                Agent Mesh Console
              </Button>
            </Link>
            <Link href="/agentfile">
              <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
                View Agentfile
              </Button>
            </Link>
            <Link href="/settings/policies">
              <Button variant="outline" className="border-slate-600 hover:bg-slate-700">
                Policy Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
