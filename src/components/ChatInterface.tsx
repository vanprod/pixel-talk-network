import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, RefreshCw, Plus, X, FileText, Video, File, Play, Mic, MicOff, PhoneCall } from 'lucide-react';
import { Message } from './Message';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { toast } from '@/components/ui/use-toast';
import { fileToDataUrl, validateImageFile, validateVideoFile, validatePdfFile, getFileType } from '@/utils/fileUtils';
import { cn } from '@/lib/utils';
import { playSendMessageSound, playAudioOpenSound } from '@/utils/soundEffects';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileType?: string;
  audioUrl?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

export interface ChatInterfaceProps {
  selectedUser: ChatUser;
}

// Mock chat history - would be fetched from a database in a real implementation
const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '2': [
    {
      id: '1',
      content: 'Hey there! Welcome to Pixel Talk Network.',
      timestamp: new Date(Date.now() - 3600000),
      senderId: '2',
      senderName: 'CryptoFan'
    },
    {
      id: '2',
      content: 'This is a retro-style messaging platform with crypto tracking.',
      timestamp: new Date(Date.now() - 3500000),
      senderId: '2',
      senderName: 'CryptoFan'
    },
    {
      id: '3',
      content: 'Thanks! Looking forward to trying it out.',
      timestamp: new Date(Date.now() - 3400000),
      senderId: '1',
      senderName: 'PixelUser'
    }
  ],
  '3': [
    {
      id: '1',
      content: 'Any thoughts on the latest Bitcoin price movement?',
      timestamp: new Date(Date.now() - 86400000),
      senderId: '3',
      senderName: 'SatoshiLite'
    }
  ],
  '4': [],
  '5': [
    {
      id: '1',
      content: 'Check out this new DeFi protocol I found.',
      timestamp: new Date(Date.now() - 172800000),
      senderId: '5',
      senderName: 'TokenTrader'
    }
  ],
  '6': []
};

export function ChatInterface({ selectedUser }: ChatInterfaceProps) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [mediaPreview, setMediaPreview] = useState<{url: string, type: 'image' | 'video' | 'pdf' | 'audio'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaPlayerRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Load chat history when a user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = (userId: string) => {
    setIsLoading(true);
    // Simulate API fetch with a small delay
    setTimeout(() => {
      const userChat = MOCK_MESSAGES[userId] || [];
      setMessages(userChat);
      setIsLoading(false);
    }, 600);
  };

  const handleRefresh = () => {
    if (!selectedUser) return;
    
    toast({
      title: "Refreshing messages",
      description: `Fetching latest messages with ${selectedUser.name}`,
      duration: 2000,
    });
    
    fetchMessages(selectedUser.id);
  };

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !mediaPreview && !audioBlob) || !currentUser) return;

    // Play send message sound
    playSendMessageSound();

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
    };

    if (mediaPreview) {
      switch (mediaPreview.type) {
        case 'image':
          newMsg.imageUrl = mediaPreview.url;
          break;
        case 'video':
          newMsg.videoUrl = mediaPreview.url;
          break;
        case 'pdf':
          newMsg.fileUrl = mediaPreview.url;
          newMsg.fileType = 'pdf';
          break;
      }
    }

    if (audioBlob) {
      newMsg.audioUrl = URL.createObjectURL(audioBlob);
    }

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setMediaPreview(null);
    setAudioBlob(null);
    
    // In a real app, you would send the message to a backend service here
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = getFileType(file);
    let isValid = false;
    let errorMessage = "";

    switch (fileType) {
      case 'image':
        isValid = validateImageFile(file);
        errorMessage = "Please select a valid image file (JPG, PNG, GIF, WEBP) under 5MB";
        break;
      case 'video':
        isValid = validateVideoFile(file);
        errorMessage = "Please select a valid video file (MP4, WebM, OGG) under 100MB";
        break;
      case 'pdf':
        isValid = validatePdfFile(file);
        errorMessage = "Please select a valid PDF file under 10MB";
        break;
      default:
        errorMessage = "Unsupported file type";
    }

    if (!isValid) {
      toast({
        title: "Invalid file",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setMediaPreview({
        url: dataUrl,
        type: fileType as 'image' | 'video' | 'pdf' | 'audio'
      });
      toast({
        title: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} ready`,
        description: `Your ${fileType} is ready to send`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load the ${fileType}`,
        variant: "destructive",
        duration: 3000,
      });
    }
    
    event.target.value = '';
  };

  const handleMediaUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelMedia = () => {
    setMediaPreview(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(audioBlob);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
        
        toast({
          title: "Audio recorded",
          description: "Your audio message is ready to send",
          duration: 2000,
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Play audio open sound when recording stops
      playAudioOpenSound();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
    }
  };

  const sendSystemMessage = () => {
    const systemMsg: ChatMessage = {
      id: Date.now().toString() + 'sys',
      content: `System: ${selectedUser.name} is now available for chat.`,
      timestamp: new Date(),
      senderId: 'system',
      senderName: 'System'
    };
    
    setMessages(prev => [...prev, systemMsg]);
    toast({
      title: "System Message",
      description: "System notification sent",
      duration: 2000,
    });
  };

  const initiateCall = () => {
    toast({
      title: "Initiating Call",
      description: `Calling ${selectedUser.name}...`,
      duration: 2000,
    });
    // In a real app, this would trigger the call functionality
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <UserAvatar 
            name={selectedUser.name} 
            image={selectedUser.avatar}
            status={selectedUser.status}
          />
          <div className="ml-3">
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedUser.status === 'online' ? 'Online now' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={initiateCall}
            className="text-hadra-green hover:bg-hadra-green/20"
            title="Call user"
          >
            <PhoneCall size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRefresh} title="Refresh messages">
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <RefreshCw className="animate-spin text-primary" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start the conversation with {selectedUser.name}</p>
          </div>
        ) : (
          messages.map(msg => (
            <Message
              key={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              isCurrentUser={currentUser?.id === msg.senderId}
              isSystemMessage={msg.senderId === 'system'}
              sender={currentUser?.id !== msg.senderId && msg.senderId !== 'system' ? {
                name: msg.senderName,
                avatar: msg.senderAvatar
              } : undefined}
              imageUrl={msg.imageUrl}
              videoUrl={msg.videoUrl}
              fileUrl={msg.fileUrl}
              fileType={msg.fileType}
              audioUrl={msg.audioUrl}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Media preview */}
      {mediaPreview && (
        <div className="p-2 border-t">
          <div className="relative inline-block">
            {mediaPreview.type === 'image' && (
              <img 
                src={mediaPreview.url} 
                alt="Preview" 
                className="h-20 w-auto rounded object-cover"
              />
            )}
            {mediaPreview.type === 'video' && (
              <div className="h-20 w-32 bg-black rounded flex items-center justify-center">
                <Video className="text-white/70" size={24} />
              </div>
            )}
            {mediaPreview.type === 'pdf' && (
              <div className="h-20 w-32 bg-gray-100 rounded flex items-center justify-center">
                <FileText className="text-primary" size={24} />
              </div>
            )}
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleCancelMedia}
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      )}

      {/* Audio recording preview */}
      {audioBlob && !isRecording && (
        <div className="p-2 border-t">
          <div className="relative inline-flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg">
            <Play size={16} className="text-primary" />
            <span className="text-xs">Audio message ready</span>
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-5 w-5 rounded-full ml-2"
              onClick={() => setAudioBlob(null)}
            >
              <X size={10} />
            </Button>
          </div>
        </div>
      )}
      
      {/* Message input with system message button */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleMediaUploadClick} 
              title="Attach file"
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Plus size={20} />
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*,application/pdf,audio/*"
              className="hidden"
            />

            {isRecording ? (
              <Button 
                variant="destructive"
                size="icon"
                onClick={stopRecording}
                className="animate-pulse transition-transform hover:scale-110 active:scale-95"
                title="Stop recording"
              >
                <MicOff size={20} />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={startRecording}
                className="transition-transform hover:scale-110 active:scale-95"
                title="Record audio"
              >
                <Mic size={20} />
              </Button>
            )}
            
            <Button 
              variant="ghost"
              size="icon"
              onClick={sendSystemMessage}
              className="transition-transform hover:scale-110 active:scale-95 text-gray-500"
              title="Send system message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-server">
                <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                <line x1="6" x2="6" y1="6" y2="6"></line>
                <line x1="6" x2="6" y1="18" y2="18"></line>
              </svg>
            </Button>
          </div>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${selectedUser.name}...`}
            className="retro-input flex-1"
            disabled={isRecording}
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !mediaPreview && !audioBlob) || isRecording}
            size="icon"
            className="retro-button transition-transform hover:scale-110 active:scale-95"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
