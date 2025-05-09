
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserProfile } from '@/components/UserProfile';
import { OnlineUsersList } from '@/components/OnlineUsersList';
import { ChatInterface } from '@/components/ChatInterface';
import { CryptoTracker } from '@/components/CryptoTracker';
import { ExternalLinksSidebar } from '@/components/ExternalLinksSidebar';

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Add a default selected user for the chat interface
  const defaultSelectedUser = {
    id: '2',
    name: 'CryptoFan',
    avatar: undefined,
    status: 'online' as const
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Top header with crypto prices */}
      <header className="border-b p-2">
        <CryptoTracker />
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - user list + profile */}
        <aside className={`w-64 border-r flex-shrink-0 flex flex-col ${isMobile ? (sidebarOpen ? 'block' : 'hidden') : 'block'}`}>
          <UserProfile />
          <div className="flex-1 overflow-y-auto">
            <OnlineUsersList />
          </div>
          <div className="p-4 border-t flex justify-between items-center">
            <ThemeToggle />
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </div>
        </aside>
        
        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface selectedUser={defaultSelectedUser} />
        </main>
        
        {/* Right sidebar - external links */}
        <aside className="w-64 border-l hidden md:block">
          <ExternalLinksSidebar />
        </aside>
      </div>
    </div>
  );
}
