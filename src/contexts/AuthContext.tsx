
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthService } from '@/hooks/useAuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthService();

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser: auth.currentUser, 
        login: auth.login, 
        logout: auth.logout, 
        register: auth.register,
        updateProfile: auth.updateProfile,
        addFriend: auth.addFriend,
        removeFriend: auth.removeFriend,
        isFriend: auth.isFriend,
        getFriends: auth.getFriends,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Re-export types for convenience
export type { User, ProfileUpdateData } from '@/types/auth';
