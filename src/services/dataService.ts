
// Data service for managing user data and messages
import { User } from '@/contexts/AuthContext';

// Define message structure
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

// Local storage keys
const USERS_STORAGE_KEY = 'pixel_talk_users';
const MESSAGES_STORAGE_KEY = 'pixel_talk_messages';

// Initialize local storage on first load
const initializeStorage = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(MESSAGES_STORAGE_KEY)) {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([]));
  }
};

// Initialize on import
initializeStorage();

// User management functions
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = { ...users[existingUserIndex], ...user };
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const usersData = localStorage.getItem(USERS_STORAGE_KEY);
  return usersData ? JSON.parse(usersData) : [];
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const verifyCredentials = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// Message management functions
export const saveMessage = (message: Message): Message => {
  const messages = getMessages();
  
  // Ensure message has an ID
  if (!message.id) {
    message.id = Date.now().toString();
  }
  
  messages.push(message);
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  return message;
};

export const getMessages = (): Message[] => {
  const messagesData = localStorage.getItem(MESSAGES_STORAGE_KEY);
  return messagesData ? JSON.parse(messagesData) : [];
};

export const getConversation = (userId1: string, userId2: string): Message[] => {
  const messages = getMessages();
  return messages.filter(
    message => 
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Delete all data (for testing/development)
export const clearAllData = (): void => {
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem(MESSAGES_STORAGE_KEY);
  initializeStorage();
};
