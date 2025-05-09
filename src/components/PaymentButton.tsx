
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PaymentButtonProps {
  priceId?: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  priceId,
  buttonText = "Upgrade to Premium",
  className,
  variant = "default"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { priceId }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading} 
      className={className}
      variant={variant}
    >
      <CreditCard className="mr-2 h-4 w-4" />
      {isLoading ? "Processing..." : buttonText}
    </Button>
  );
};

export default PaymentButton;
