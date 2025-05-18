
import { supabase } from '@/integrations/supabase/client';
import { transformUser, saveUserToLocalStorage, User } from '@/utils/userTransform';

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  console.log("Attempting login with:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Login error:", error.message, error);
      return { success: false, data: null, error };
    }

    // Success case with proper data
    if (data && (data.session || data.user)) {
      console.log("Login successful, data:", data);
      return { success: true, data, error: null };
    }
    
    // Edge case: we got a response but no proper data
    console.warn("Login returned success but with incomplete data:", data);
    return { success: false, data, error: new Error("Invalid response from authentication service") };
  } catch (e) {
    console.error("Unexpected login error:", e);
    return { 
      success: false, 
      data: null, 
      error: new Error(e instanceof Error ? e.message : "Unknown login error")
    };
  }
};

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    console.log("Attempting signup with:", email);
    
    // For development purposes, we'll use simple signUp without email verification
    // For production, you'd want to set emailRedirectTo
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      console.error("Signup error:", error);
      return { success: false, data: null, error };
    }

    // Check for "null" user, which means email confirmation is required
    if (data && data.user && data.user.identities?.length === 0) {
      console.log("User already exists, needs to login instead:", data);
      return { 
        success: false, 
        data, 
        error: new Error("This email is already registered. Please log in instead."),
        user: null
      };
    }

    // Only proceed if both data and data.user are non-null
    if (data && data.user) {
      console.log("Signup successful, data:", data);
      const newUser = transformUser(data.user);
      
      if (newUser) {
        return { success: true, data, error: null, user: newUser };
      }
    } else {
      console.log("Signup returned no user data:", data);
    }

    return { success: true, data, error: null, user: null };
  } catch (e) {
    console.error("Unexpected signup error:", e);
    return { 
      success: false, 
      data: null, 
      error: new Error(e instanceof Error ? e.message : "Unknown signup error"),
      user: null 
    };
  }
};

export const signOut = async () => {
  try {
    console.log("Attempting to sign out");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
    } else {
      console.log("Sign out successful");
    }
    return { error };
  } catch (e) {
    console.error("Unexpected sign out error:", e);
    return { error: new Error(e instanceof Error ? e.message : "Unknown sign out error") };
  }
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
