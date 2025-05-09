
import { useState } from 'react';

// Interface for user data
export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
}

// Mock user data
const INITIAL_USERS: User[] = [
  { id: '1', name: 'PixelUser', status: 'online' },
  { id: '2', name: 'CryptoFan', status: 'online' },
  { id: '3', name: 'SatoshiLite', status: 'away', lastSeen: new Date() },
  { id: '4', name: 'BlockchainDev', status: 'offline', lastSeen: new Date(Date.now() - 3600000) },
  { id: '5', name: 'TokenTrader', status: 'busy' },
  { id: '6', name: 'EthMaster', status: 'online' },
  { id: '7', name: 'BitcoinMiner', status: 'online' },
  { id: '8', name: 'DeFiExplorer', status: 'away', lastSeen: new Date() },
  { id: '9', name: 'NFTCollector', status: 'offline', lastSeen: new Date(Date.now() - 7200000) },
  { id: '10', name: 'ChainAnalyst', status: 'online' },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  
  // Find a user by ID
  const findUserById = (id: string) => {
    return users.find(user => user.id === id);
  };
  
  // Search users by name
  const searchUsersByName = (query: string) => {
    if (!query) return users;
    
    const lowerQuery = query.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowerQuery)
    );
  };
  
  // Update a user's status
  const updateUserStatus = (id: string, status: User['status']) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id 
          ? { ...user, status, lastSeen: status !== 'online' ? new Date() : undefined } 
          : user
      )
    );
  };
  
  return {
    users,
    findUserById,
    searchUsersByName,
    updateUserStatus
  };
}
