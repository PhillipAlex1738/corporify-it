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

// The admin email address - hardcoded for now
const ADMIN_EMAIL = "admin@corporifyit.io"; 

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  const login = async (email: string, password: string): Promise<{ success: boolean }> => {
    setIsLoading(true);
    try {
      console.log("Starting login attempt with:", email);
      const { success, error, isEmailNotConfirmed } = await loginWithEmailAndPassword(email, password);
      
      if (!success && error) {
        console.error('Login error details:', error);
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: isEmailNotConfirmed ? "Login successful" : "Logged in to Corporify It",
        description: isEmailNotConfirmed ? "Welcome to Corporify It!" : "Welcome back!",
      });
      
      return { success };
    } catch (error: any) {
      console.error('Login failed', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      setIsLoading(false); // Ensure loading is reset on error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean }> => {
    setIsLoading(true);
    try {
      console.log("Starting signup attempt with:", email);
      const { success, error, user: newUser } = await signUpWithEmailAndPassword(email, password);

      if (!success && error) {
        toast({
          title: "Sign-up failed",
          description: error.message || "Please try again with a different email.",
          variant: "destructive",
        });
        throw error;
      }

      if (newUser) {
        setUser(newUser);
        
        toast({
          title: "Account created and logged in",
          description: "Welcome to Corporify It! You can start using the app immediately.",
        });
        return { success };
      }

      toast({
        title: "Account created for Corporify It",
        description: "Welcome to Corporify It! Please log in to start using the app.",
      });
      
      return { success };
    } catch (error: any) {
      console.error('Sign-up failed', error);
      toast({
        title: "Sign-up failed",
        description: error.message || "Please try again with a different email.",
        variant: "destructive",
      });
      setIsLoading(false); // Ensure loading is reset on error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async (): Promise<{ success: boolean }> => {
    setIsLoading(true);
    try {
      console.log("Starting Google sign-in attempt");
      const { error } = await signInWithGoogle();

      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: "Google sign-in failed",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Redirecting to Google",
        description: "Please complete sign in with Google.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Google sign-in failed', error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false); // Ensure loading is reset on error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Starting logout attempt");
      await signOut();
      console.log("Logout successful - waiting for auth state change to clear user data");
      // Note: We don't clear user data here because the auth listener will do that
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
      // Force clear user data even if there's an error
      setUser(null);
      setSession(null);
      localStorage.removeItem('corporify_user');
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeAccount = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Starting account upgrade");
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
    } finally {
      setIsLoading(false);
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
