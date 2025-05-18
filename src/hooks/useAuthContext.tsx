
import React, { createContext } from 'react';
import { User } from '@/utils/userTransform';

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  upgradeAccount: () => Promise<void>;
  sendWelcomeEmail: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
