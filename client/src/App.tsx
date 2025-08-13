import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { useEffect } from "react";

// Auth
import Login from "@/pages/auth/Login";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Main pages
import PersonaChooser from "@/pages/PersonaChooser";
import WorkQueuePage from "@/pages/engineer/WorkQueuePage";
import Operations from "@/pages/head/Operations";
import ROI from "@/pages/exec/ROI";
import AgentMesh from "@/pages/mesh/AgentMesh";
import EvidencePack from "@/pages/runs/EvidencePack";
import Policies from "@/pages/settings/Policies";
import Agentfile from "@/pages/Agentfile";
import AgentDetail from "@/pages/agents/AgentDetail";
import NotFound from "@/pages/not-found";



function Router() {
  const { user } = useAuthStore();
  const { setContext } = useChatStore();

  useEffect(() => {
    // Update chat context when route changes
    setContext({
      currentRoute: window.location.pathname,
      userRole: user?.role,
    });
  }, [user, setContext]);

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth/login" component={Login} />
      
      {/* Protected routes - redirect to role-specific dashboard */}
      <Route path="/">
        <ProtectedRoute redirectToRoleDashboard={true} />
      </Route>

      {/* Engineer routes */}
      <Route path="/engineer/work-queue">
        <ProtectedRoute allowedRoles={['engineer']}>
          <WorkQueuePage />
        </ProtectedRoute>
      </Route>

      {/* Head routes */}
      <Route path="/head/operations">
        <ProtectedRoute allowedRoles={['head']}>
          <Operations />
        </ProtectedRoute>
      </Route>

      {/* Executive routes */}
      <Route path="/exec/roi">
        <ProtectedRoute allowedRoles={['exec']}>
          <ROI />
        </ProtectedRoute>
      </Route>

      {/* Shared routes (all authenticated users) */}
      <Route path="/mesh">
        <ProtectedRoute>
          <AgentMesh />
        </ProtectedRoute>
      </Route>

      <Route path="/runs/:runId">
        {(params) => (
          <ProtectedRoute>
            <EvidencePack runId={params.runId} />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/runs/latest">
        <ProtectedRoute>
          <EvidencePack runId="latest" />
        </ProtectedRoute>
      </Route>

      <Route path="/settings/policies">
        <ProtectedRoute allowedRoles={['head', 'exec']}>
          <Policies />
        </ProtectedRoute>
      </Route>

      <Route path="/agentfile">
        <ProtectedRoute>
          <Agentfile />
        </ProtectedRoute>
      </Route>

      <Route path="/agents/:agentName">
        {(params) => (
          <ProtectedRoute>
            <AgentDetail agentName={params.agentName} />
          </ProtectedRoute>
        )}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
