
// Define user data structure
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

export interface ProfileUpdateData {
  displayName?: string;
  avatar?: string;
}

export interface AuthContextType {
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
