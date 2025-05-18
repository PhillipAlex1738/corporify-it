
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const AuthStateValidator = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Only run if we have a user in state
    if (user) {
      const validateUserExists = async () => {
        try {
          console.log("Validating user session for:", user.email);
          
          // Check if we have a valid session
          const { data, error } = await supabase.auth.getUser();
          
          if (error || !data.user) {
            console.log("No valid user found in Supabase, performing logout:", error?.message);
            // Clear any persistent UI notifications first
            toast({
              title: "Session expired",
              description: "Your session is no longer valid. Please sign in again.",
              variant: "destructive"
            });
            
            // User doesn't exist in Supabase, log out locally
            logout().catch(err => {
              console.error("Error during auto-logout:", err);
            });
          } else {
            console.log("User validated successfully:", data.user.email);
          }
        } catch (err) {
          console.error("Error validating user session:", err);
          // If we encounter an error during validation, it's safest to log the user out
          logout().catch(error => console.error("Error during fallback logout:", error));
        }
      };
      
      // Run validation immediately on component mount if we have a user
      validateUserExists();
      
      // Set up interval to periodically validate the session (every 5 minutes)
      const intervalId = setInterval(validateUserExists, 5 * 60 * 1000);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user, logout, toast]);
  
  // This component doesn't render anything
  return null;
};

export default AuthStateValidator;
