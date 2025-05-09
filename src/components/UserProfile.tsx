
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfile() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // Get initials for avatar fallback
  const initials = currentUser.displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Avatar>
        <AvatarImage src={currentUser.avatar} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-mono font-bold">{currentUser.displayName}</h3>
        <p className="text-xs text-muted-foreground">
          Last login: {new Date(currentUser.lastLogin).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
