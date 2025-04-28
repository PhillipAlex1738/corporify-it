
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CorporifyForm from '@/components/CorporifyForm';
import SEO from '@/components/SEO';

const AppPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SEO
        title="Corporify - Professional Communication Tool"
        description="Transform casual messages into professional workplace communications with our AI-powered tool."
        path="/app"
        keywords="professional communication, email rewriter, corporate language, tone adjustment, AI writing assistant"
      />
      
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              Corporify Professional Communication Tool
            </h1>
            <p className="text-lg text-navy-600 max-w-2xl mx-auto">
              Transform your casual messages into polished, professional communications with our AI-powered tool.
            </p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <CorporifyForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppPage;
