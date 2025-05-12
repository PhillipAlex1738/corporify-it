
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '@/utils/userTransform';

// The admin email address - hardcoded for now
const ADMIN_EMAIL = "admin@corporifyit.io"; 

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAdmin,
    session,
    setSession
  };
};
