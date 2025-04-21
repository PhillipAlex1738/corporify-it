
import { useContext } from 'react';
import { AuthContext } from './useAuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log("useAuth hook called, user state:", context.user ? `User ${context.user.email} is logged in` : "No user logged in");
  return context;
};
