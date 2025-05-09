
import React, { useState } from 'react';
import { CryptoTracker } from '@/components/CryptoTracker';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OnlineUsersList } from '@/components/OnlineUsersList';
import { ChatInterface } from '@/components/ChatInterface';
import { ExternalLinksSidebar } from '@/components/ExternalLinksSidebar';
import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { LogOut } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

export function AppLayout() {
  const { currentUser, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header with crypto tracker and theme toggle */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-mono font-bold text-lg">PIXEL TALK NETWORK</h1>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <CryptoTracker />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile crypto tracker (visible only on small screens) */}
      <div className="md:hidden border-b px-4 py-2 overflow-x-auto">
        <CryptoTracker />
      </div>
      
      {/* Main content area with sidebar and chat */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar with user list */}
        <div className="w-64 border-r flex-shrink-0 flex flex-col">
          {/* User profile section */}
          {currentUser && (
            <div className="p-4 border-b">
              <div className="flex items-center mb-2">
                <UserAvatar 
                  name={currentUser.displayName} 
                  status="online" 
                />
                <div className="ml-3">
                  <h3 className="font-medium">{currentUser.displayName}</h3>
                  <p className="text-xs text-muted-foreground">ONLINE</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Last login: {formatDistanceToNow(new Date(currentUser.lastLogin), { addSuffix: true })}
              </div>
              
              <button 
                onClick={logout}
                className="mt-3 flex items-center text-xs hover:text-destructive"
              >
                <LogOut size={14} className="mr-1" /> Logout
              </button>
            </div>
          )}
          
          {/* Online users list */}
          <div className="flex-1 overflow-y-auto p-4">
            <OnlineUsersList onSelectUser={handleSelectUser} />
          </div>
          
          {/* External links section */}
          <div className="border-t">
            <ExternalLinksSidebar />
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <ChatInterface selectedUser={selectedUser} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md p-8">
                <h2 className="text-xl font-bold mb-2">Welcome to Pixel Talk Network</h2>
                <p className="text-muted-foreground mb-4">
                  Select a user from the sidebar to start a conversation.
                </p>
                <div className="terminal-cursor text-lg">_</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
