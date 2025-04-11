
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      const savedUser = localStorage.getItem('corporify_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          console.log("User authenticated from localStorage:", JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse user data');
          localStorage.removeItem('corporify_user');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // In a real app, this would connect to Supabase or another auth provider
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", email);
      // Mock authentication for demo purposes
      // In production, this would be a call to your authentication service
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        isPremium: false,
        usageCount: 0,
        usageLimit: 3,
      };

      // Save user to localStorage as a simple session mechanism
      localStorage.setItem('corporify_user', JSON.stringify(mockUser));
      setUser(mockUser);
      console.log("Login successful, user data:", mockUser);
      toast({
        title: "Logged in successfully",
        description: "Welcome back! Your data will be stored in Supabase when you use the app.",
      });
    } catch (error) {
      console.error('Login failed', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock sign-up for demo purposes
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        isPremium: false,
        usageCount: 0,
        usageLimit: 3,
      };

      localStorage.setItem('corporify_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Account created",
        description: "Welcome to Corporify!",
      });
    } catch (error) {
      console.error('Sign-up failed', error);
      toast({
        title: "Sign-up failed",
        description: "Please try again with a different email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      // Mock Google sign-in
      const mockUser: User = {
        id: `google_user_${Date.now()}`,
        email: 'google_user@example.com',
        isPremium: false,
        usageCount: 0,
        usageLimit: 3,
      };

      localStorage.setItem('corporify_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Logged in with Google",
        description: "Welcome to Corporify!",
      });
    } catch (error) {
      console.error('Google sign-in failed', error);
      toast({
        title: "Google sign-in failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('corporify_user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  const upgradeAccount = async () => {
    try {
      // In a real app, this would handle Stripe payment and update user status
      if (user) {
        const upgradedUser = {
          ...user,
          isPremium: true,
          usageLimit: Infinity,
        };
        localStorage.setItem('corporify_user', JSON.stringify(upgradedUser));
        setUser(upgradedUser);
        toast({
          title: "Account upgraded",
          description: "You now have unlimited access to Corporify!",
        });
      }
    } catch (error) {
      console.error('Upgrade failed', error);
      toast({
        title: "Upgrade failed",
        description: "Please try again later.",
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
