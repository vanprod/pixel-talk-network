
import React, { useState } from 'react';
import { UserAvatar } from './UserAvatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
}

// Mock user data - would be fetched from a database in a real implementation
const MOCK_USERS: User[] = [
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

interface OnlineUsersListProps {
  onSelectUser?: (user: User) => void;
  selectedUserId?: string;
}

export function OnlineUsersList({ onSelectUser, selectedUserId }: OnlineUsersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users based on search term
  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort users: selected first, then online, then by name
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Selected user comes first
    if (a.id === selectedUserId) return -1;
    if (b.id === selectedUserId) return 1;
    
    // Then sort by online status
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    
    // Finally sort by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="p-3 sticky top-0 bg-background z-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Users ({filteredUsers.length})</h3>
        
        <div className="space-y-1 overflow-y-auto">
          {sortedUsers.length > 0 ? (
            sortedUsers.map(user => (
              <div 
                key={user.id}
                className={`flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer transition-colors ${
                  user.id === selectedUserId ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectUser?.(user)}
              >
                <UserAvatar name={user.name} image={user.avatar} size="sm" status={user.status} />
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  {user.status !== 'online' && user.lastSeen && (
                    <div className="text-xs text-muted-foreground">
                      Last seen: {new Date(user.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
