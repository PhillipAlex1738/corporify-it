
import { useToast } from "@/components/ui/use-toast";
import { User } from '@/utils/userTransform';
import { 
  loginWithEmailAndPassword, 
  signUpWithEmailAndPassword, 
  signOut,
  upgradeUserAccount
} from '@/services/authService';
import { useAuthSession } from './useAuthSession';
import { useAuthNotifications } from './useAuthNotifications';

export const useAuthActions = () => {
  const { user, setUser, setIsLoading, setSession } = useAuthSession();
  const { toast } = useToast();
  const { sendWelcomeEmail, showToast } = useAuthNotifications();

  // Helper function to force clear auth state
  const clearAuthState = () => {
    console.log("Forcefully clearing all auth state");
    setUser(null);
    setSession(null);
    localStorage.removeItem('corporify_user');
  };

  const login = async (email: string, password: string): Promise<{ success: boolean }> => {
    setIsLoading(true);
    try {
      console.log("Starting login attempt with:", email);
      const { success, error, data, isEmailNotConfirmed } = await loginWithEmailAndPassword(email, password);
      
      if (!success && error) {
        console.error('Login error details:', error);
        showToast(
          "Login failed",
          error.message || "Please check your credentials and try again.",
          "destructive"
        );
        throw error;
      }

      // Show a success toast when login is successful
      showToast(
        "Login successful",
        isEmailNotConfirmed ? "Welcome! (Email verification pending)" : "Welcome to Corporify It!"
      );
      
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
      showToast(
        "Login failed",
        error.message || "Please check your credentials and try again.",
        "destructive"
      );
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
        showToast(
          "Sign-up failed",
          error.message || "Please try again with a different email.",
          "destructive"
        );
        throw error;
      }

      if (newUser) {
        setUser(newUser);
        
        showToast(
          "Account created",
          "Welcome to Corporify It! You can start using the app immediately. Please check your email for verification."
        );
        
        return { success };
      }

      showToast(
        "Account created",
        "Welcome to Corporify It! Please check your email to verify your account."
      );
      
      return { success };
    } catch (error: any) {
      console.error('Sign-up failed', error);
      showToast(
        "Sign-up failed",
        error.message || "Please try again with a different email.",
        "destructive"
      );
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
      
      // First clear local state immediately to ensure UI updates
      clearAuthState();
      
      // Then attempt to sign out from Supabase
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        showToast(
          "Logout warning",
          "You've been logged out locally, but there was an issue with the server: " + error.message,
          "destructive"
        );
      } else {
        console.log("Logout successful");
        showToast(
          "Logged out",
          "You've been logged out successfully."
        );
      }
    } catch (error: any) {
      console.error('Logout failed', error);
      showToast(
        "Logout warning",
        "You've been logged out locally, but there was an issue with the server.",
        "destructive"
      );
    } finally {
      // Ensure auth state is cleared even if there was an error
      clearAuthState();
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
        
        showToast(
          "Account upgraded",
          "You now have unlimited access to Corporify It!"
        );
      }
    } catch (error: any) {
      console.error('Upgrade failed', error);
      showToast(
        "Upgrade failed",
        error.message || "Please try again later.",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signUp,
    logout,
    upgradeAccount,
    sendWelcomeEmail,
    clearAuthState
  };
};
