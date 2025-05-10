
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMessageService } from '@/services/messageService';
import { toast } from '@/components/ui/use-toast';
import { Image, BookText } from 'lucide-react'; // Changed Story to BookText

export function StoryCreator() {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { createStory } = useMessageService();
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !imageFile) {
      toast({
        title: "Cannot create empty story",
        description: "Please add some text or an image to your story",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createStory(content, imageFile || undefined);
      
      toast({
        title: "Story created",
        description: "Your story has been shared with your friends"
      });
      
      // Reset form
      setContent('');
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Failed to create story",
        description: "There was an error creating your story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center">
        <BookText className="w-5 h-5 mr-2" /> {/* Changed Story to BookText */}
        <h3 className="font-bold">Create a Story</h3>
      </div>
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="resize-none"
        rows={3}
      />
      
      {previewUrl && (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Story preview" 
            className="w-full h-40 object-cover rounded-md" 
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
            onClick={() => {
              setImageFile(null);
              setPreviewUrl(null);
            }}
          >
            &times;
          </button>
        </div>
      )}
      
      <div className="flex justify-between">
        <label className="flex items-center cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Image className="w-4 h-4 mr-2" />
          Add Photo
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageSelect} 
            disabled={isSubmitting}
          />
        </label>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || (!content.trim() && !imageFile)}
        >
          {isSubmitting ? 'Posting...' : 'Share Story'}
        </Button>
      </div>
    </form>
  );
}
