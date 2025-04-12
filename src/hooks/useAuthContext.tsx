
import React, { createContext } from 'react';
import { User } from '@/utils/userTransform';

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  googleSignIn: () => Promise<void>;
  upgradeAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
