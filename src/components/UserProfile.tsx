
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export function UserProfile() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');

  if (!currentUser) return null;

  // Get initials for avatar fallback
  const initials = currentUser.displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const handleSave = () => {
    // In a real application, this would call an API to update the user's display name
    // For now, we'll just show a toast
    toast({
      title: "Profile updated",
      description: `Display name changed to ${displayName}`,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b relative">
      <Avatar>
        <AvatarImage src={currentUser.avatar} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <Input 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)}
            className="retro-input h-8"
            placeholder="Display name"
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="text-xs" 
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <h3 className="font-mono font-bold">{currentUser.displayName}</h3>
          <p className="text-xs text-muted-foreground">
            Last login: {new Date(currentUser.lastLogin).toLocaleString()}
          </p>
        </div>
      )}
      
      {!isEditing && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 hover:bg-accent hover:text-accent-foreground rounded-full"
          onClick={() => setIsEditing(true)}
        >
          <Pen size={16} />
        </Button>
      )}
    </div>
  );
}
