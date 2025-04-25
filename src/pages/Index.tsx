
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CorporifyForm from '@/components/CorporifyForm';
import UsageDisplay from '@/components/UsageDisplay';
import SEO from '@/components/SEO';

const Index = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    console.log("Index page: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
  }, [user]);

  // Structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Corporify It",
    "applicationCategory": "BusinessApplication",
    "description": "Transform casual messages into polished corporate language instantly. Enhance your workplace communication with our AI-powered rewriting tool.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Corporify It - Professional Message Rewriting Tool"
        description="Transform your casual messages into polished corporate communications instantly. Enhance your workplace communication with our AI-powered rewriting tool."
        path="/"
        keywords="corporate writing, professional emails, business communication, AI writing assistant, workplace communication, email tone, business emails"
        structuredData={structuredData}
      />
      <Header />
      <main className="flex-1">
        <div className="container max-w-4xl py-8 px-4">
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-corporate-900 mb-2">
            Rewrite blunt messages into professional workplace communication in seconds.
          </h1>
          <UsageDisplay />
          <CorporifyForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
