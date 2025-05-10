
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, RefreshCw, Plus, X } from 'lucide-react';
import { Message } from './Message';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { toast } from '@/components/ui/use-toast';
import { fileToDataUrl, validateImageFile } from '@/utils/fileUtils';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  imageUrl?: string; // Added for image messages
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if ((!newMessage.trim() && !imagePreview) || !currentUser) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      imageUrl: imagePreview || undefined
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setImagePreview(null);
    
    // In a real app, you would send the message to a backend service here
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file (JPG, PNG, GIF, WEBP) under 5MB",
        variant: "destructive",
        duration: 3000,
      });
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImagePreview(dataUrl);
      toast({
        title: "Image ready",
        description: "Your image is ready to send",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load the image",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    event.target.value = '';
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelImage = () => {
    setImagePreview(null);
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
        
        <Button variant="ghost" size="icon" onClick={handleRefresh} title="Refresh messages">
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </Button>
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
              sender={currentUser?.id !== msg.senderId ? {
                name: msg.senderName,
                avatar: msg.senderAvatar
              } : undefined}
              imageUrl={msg.imageUrl}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Image preview */}
      {imagePreview && (
        <div className="p-2 border-t">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-20 w-auto rounded object-cover"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleCancelImage}
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      )}
      
      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleImageUploadClick} 
            title="Attach image"
          >
            <Image size={20} />
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
          />
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${selectedUser.name}...`}
            className="retro-input flex-1"
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && !imagePreview}
            size="icon"
            className="retro-button"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
