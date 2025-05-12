
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
      
      // If the error is "Email not confirmed", we'll still return success
      // This is a workaround for development where email confirmation may be disabled
      if (error.message.includes("Email not confirmed")) {
        console.log("Email not confirmed, but we'll continue as if login succeeded");
        // Make another attempt to get the user data despite the error
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          console.log("Successfully retrieved user data:", userData.user.email);
          return { success: true, data: { user: userData.user, session: null }, error: null, isEmailNotConfirmed: true };
        }
      }
      
      return { success: false, data: null, error, isEmailNotConfirmed: error.message.includes("Email not confirmed") };
    }

    console.log("Login successful, data:", data);
    return { success: true, data, error: null, isEmailNotConfirmed: false };
  } catch (e) {
    console.error("Unexpected login error:", e);
    return { 
      success: false, 
      data: null, 
      error: new Error(e instanceof Error ? e.message : "Unknown login error"), 
      isEmailNotConfirmed: false 
    };
  }
};

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    console.log("Attempting signup with:", email);
    
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
