
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CorporifyForm from '@/components/CorporifyForm';
import UsageDisplay from '@/components/UsageDisplay';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
