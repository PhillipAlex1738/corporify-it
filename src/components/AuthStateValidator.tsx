
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const AuthStateValidator = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Only validate if we have a user in state
    if (user) {
      const validateUserExists = async () => {
        try {
          console.log("Validating user session for:", user.email);
          
          // Simple session check without complex logic
          const { data, error } = await supabase.auth.getUser();
          
          if (error || !data.user) {
            console.log("No valid user found in Supabase:", error?.message);
            toast({
              title: "Session expired",
              description: "Your session is no longer valid. Please sign in again.",
              variant: "destructive"
            });
            
            // Simple logout without additional checks
            await logout();
          }
        } catch (err) {
          console.error("Error validating user session:", err);
          // Simple error handling - just logout
          await logout();
        }
      };
      
      // Run validation on component mount
      validateUserExists();
      
      // Validation interval - reduce frequency to avoid potential race conditions
      const intervalId = setInterval(validateUserExists, 10 * 60 * 1000); // 10 minutes
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user, logout, toast]);
  
  // This component doesn't render anything
  return null;
};

export default AuthStateValidator;
