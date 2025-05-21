
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/hooks/auth';
import { usePageView } from '@/hooks/usePageView';
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthStateValidator from "@/components/AuthStateValidator";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DataHandling from "./pages/DataHandling";
import Support from "./pages/Support";
import Feedback from "./pages/Feedback";
import AppPage from "./pages/AppPage";
import PremiumPage from "./pages/Premium";
import Analytics from "./pages/Analytics";

const PageViewTracker = ({ children }: { children: React.ReactNode }) => {
  usePageView();
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <PageViewTracker>
              <AuthStateValidator />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/app" element={<AppPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/data-handling" element={<DataHandling />} />
                <Route path="/support" element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageViewTracker>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
