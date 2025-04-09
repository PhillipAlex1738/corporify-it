
import { useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import Header from '@/components/Header';
import CorporifyForm from '@/components/CorporifyForm';
import UsageDisplay from '@/components/UsageDisplay';
import HistoryList from '@/components/HistoryList';
import { useCorporify } from '@/hooks/useCorporify';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AppContent = () => {
  const { history } = useCorporify();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'corporify' | 'history'>('corporify');

  return (
    <div className="container max-w-4xl py-8 px-4">
      <UsageDisplay />
      
      {user?.isPremium ? (
        <Tabs defaultValue="corporify" value={activeTab} onValueChange={(v) => setActiveTab(v as 'corporify' | 'history')}>
          <TabsList className="mb-6">
            <TabsTrigger value="corporify">Corporify</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="corporify">
            <CorporifyForm />
          </TabsContent>
          
          <TabsContent value="history">
            <HistoryList history={history} />
          </TabsContent>
        </Tabs>
      ) : (
        <CorporifyForm />
      )}
      
      <div className="text-center mt-12 text-sm text-muted-foreground">
        <p>Corporify helps transform your casual messages into polished corporate language.</p>
        {user && !user.isPremium && (
          <p className="mt-1">
            <span className="font-medium">
              {user.usageLimit - user.usageCount} transformations
            </span> left today on the free plan.
          </p>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AppContent />
        </main>
      </div>
    </AuthProvider>
  );
};

export default Index;
