
import { useAuthSession } from './useAuthSession';
import { useAuthActions } from './useAuthActions';

export const useAuthState = () => {
  const { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    isAdmin, 
    session, 
    setSession 
  } = useAuthSession();
  
  const { 
    login, 
    signUp, 
    logout, 
    upgradeAccount, 
    sendWelcomeEmail 
  } = useAuthActions();

  return {
    // Session state
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAdmin,
    session,
    setSession,
    
    // Auth actions
    login,
    signUp,
    logout,
    upgradeAccount,
    sendWelcomeEmail,
  };
};
