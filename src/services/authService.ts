
import { supabase } from '@/integrations/supabase/client';
import { transformUser, saveUserToLocalStorage, User } from '@/utils/userTransform';

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  console.log("Attempting login with:", email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login error:", error.message);
    
    // If the error is "Email not confirmed", we'll show a success message anyway
    if (error.message.includes("Email not confirmed")) {
      return { success: true, data, error: null, isEmailNotConfirmed: true };
    }
    
    return { success: false, data: null, error, isEmailNotConfirmed: false };
  }

  console.log("Login successful, data:", data);
  return { success: true, data, error: null, isEmailNotConfirmed: false };
};

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin
    }
  });

  if (error) {
    return { success: false, data: null, error };
  }

  // Only proceed if both data and data.user are non-null
  if (data && data.user) {
    console.log("Signup successful, data:", data);
    const newUser = transformUser(data.user);
    
    if (newUser) {
      return { success: true, data, error: null, user: newUser };
    }
  }

  return { success: true, data, error: null, user: null };
};

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const upgradeUserAccount = (user: User): User => {
  const upgradedUser = {
    ...user,
    isPremium: true,
    usageLimit: Infinity,
  };
  saveUserToLocalStorage(upgradedUser);
  return upgradedUser;
};
