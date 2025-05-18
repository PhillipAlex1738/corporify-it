
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/hooks/useAuthContext';
import { useAuthState } from './useAuthState';
import { transformUser, saveUserToLocalStorage } from '@/utils/userTransform';
import { useToast } from '@/components/ui/use-toast';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAdmin,
    session,
    setSession,
    login,
    signUp,
    logout,
    upgradeAccount,
    sendWelcomeEmail,
  } = useAuthState();

  const { toast } = useToast();

  // Function to clear auth state
  const clearAuthState = () => {
    console.log('Clearing auth state due to invalid session');
    setUser(null);
    setSession(null);
    localStorage.removeItem('corporify_user');
  };

  useEffect(() => {
    console.log("Setting up auth provider and listeners");
    
    // First set up the auth listener before checking for session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email || 'No user');
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state');
        clearAuthState();
        return;
      }
      
      // Update session state immediately
      setSession(newSession);
      
      // Process user data if available
      if (newSession?.user) {
        const newUser = transformUser(newSession.user);
        console.log('Setting user from auth change:', newUser?.email || 'No email available');
        setUser(newUser);
        
        // Use setTimeout to avoid potential deadlocks with Supabase
        if (newUser) {
          setTimeout(() => {
            saveUserToLocalStorage(newUser);
          }, 0);
        }
      }
    });

    // Check for existing session after setting up listeners
    const checkSession = async () => {
      try {
        setIsLoading(true);
        console.log('Checking for existing session...');
        
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          clearAuthState();
          return;
        }
        
        if (!sessionData?.session) {
          console.log('No valid session found');
          clearAuthState();
          return;
        }
        
        console.log('Valid session found:', sessionData.session.user.email);
        setSession(sessionData.session);
        
        const userData = transformUser(sessionData.session.user);
        if (userData) {
          setUser(userData);
          saveUserToLocalStorage(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setIsLoading]);

  const value = {
    user,
    isLoading,
    isAdmin,
    login,
    signUp,
    logout,
    upgradeAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
