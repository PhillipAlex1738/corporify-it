
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PaymentButtonProps {
  priceId?: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  priceId = "price_placeholder", // Use a placeholder that will trigger a helpful error
  buttonText = "Upgrade to Premium",
  className,
  variant = "default"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigError, setShowConfigError] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setShowConfigError(false);
      
      console.log("Starting payment process with price ID:", priceId);
      
      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { priceId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        console.log("Redirecting to Stripe checkout:", data.url);
        window.location.href = data.url;
      } else if (data?.error && data.error.includes('price')) {
        // Show specific error for price issues
        setShowConfigError(true);
        console.error('Stripe price configuration error:', data.error);
        toast({
          title: "Configuration Error",
          description: "The payment system needs to be configured with valid product IDs. Please contact support.",
          variant: "destructive"
        });
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Check if this is a price-related error
      const errorMessage = error.message || "Failed to initialize payment";
      if (errorMessage.toLowerCase().includes('price') || errorMessage.toLowerCase().includes('resource_missing')) {
        setShowConfigError(true);
        toast({
          title: "Configuration Error",
          description: "The payment system needs to be configured with valid product IDs. Please contact support.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Payment Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showConfigError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Stripe Configuration Error</AlertTitle>
          <AlertDescription>
            This is a development environment issue. The price IDs used do not match any products in your Stripe account.
            An administrator needs to update the price IDs with actual values from your Stripe dashboard.
          </AlertDescription>
        </Alert>
      )}
      <Button 
        onClick={handlePayment} 
        disabled={isLoading} 
        className={className}
        variant={variant}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {isLoading ? "Processing..." : buttonText}
      </Button>
    </>
  );
};

export default PaymentButton;
