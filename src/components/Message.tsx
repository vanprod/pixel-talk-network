
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';
import { FileText, Play, Pause, Video } from 'lucide-react';
import { Button } from './ui/button';

interface MessageProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  sender?: {
    name: string;
    avatar?: string;
  };
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileType?: string;
  audioUrl?: string;
}

export function Message({ 
  content, 
  timestamp, 
  isCurrentUser, 
  sender, 
  imageUrl, 
  videoUrl, 
  fileUrl, 
  fileType, 
  audioUrl 
}: MessageProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showFullSizeImage, setShowFullSizeImage] = useState(false);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  const handleImageClick = () => {
    setShowFullSizeImage(true);
  };

  const handleCloseFullSizeImage = () => {
    setShowFullSizeImage(false);
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && sender && (
        <div className="mr-2 mt-1">
          <UserAvatar name={sender.name} image={sender.avatar} size="sm" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] rounded px-3 py-2",
        (imageUrl || videoUrl || fileUrl || audioUrl) && "max-w-xs",
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
              onClick={handleImageClick}
            />
          </div>
        )}

        {videoUrl && (
          <div className="mb-2 relative">
            <video 
              ref={videoRef}
              src={videoUrl}
              className="max-w-full rounded" 
              onEnded={handleVideoEnded}
              controls
            />
          </div>
        )}

        {fileUrl && fileType === 'pdf' && (
          <div className="mb-2">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 p-2 bg-background/20 rounded hover:bg-background/30 transition-colors"
            >
              <FileText size={20} />
              <span>View PDF document</span>
            </a>
          </div>
        )}

        {audioUrl && (
          <div className="mb-2">
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              className="hidden" 
              onEnded={handleAudioEnded}
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAudioToggle}
              className="flex items-center gap-2 bg-background/20 hover:bg-background/30 transition-colors"
            >
              {isAudioPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>Audio message</span>
            </Button>
          </div>
        )}
        
        {content && <div className="text-sm break-words">{content}</div>}
        
        <div className="text-xs mt-1 opacity-70">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </div>
      </div>

      {/* Full-size image modal */}
      {showFullSizeImage && imageUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={handleCloseFullSizeImage}>
          <div className="max-w-[90vw] max-h-[90vh]">
            <img 
              src={imageUrl} 
              alt="Full-size image" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
