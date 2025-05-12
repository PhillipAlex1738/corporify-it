
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export const useAuthNotifications = () => {
  const { toast } = useToast();

  const sendWelcomeEmail = async (email: string): Promise<void> => {
    try {
      console.log("Sending welcome email to:", email);
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          type: 'welcome',
          data: { email }
        }
      });
      
      if (response.error) {
        console.error("Error sending welcome email:", response.error);
        return;
      }
      
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error here, as this is not critical functionality
    }
  };

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({
      title,
      description,
      variant,
    });
  };

  return {
    sendWelcomeEmail,
    showToast
  };
};
