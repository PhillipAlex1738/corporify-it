
import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  id: string;
  email: string;
  isPremium: boolean;
  usageCount: number;
  usageLimit: number;
};

// Transform Supabase user to our app's User type
export const transformUser = (supabaseUser: SupabaseUser | null): User | null => {
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
export const saveUserToLocalStorage = (userData: User) => {
  localStorage.setItem('corporify_user', JSON.stringify(userData));
};
