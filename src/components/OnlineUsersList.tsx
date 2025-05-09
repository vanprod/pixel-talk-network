
import React from 'react';
import { UserAvatar } from './UserAvatar';

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
];

interface OnlineUsersListProps {
  onSelectUser?: (user: User) => void;
}

export function OnlineUsersList({ onSelectUser }: OnlineUsersListProps) {
  // Sort users by online status first, then by name
  const sortedUsers = [...MOCK_USERS].sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-1">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Users</h3>
      
      {sortedUsers.map(user => (
        <div 
          key={user.id}
          className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
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
      ))}
    </div>
  );
}
