
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const AuthStateValidator = () => {
  const { user, logout } = useAuth();
  
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
            // User doesn't exist in Supabase, log out locally
            logout().catch(err => {
              console.error("Error during auto-logout:", err);
            });
          }
        } catch (err) {
          console.error("Error validating user session:", err);
        }
      };
      
      validateUserExists();
    }
  }, [user, logout]);
  
  // This component doesn't render anything
  return null;
};

export default AuthStateValidator;
