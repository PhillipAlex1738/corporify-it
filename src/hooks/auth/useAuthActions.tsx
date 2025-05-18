
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
    try {
      setIsLoading(true);
      console.log("Starting login attempt with:", email);
      const { success, error, data } = await loginWithEmailAndPassword(email, password);
      
      console.log("Login response:", { success, hasError: !!error, hasData: !!data });
      
      if (!success || error) {
        const errorMessage = error?.message || "Please check your credentials and try again.";
        console.error('Login error details:', error || "No specific error returned");
        showToast("Login failed", errorMessage, "destructive");
        return { success: false };
      }

      // Success case - show toast only if we have session data
      if (data && (data.session || data.user)) {
        showToast("Login successful", "Welcome to Corporify It!");
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Login failed', error);
      showToast(
        "Login failed",
        error.message || "Please check your credentials and try again.",
        "destructive"
      );
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean }> => {
    try {
      setIsLoading(true);
      console.log("Starting signup attempt with:", email);
      const { success, error, user: newUser } = await signUpWithEmailAndPassword(email, password);

      console.log("Signup response:", { success, hasError: !!error, hasUser: !!newUser });

      if (!success || error) {
        const errorMessage = error?.message || "Please try again with a different email.";
        console.error('Signup error details:', error || "No specific error returned");
        showToast("Sign-up failed", errorMessage, "destructive");
        return { success: false };
      }

      // Set user if we have one
      if (newUser) {
        setUser(newUser);
        showToast(
          "Account created",
          "Welcome to Corporify It! You can start using the app immediately."
        );
      } else {
        showToast(
          "Account created",
          "Welcome to Corporify It! Please check your email to verify your account."
        );
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign-up failed', error);
      showToast(
        "Sign-up failed",
        error.message || "Please try again with a different email.",
        "destructive"
      );
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("Starting logout attempt");
      
      // First clear local state immediately to ensure UI updates
      clearAuthState();
      setIsLoading(true);
      
      // Then attempt to sign out from Supabase
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        showToast(
          "Logout warning",
          "You've been logged out locally, but there was an issue with the server.",
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
