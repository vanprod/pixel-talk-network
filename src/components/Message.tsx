
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';

interface MessageProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  sender?: {
    name: string;
    avatar?: string;
  };
  imageUrl?: string;
}

export function Message({ content, timestamp, isCurrentUser, sender, imageUrl }: MessageProps) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && sender && (
        <div className="mr-2 mt-1">
          <UserAvatar name={sender.name} image={sender.avatar} size="sm" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] rounded px-3 py-2",
        imageUrl && "max-w-xs",
        isCurrentUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground'
      )}>
        {!isCurrentUser && sender && (
          <div className="text-xs font-bold mb-1">{sender.name}</div>
        )}
        
        {imageUrl && (
          <div className="mb-2">
            <img 
              src={imageUrl} 
              alt="Shared image" 
              className="max-w-full rounded object-cover cursor-pointer hover:opacity-90"
              onClick={() => window.open(imageUrl, '_blank')}
            />
          </div>
        )}
        
        {content && <div className="text-sm break-words">{content}</div>}
        
        <div className="text-xs mt-1 opacity-70">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
