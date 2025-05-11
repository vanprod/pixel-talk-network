
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pen, Camera, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { fileToDataUrl, validateImageFile } from '@/utils/fileUtils';
import { resizeImage } from '@/lib/utils';

export function UserProfile() {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isUploading, setIsUploading] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(100); // percentage
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
      setImageToEdit(imageUrl);
      setShowImageEditor(true);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleApplyImageChanges = async () => {
    if (!imageToEdit || !imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const scale = imageSize / 100;
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    
    // Center the image in the canvas
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image with new size
    ctx.drawImage(img, x, y, width, height);
    
    try {
      const dataUrl = canvas.toDataURL('image/png');
      updateProfile({ avatar: dataUrl });
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully"
      });
      
      setShowImageEditor(false);
      setImageToEdit(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the image",
        variant: "destructive"
      });
    }
  };

  const handleCancelImageEdit = () => {
    setShowImageEditor(false);
    setImageToEdit(null);
    setImageSize(100);
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
      
      {/* Image Editor Modal */}
      {showImageEditor && imageToEdit && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="font-bold text-lg mb-4">Edit Profile Picture</h3>
            
            <div className="flex justify-center mb-4">
              <div className="relative border rounded-full overflow-hidden h-48 w-48">
                <img
                  ref={imageRef}
                  src={imageToEdit}
                  alt="Profile preview"
                  className="hidden"
                  onLoad={() => {
                    if (imageRef.current && canvasRef.current) {
                      const canvas = canvasRef.current;
                      const img = imageRef.current;
                      
                      canvas.width = 200;
                      canvas.height = 200;
                      
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        const scale = imageSize / 100;
                        const width = img.naturalWidth * scale;
                        const height = img.naturalHeight * scale;
                        
                        // Center the image in the canvas
                        const x = (canvas.width - width) / 2;
                        const y = (canvas.height - height) / 2;
                        
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, x, y, width, height);
                      }
                    }
                  }}
                />
                <canvas 
                  ref={canvasRef}
                  className="w-full h-full"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <ZoomOut size={16} />
              <Slider 
                value={[imageSize]} 
                onValueChange={(values) => {
                  setImageSize(values[0]);
                  
                  // Update canvas
                  if (imageRef.current && canvasRef.current) {
                    const canvas = canvasRef.current;
                    const img = imageRef.current;
                    const ctx = canvas.getContext('2d');
                    
                    if (ctx) {
                      const scale = values[0] / 100;
                      const width = img.naturalWidth * scale;
                      const height = img.naturalHeight * scale;
                      
                      // Center the image in the canvas
                      const x = (canvas.width - width) / 2;
                      const y = (canvas.height - height) / 2;
                      
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      ctx.drawImage(img, x, y, width, height);
                    }
                  }
                }}
                min={50}
                max={150}
                step={1}
                className="w-40"
              />
              <ZoomIn size={16} />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancelImageEdit}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApplyImageChanges}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
