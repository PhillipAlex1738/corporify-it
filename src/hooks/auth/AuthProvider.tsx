
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
  } = useAuthState();

  useEffect(() => {
    console.log("Setting up auth provider and listeners");
    let isInitialized = false;
    
    // First set up the auth listener before checking for session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email || 'No user');
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state');
        setUser(null);
        setSession(null);
        localStorage.removeItem('corporify_user');
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('User signed in or token refreshed, updating state');
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
            setUser(userData);
          } catch (e) {
            console.error('Failed to parse stored user data:', e);
          }
        }
        
        // Then check for session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
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
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
