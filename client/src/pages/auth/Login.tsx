import { useState } from 'react';
import { useLocation } from 'wouter';
import { Cpu, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';

const quickLoginOptions = [
  {
    email: 'engineer@greyorange.com',
    password: 'demo123',
    role: 'Support Engineer',
    description: 'Full Work Queue access, read Evidence Packs',
    color: 'bg-blue-500',
  },
  {
    email: 'head@greyorange.com',
    password: 'demo123',
    role: 'Support Head',
    description: 'Operations + Approvals + Policies (except Strict Mode)',
    color: 'bg-green-500',
  },
  {
    email: 'exec@greyorange.com',
    password: 'demo123',
    role: 'C-Level Executive',
    description: 'ROI + Strict Mode toggle; read-only elsewhere',
    color: 'bg-purple-500',
  },
];

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const { toast } = useToast();

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    const emailToUse = loginEmail || email;
    const passwordToUse = loginPassword || password;

    if (!emailToUse || !passwordToUse) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    const success = await login(emailToUse, passwordToUse);
    
    if (success) {
      toast({
        title: 'Welcome!',
        description: 'Successfully logged in to Initializ Agent Mesh',
      });
      setLocation('/');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleQuickLogin = (option: typeof quickLoginOptions[0]) => {
    setEmail(option.email);
    setPassword(option.password);
    handleLogin(option.email, option.password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8">
        {/* Branding */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-50">Initializ Agent Mesh</h1>
              <p className="text-slate-400">First-Action Worker — GreyOrange</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-slate-300">
              Experience AI-powered ticket management with collaborative agents handling 
              Zendesk→Jira workflows with full governance and evidence tracking.
            </p>
            
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Three AI agents: Triage, LogAnalyzer, and Spare management</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>Tamper-evident Evidence Packs with replay capability</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Role-based access with governance controls</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-surface border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Sign In</CardTitle>
            <CardDescription>Choose a role or enter your credentials</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Quick Login Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-300">Quick Demo Access:</p>
              {quickLoginOptions.map((option) => (
                <Button
                  key={option.email}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 bg-slate-800 border-slate-600 hover:bg-slate-700"
                  onClick={() => handleQuickLogin(option)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${option.color} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                      {option.role.split(' ').map(word => word[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-200">{option.role}</div>
                      <div className="text-xs text-slate-400">{option.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-slate-400">Or continue with credentials</span>
              </div>
            </div>

            {/* Manual Login */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-600 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800 border-slate-600 focus:ring-primary focus:border-transparent pr-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => handleLogin()}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
