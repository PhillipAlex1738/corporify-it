
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
    // First set up the auth listener before checking for session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        localStorage.removeItem('corporify_user');
        return;
      }
      
      // Update session state immediately
      setSession(newSession);
      
      // Process user data if available
      if (newSession?.user) {
        const newUser = transformUser(newSession.user);
        setUser(newUser);
        
        // Use setTimeout to avoid potential deadlocks with Supabase
        if (newUser) {
          setTimeout(() => {
            saveUserToLocalStorage(newUser);
          }, 0);
        }
      }
    });

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        console.log('Initial session check:', data.session);
        
        if (data.session) {
          setSession(data.session);
          const initialUser = transformUser(data.session.user);
          if (initialUser) {
            setUser(initialUser);
            saveUserToLocalStorage(initialUser);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

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
