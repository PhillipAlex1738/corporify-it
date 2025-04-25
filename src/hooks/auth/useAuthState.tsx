import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { User } from '@/utils/userTransform';
import { 
  loginWithEmailAndPassword, 
  signUpWithEmailAndPassword, 
  signInWithGoogle, 
  signOut,
  upgradeUserAccount
} from '@/services/authService';

// The admin email address - replace this with your own email
const ADMIN_EMAIL = "admin@corporifyit.io"; 

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { success, error, isEmailNotConfirmed } = await loginWithEmailAndPassword(email, password);
      
      if (!success && error) {
        console.error('Login error details:', error);
        throw error;
      }

      toast({
        title: isEmailNotConfirmed ? "Login successful" : "Logged in successfully",
        description: isEmailNotConfirmed ? "Welcome to Corporify It!" : "Welcome back!",
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

  return {
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
    googleSignIn,
    upgradeAccount,
  };
};
