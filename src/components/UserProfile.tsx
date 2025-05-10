
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pen, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { fileToDataUrl, validateImageFile } from '@/utils/fileUtils';

export function UserProfile() {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isUploading, setIsUploading] = useState(false);

  if (!currentUser) return null;

  // Get initials for avatar fallback
  const initials = currentUser.displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const handleSave = () => {
    updateProfile({ displayName });
    toast({
      title: "Profile updated",
      description: `Display name changed to ${displayName}`,
    });
    setIsEditing(false);
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    if (!validateImageFile(file)) {
      toast({
        title: "Invalid image",
        description: "Please select a JPEG, PNG, GIF, or WebP under 5MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      const imageUrl = await fileToDataUrl(file);
      updateProfile({ avatar: imageUrl });
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b relative">
      <div className="relative">
        <Avatar className="h-14 w-14">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/80 transition-colors">
          <Camera size={16} />
          <input 
            type="file" 
            id="avatar-upload" 
            className="sr-only" 
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      </div>
      
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
