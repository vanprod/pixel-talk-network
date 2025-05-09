
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Mock user data structure - would connect to Firebase in a real implementation
interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  lastLogin: string;
  isOnline: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - simulate database
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123', // This is just for demo purposes
    displayName: 'PixelUser',
    lastLogin: new Date().toISOString(),
    isOnline: false,
  },
  {
    id: '2',
    email: 'demo@example.com',
    password: 'demo123', // This is just for demo purposes
    displayName: 'CryptoFan',
    lastLogin: new Date().toISOString(),
    isOnline: false,
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser({
          ...parsedUser,
          lastLogin: new Date().toISOString(),
          isOnline: true
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user with matching email and password
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // Create authenticated user object (without password)
    const authenticatedUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      lastLogin: new Date().toISOString(),
      isOnline: true,
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    
    setCurrentUser(authenticatedUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        isAuthenticated: !!currentUser,
        isLoading 
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
