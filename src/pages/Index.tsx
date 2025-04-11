
import { useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import Header from '@/components/Header';
import CorporifyForm from '@/components/CorporifyForm';
import UsageDisplay from '@/components/UsageDisplay';
import { useAuth } from '@/hooks/useAuth';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-corporate-900 mb-2">
          Rewrite blunt messages into professional workplace communication in seconds.
        </h2>
        <p className="text-muted-foreground">Transform your casual text into polished corporate language</p>
      </div>
      
      <UsageDisplay />
      <CorporifyForm />
      
      <div className="text-center mt-12 text-sm text-muted-foreground">
        {user && (
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
