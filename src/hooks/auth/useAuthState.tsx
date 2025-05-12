
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { User } from '@/utils/userTransform';
import { 
  loginWithEmailAndPassword, 
  signUpWithEmailAndPassword, 
  signOut,
  upgradeUserAccount
} from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

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
      const { success, error, data, isEmailNotConfirmed } = await loginWithEmailAndPassword(email, password);
      
      if (!success && error) {
        console.error('Login error details:', error);
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
        throw error;
      }

      // Show a success toast when login is successful
      toast({
        title: "Login successful",
        description: isEmailNotConfirmed ? "Welcome! (Email verification pending)" : "Welcome to Corporify It!",
      });
      
      // If we have user data from an "email not confirmed" case
      if (isEmailNotConfirmed && data?.user) {
        const transformedUser = {
          id: data.user.id,
          email: data.user.email || '',
          isPremium: false,
          usageCount: 0,
          usageLimit: 3,
        };
        console.log("Setting user from email not confirmed case:", transformedUser.email);
        setUser(transformedUser);
        localStorage.setItem('corporify_user', JSON.stringify(transformedUser));
      }
      
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
          title: "Account created",
          description: "Welcome to Corporify It! You can start using the app immediately. Please check your email for verification.",
        });
        
        return { success };
      }

      toast({
        title: "Account created",
        description: "Welcome to Corporify It! Please check your email to verify your account.",
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

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Starting logout attempt");
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
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
          description: "You now have unlimited access to Corporify It!",
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
  
  const sendWelcomeEmail = async (email: string): Promise<void> => {
    try {
      console.log("Sending welcome email to:", email);
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          type: 'welcome',
          data: { email }
        }
      });
      
      if (response.error) {
        console.error("Error sending welcome email:", response.error);
        return;
      }
      
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error here, as this is not critical functionality
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
    upgradeAccount,
    sendWelcomeEmail,
  };
};
