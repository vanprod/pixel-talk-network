import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  saveUser, 
  getUserByEmail, 
  verifyCredentials as verifyUserCredentials,
  getUserById
} from '@/services/dataService';

// User data structure
export interface User {
  id: string;
  email: string;
  password?: string; // Only used during registration/login, not stored in state
  displayName: string;
  avatar?: string;
  lastLogin: string;
  isOnline: boolean;
  friends?: string[]; // Array of user IDs
}

interface ProfileUpdateData {
  displayName?: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => void;
  addFriend: (userId: string) => void;
  removeFriend: (userId: string) => void;
  isFriend: (userId: string) => boolean;
  getFriends: () => User[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users (for demo purposes)
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    displayName: 'PixelUser',
    lastLogin: new Date().toISOString(),
    isOnline: false,
    friends: ['2']
  },
  {
    id: '2',
    email: 'demo@example.com',
    password: 'demo123',
    displayName: 'CryptoFan',
    lastLogin: new Date().toISOString(),
    isOnline: false,
    friends: ['1']
  }
];

// Initialize default users on first load
const initializeDefaultUsers = () => {
  MOCK_USERS.forEach(user => {
    if (!getUserByEmail(user.email)) {
      saveUser(user);
    }
  });
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize default users
    initializeDefaultUsers();
    
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
        
        // Update user status in storage
        saveUser({
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
    
    // Verify credentials
    const user = verifyUserCredentials(email, password);
    
    if (!user) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // Create authenticated user object (without password)
    const authenticatedUser = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      lastLogin: new Date().toISOString(),
      isOnline: true,
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    
    // Update user status in storage
    saveUser({
      ...authenticatedUser,
      password: user.password // Keep password in storage but not in state
    });
    
    setCurrentUser(authenticatedUser);
    setIsLoading(false);
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user with this email already exists
    const existingUser = getUserByEmail(email);
    
    if (existingUser) {
      setIsLoading(false);
      throw new Error('Email already registered');
    }
    
    // Generate a unique ID
    const id = `user_${Date.now()}`;
    
    // Create a new user
    const newUser = {
      id,
      email,
      password,
      displayName,
      lastLogin: new Date().toISOString(),
      isOnline: true,
    };
    
    // Save user to storage
    saveUser(newUser);
    
    // Create authenticated user object (without password)
    const authenticatedUser = {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      lastLogin: newUser.lastLogin,
      isOnline: newUser.isOnline,
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    
    setCurrentUser(authenticatedUser);
    setIsLoading(false);
  };

  const logout = () => {
    // Update user status in storage if we have a current user
    if (currentUser) {
      saveUser({
        ...currentUser,
        isOnline: false,
        lastLogin: new Date().toISOString(),
      });
    }
    
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  
  const updateProfile = (data: ProfileUpdateData) => {
    if (!currentUser) return;
    
    const updatedUser = {...currentUser, ...data};
    
    // Update in local state
    setCurrentUser(updatedUser);
    
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in storage
    saveUser(updatedUser);
  };
  
  const addFriend = (userId: string) => {
    if (!currentUser) return;
    
    // Don't add if already a friend or trying to add self
    if (isFriend(userId) || userId === currentUser.id) return;
    
    const friends = currentUser.friends || [];
    const updatedUser = {
      ...currentUser,
      friends: [...friends, userId]
    };
    
    // Update in local state
    setCurrentUser(updatedUser);
    
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in storage
    saveUser(updatedUser);
  };
  
  const removeFriend = (userId: string) => {
    if (!currentUser || !currentUser.friends) return;
    
    const updatedFriends = currentUser.friends.filter(id => id !== userId);
    const updatedUser = {
      ...currentUser,
      friends: updatedFriends
    };
    
    // Update in local state
    setCurrentUser(updatedUser);
    
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in storage
    saveUser(updatedUser);
  };
  
  const isFriend = (userId: string) => {
    if (!currentUser || !currentUser.friends) return false;
    return currentUser.friends.includes(userId);
  };
  
  const getFriends = (): User[] => {
    if (!currentUser || !currentUser.friends) return [];
    
    return currentUser.friends
      .map(id => getUserById(id))
      .filter((user): user is User => user !== undefined);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        register,
        updateProfile,
        addFriend,
        removeFriend,
        isFriend,
        getFriends,
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
