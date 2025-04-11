
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

type User = {
  id: string;
  email: string;
  isPremium: boolean;
  usageCount: number;
  usageLimit: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  googleSignIn: () => Promise<void>;
  upgradeAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Transform Supabase user to our app's User type
  const transformUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    
    // Get existing user data from localStorage if available
    const existingUserData = localStorage.getItem('corporify_user');
    let usageCount = 0;
    let isPremium = false;
    
    if (existingUserData) {
      try {
        const parsedData = JSON.parse(existingUserData);
        usageCount = parsedData.usageCount || 0;
        isPremium = parsedData.isPremium || false;
      } catch (e) {
        console.error('Failed to parse existing user data', e);
      }
    }
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      isPremium,
      usageCount,
      usageLimit: 3, // Default limit for free users
    };
  };

  // Save user data to localStorage
  const saveUserToLocalStorage = (userData: User) => {
    localStorage.setItem('corporify_user', JSON.stringify(userData));
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        setSession(newSession);
        const newUser = transformUser(newSession?.user || null);
        setUser(newUser);
        
        if (newUser) {
          saveUserToLocalStorage(newUser);
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
      console.log("Attempting login with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Logged in successfully",
        description: "Welcome back! Your data will be stored in Supabase.",
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created",
        description: "Welcome to Corporify! Check your email for verification.",
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        throw error;
      }

      // The redirect happens automatically - this toast may not be seen
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
      await supabase.auth.signOut();
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
        const upgradedUser = {
          ...user,
          isPremium: true,
          usageLimit: Infinity,
        };
        saveUserToLocalStorage(upgradedUser);
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
