
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
          
          // Use getUser to check if the session is valid
          const { data, error } = await supabase.auth.getUser();
          
          if (error || !data.user) {
            console.log("No valid user found in Supabase:", error?.message);
            toast({
              title: "Session expired",
              description: "Your session is no longer valid. Please sign in again.",
              variant: "destructive"
            });
            
            // Logout without additional checks
            logout();
          }
        } catch (err) {
          console.error("Error validating user session:", err);
          logout();
        }
      };
      
      // Run validation on component mount
      validateUserExists();
      
      // Set validation interval (reduced frequency)
      const intervalId = setInterval(validateUserExists, 15 * 60 * 1000); // 15 minutes
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user, logout, toast]);
  
  return null;
};

export default AuthStateValidator;
