
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/hooks/useAuthContext';
import { useAuthState } from './useAuthState';
import { transformUser, saveUserToLocalStorage } from '@/utils/userTransform';

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
      }
    });

    // Check for existing session and also stored user data
    const initializeAuth = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        console.log('Checking for existing session...');
        
        // Check for user data in localStorage first
        const storedUserData = localStorage.getItem('corporify_user');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            console.log('Found stored user data:', userData.email);
            
            // Verify the user still exists in Supabase before setting user state
            try {
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError || !sessionData.session) {
                console.log('No valid session found for stored user, clearing auth state');
                clearAuthState();
                return;
              }
              
              // If we have a session, temporarily set the user
              setUser(userData);
            } catch (e) {
              console.error('Error verifying user session:', e);
              clearAuthState();
            }
          } catch (e) {
            console.error('Failed to parse stored user data:', e);
            clearAuthState();
          }
        }
        
        // Then check for session with the server
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          clearAuthState();
          return;
        }
        
        console.log('Initial session check:', data.session ? `Found session for ${data.session.user.email}` : 'No session found');
        
        if (data.session) {
          setSession(data.session);
          const initialUser = transformUser(data.session.user);
          if (initialUser) {
            console.log('Setting initial user:', initialUser.email);
            setUser(initialUser);
            saveUserToLocalStorage(initialUser);
          }
        } else {
          // If no server session but we have local user data, clear it
          if (user) {
            console.log('No server session found for user, clearing local data');
            clearAuthState();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthState();
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
  }, [setSession, setUser, setIsLoading, sendWelcomeEmail, user]);

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
