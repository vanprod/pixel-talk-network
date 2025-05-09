
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface UserAvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export function UserAvatar({ name, image, size = 'md', status }: UserAvatarProps) {
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="relative">
      <Avatar className={`${sizeClass[size]} border-2 border-border`}>
        {image ? (
          <AvatarImage src={image} alt={name} />
        ) : null}
        <AvatarFallback className="font-mono">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {status && (
        <span className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full 
          ${status === 'online' ? 'bg-green-500' :
            status === 'away' ? 'bg-yellow-500' :
            status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
          } ring-1 ring-white`}
        />
      )}
    </div>
  );
}
