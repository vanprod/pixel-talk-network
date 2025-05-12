
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';
import { FileText, Play, Pause, Video, Heart, ThumbsUp, SmilePlus } from 'lucide-react';
import { Button } from './ui/button';
import { playAudioOpenSound } from '@/utils/soundEffects';

interface MessageProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  isSystemMessage?: boolean;
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

type Reaction = {
  emoji: string;
  count: number;
  userReacted: boolean;
};

export function Message({ 
  content, 
  timestamp, 
  isCurrentUser, 
  isSystemMessage = false,
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
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: '❤️', count: 0, userReacted: false },
    { emoji: '👍', count: 0, userReacted: false },
    { emoji: '😂', count: 0, userReacted: false },
    { emoji: '😮', count: 0, userReacted: false },
  ]);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        playAudioOpenSound();
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
  
  const handleReaction = (index: number) => {
    setReactions(prev => {
      const newReactions = [...prev];
      if (newReactions[index].userReacted) {
        newReactions[index].count--;
        newReactions[index].userReacted = false;
      } else {
        newReactions[index].count++;
        newReactions[index].userReacted = true;
      }
      return newReactions;
    });
    setShowReactionPicker(false);
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && sender && !isSystemMessage && (
        <div className="mr-2 mt-1">
          <UserAvatar name={sender.name} image={sender.avatar} size="sm" />
        </div>
      )}
      
      <div className="relative max-w-[80%]">
        <div className={cn(
          "rounded px-3 py-2",
          (imageUrl || videoUrl || fileUrl || audioUrl) && "max-w-xs",
          isSystemMessage 
            ? 'bg-gray-500/30 text-white italic border border-gray-500/50' 
            : isCurrentUser 
              ? 'bg-hadra-green text-white' 
              : 'bg-secondary text-secondary-foreground'
        )}>
          {!isCurrentUser && sender && !isSystemMessage && (
            <div className="text-xs font-bold mb-1">{sender.name}</div>
          )}

          {isSystemMessage && (
            <div className="text-xs font-semibold mb-1">System Message</div>
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
        
        {/* Repositioned Reaction Buttons - now below the message */}
        <div className="mt-1 flex justify-start space-x-1">
          {reactions.some(r => r.count > 0) && (
            <div className="flex bg-background/80 rounded-full px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-700">
              {reactions
                .filter(r => r.count > 0)
                .map((reaction, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center mr-1 cursor-pointer ${reaction.userReacted ? 'font-bold' : ''}`}
                    onClick={() => handleReaction(reactions.findIndex(r => r.emoji === reaction.emoji))}
                  >
                    <span>{reaction.emoji}</span>
                    <span className="ml-0.5">{reaction.count}</span>
                  </div>
                ))
              }
            </div>
          )}
          
          {!isSystemMessage && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background/80 hover:bg-background"
              onClick={() => setShowReactionPicker(!showReactionPicker)}
            >
              <SmilePlus size={14} />
            </Button>
          )}
        </div>
        
        {/* Reaction picker - repositioned */}
        {showReactionPicker && (
          <div className="absolute top-full left-0 mt-2 bg-background shadow-lg rounded-lg p-1 flex space-x-1 border border-gray-300 dark:border-gray-700 z-10">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                className={`text-lg p-1 hover:bg-accent rounded-full ${reaction.userReacted ? 'bg-accent' : ''}`}
                onClick={() => handleReaction(index)}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        )}
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
