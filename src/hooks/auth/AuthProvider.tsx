
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        // Never call other Supabase functions inside this callback directly
        setSession(newSession);
        const newUser = transformUser(newSession?.user || null);
        setUser(newUser);
        
        if (newUser) {
          setTimeout(() => {
            // Move operations to a new execution context to prevent deadlock
            saveUserToLocalStorage(newUser);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('corporify_user');
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session:', initialSession);
      setSession(initialSession);
      setUser(transformUser(initialSession?.user || null));
      setIsLoading(false);
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
