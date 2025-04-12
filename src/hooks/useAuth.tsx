
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContext } from './useAuthContext';
import { transformUser, saveUserToLocalStorage, User } from '@/utils/userTransform';
import { 
  loginWithEmailAndPassword, 
  signUpWithEmailAndPassword, 
  signInWithGoogle, 
  signOut,
  upgradeUserAccount
} from '@/services/authService';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

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
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { success, error, isEmailNotConfirmed } = await loginWithEmailAndPassword(email, password);
      
      if (!success && error) {
        throw error;
      }

      toast({
        title: isEmailNotConfirmed ? "Login successful" : "Logged in successfully",
        description: isEmailNotConfirmed ? "Welcome to Corporify!" : "Welcome back! Your data will be stored in Supabase.",
      });
    } catch (error: any) {
      console.error('Login failed', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { success, error, user: newUser } = await signUpWithEmailAndPassword(email, password);

      if (!success && error) {
        throw error;
      }

      if (newUser) {
        setUser(newUser);
        saveUserToLocalStorage(newUser);
        
        toast({
          title: "Account created and logged in",
          description: "Welcome to Corporify! You can start using the app immediately.",
        });
        return;
      }

      toast({
        title: "Account created",
        description: "Welcome to Corporify! Please log in to start using the app.",
      });
    } catch (error: any) {
      console.error('Sign-up failed', error);
      toast({
        title: "Sign-up failed",
        description: error.message || "Please try again with a different email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();

      if (error) {
        throw error;
      }

      toast({
        title: "Redirecting to Google",
        description: "Please complete sign in with Google.",
      });
    } catch (error: any) {
      console.error('Google sign-in failed', error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
    } catch (error: any) {
      console.error('Logout failed', error);
      toast({
        title: "Logout failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const upgradeAccount = async () => {
    try {
      if (user) {
        const upgradedUser = upgradeUserAccount(user);
        setUser(upgradedUser);
        
        toast({
          title: "Account upgraded",
          description: "You now have unlimited access to Corporify!",
        });
      }
    } catch (error: any) {
      console.error('Upgrade failed', error);
      toast({
        title: "Upgrade failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
