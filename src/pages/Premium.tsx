
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import PaymentButton from '@/components/PaymentButton';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const PremiumPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const paymentStatus = searchParams.get('payment');
  const planName = searchParams.get('plan');

  useEffect(() => {
    if (paymentStatus === 'success') {
      toast({
        title: "Payment successful!",
        description: "Thank you for your purchase. Your premium features are now activated.",
        variant: "default",
      });
      
      if (user && planName) {
        // Send purchase confirmation email
        sendPurchaseConfirmationEmail(user.email, planName);
        
        // Upgrade user account in the auth system
        upgradeUserAccount();
      }
    } else if (paymentStatus === 'canceled') {
      toast({
        title: "Payment canceled",
        description: "Your payment was not completed. You can try again anytime.",
        variant: "destructive",
      });
    }
  }, [paymentStatus, toast, user, planName]);
  
  const sendPurchaseConfirmationEmail = async (email: string, plan: string) => {
    try {
      const amount = plan === 'Basic' ? '$9.99' : '$19.99';
      
      await supabase.functions.invoke('send-email', {
        body: { 
          type: 'purchase',
          data: {
            email,
            plan,
            amount
          }
        }
      });
      
      console.log('Purchase confirmation email sent');
    } catch (error) {
      console.error('Error sending purchase confirmation email:', error);
    }
  };
  
  const upgradeUserAccount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { isPremium: true }
      });
      
      if (error) {
        console.error('Error upgrading user account:', error);
      } else {
        console.log('User account upgraded:', data.user);
      }
    } catch (error) {
      console.error('Error upgrading user account:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SEO
        title="Corporify Premium - Upgrade Your Plan"
        description="Upgrade to Corporify Premium for unlimited usage and advanced features."
        path="/premium"
        keywords="premium subscription, professional communication, corporate language, tone adjustment"
      />
      
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-corporate-800 mb-4">
              Upgrade to Corporify Premium
            </h1>
            <p className="text-lg text-corporate-600 max-w-2xl mx-auto">
              Choose the plan that best fits your needs and unlock the full potential of professional communication.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-200 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-corporate-800 mb-2">Basic Plan</h3>
                <div className="text-3xl font-bold text-corporate-800 mb-4">$9.99<span className="text-lg font-normal text-gray-500"> one-time</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    20 messages per day
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Basic tone options
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Email support
                  </li>
                </ul>
              </div>
              <PaymentButton 
                priceId="price_1RMvjRB1VwDQf2qkLLWRzpOy"
                buttonText="Get Basic" 
                className="w-full"
              />
            </div>
            
            {/* Professional Plan */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-corporate-500 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-corporate-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-corporate-800 mb-2">Professional</h3>
                <div className="text-3xl font-bold text-corporate-800 mb-4">$19.99<span className="text-lg font-normal text-gray-500"> one-time</span></div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Unlimited messages
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    All tone options
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    PDF exports
                  </li>
                </ul>
              </div>
              <PaymentButton 
                priceId="price_1RMviRB1VwDQf2qkUmhoiTiZ" 
                buttonText="Get Professional" 
                className="w-full bg-corporate-500 hover:bg-corporate-600"
              />
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-corporate-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-corporate-700">How does billing work?</h4>
                <p className="text-gray-600">You'll be charged immediately for a one-time payment. You can purchase again at any time.</p>
              </div>
              <div>
                <h4 className="font-medium text-corporate-700">Is there a free trial?</h4>
                <p className="text-gray-600">We offer a limited number of free transformations daily. Premium plans begin immediately upon purchase.</p>
              </div>
              <div>
                <h4 className="font-medium text-corporate-700">What is included in each plan?</h4>
                <p className="text-gray-600">Basic gives you more message capacity and basic tone options. Professional includes unlimited messages, all tone options, and additional features like PDF exports.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PremiumPage;
