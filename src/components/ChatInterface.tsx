
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, File } from 'lucide-react';
import { Message } from './Message';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

interface ChatInterfaceProps {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when a user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      const userChat = MOCK_MESSAGES[selectedUser.id] || [];
      setMessages(userChat);
    }
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      senderId: currentUser.id,
      senderName: currentUser.displayName
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b">
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
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
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
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <button className="p-2 rounded hover:bg-accent" title="Attach image">
            <Image size={18} />
          </button>
          <button className="p-2 rounded hover:bg-accent" title="Attach file">
            <File size={18} />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${selectedUser.name}...`}
            className="retro-input flex-1"
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="retro-button"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
