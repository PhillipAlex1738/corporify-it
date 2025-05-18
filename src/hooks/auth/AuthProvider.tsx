
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
    let isInitialized = false;
    
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
            
            // Send welcome email on SIGNED_IN event only, not on token refresh
            if (event === 'SIGNED_IN' && newSession.user.email) {
              console.log('Sending welcome email for new sign-in:', newSession.user.email);
              sendWelcomeEmail(newSession.user.email).catch(err => {
                console.error('Failed to send welcome email:', err);
                // Don't block the auth flow if email fails
              });
            }
          }, 0);
        }
      } else if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // If we get these events but no user data, verify if we still have a valid session
        setTimeout(async () => {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !sessionData.session) {
            console.log('Session invalid during token refresh or user update, clearing auth state');
            clearAuthState();
          }
        }, 0);
      }
    });

    // Check for existing session and also stored user data
    const initializeAuth = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        console.log('Checking for existing session...');
        
        // Force clear any potentially invalid stored user data first if no valid session
        const { data: initialSession, error: initialError } = await supabase.auth.getSession();
        if (initialError || !initialSession.session) {
          console.log('No valid initial session found, clearing any stored user data');
          clearAuthState();
        }
        
        // Check for user data in localStorage only if we have a valid session
        if (initialSession.session) {
          const storedUserData = localStorage.getItem('corporify_user');
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              console.log('Found stored user data:', userData.email);
              
              // Set user state from stored data while we verify with server
              setUser(userData);
              setSession(initialSession.session);
            } catch (e) {
              console.error('Failed to parse stored user data:', e);
              clearAuthState();
            }
          } else {
            // We have a session but no stored user data, set from session
            const sessionUser = transformUser(initialSession.session.user);
            if (sessionUser) {
              console.log('Setting user from session:', sessionUser.email);
              setUser(sessionUser);
              setSession(initialSession.session);
              saveUserToLocalStorage(sessionUser);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthState();
        toast({
          title: "Authentication Error",
          description: "There was a problem with your authentication. Please try signing in again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        isInitialized = true;
      }
    };

    initializeAuth();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setIsLoading, sendWelcomeEmail, toast]);

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
