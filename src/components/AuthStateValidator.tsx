
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
            await logout();
          } else {
            console.log("User validated successfully:", data.user.email);
            
            // Check if the user ID matches - if not, there might be a stale session
            if (data.user.id !== user.id) {
              console.log("User ID mismatch, logging out");
              toast({
                title: "Authentication issue",
                description: "There was a problem with your session. Please sign in again.",
                variant: "destructive"
              });
              await logout();
            }
          }
        } catch (err) {
          console.error("Error validating user session:", err);
          // If we encounter an error during validation, it's safest to log the user out
          try {
            await logout();
            toast({
              title: "Session error",
              description: "We encountered a problem with your session. Please sign in again.",
              variant: "destructive"
            });
          } catch (logoutError) {
            console.error("Error during fallback logout:", logoutError);
          }
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
