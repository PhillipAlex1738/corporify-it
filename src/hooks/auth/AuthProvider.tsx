
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
    session,
    setSession,
    login,
    signUp,
    logout,
    googleSignIn,
    upgradeAccount,
  } = useAuthState();

  useEffect(() => {
    // Initial load - check current session first
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', initialSession);
        
        if (initialSession) {
          setSession(initialSession);
          const initialUser = transformUser(initialSession.user);
          setUser(initialUser);
          
          if (initialUser) {
            saveUserToLocalStorage(initialUser);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession);
      
      // Simple state updates first (synchronous operations)
      setSession(newSession);
      
      // Process user transformation safely
      if (newSession?.user) {
        const newUser = transformUser(newSession.user);
        setUser(newUser);
        
        // Defer localStorage operation to prevent potential deadlock
        setTimeout(() => {
          if (newUser) {
            saveUserToLocalStorage(newUser);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('corporify_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setIsLoading]);

  const value = {
    user,
    isLoading,
    login,
    signUp,
    logout,
    googleSignIn,
    upgradeAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
