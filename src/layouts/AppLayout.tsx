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
import { Menu, X, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User as UserType } from '@/hooks/use-users';

// Define the User type for selected chat users
interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
}

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType>({
    id: '2',
    name: 'CryptoFan',
    avatar: undefined,
    status: 'online' as const
  });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    toast({
      title: "Chat opened",
      description: `Started conversation with ${user.name}`,
      duration: 2000,
    });
    
    if (isMobile) {
      setSidebarOpen(false); // Close sidebar on mobile after selecting user
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Top header with crypto prices */}
      <header className="border-b p-2">
        <CryptoTracker />
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className="fixed z-50 bottom-4 left-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Users size={24} />}
          </button>
        )}
        
        {/* Left sidebar - user list + profile */}
        <aside className={`w-64 border-r flex-shrink-0 flex flex-col ${isMobile ? (sidebarOpen ? 'absolute z-40 h-full bg-background animate-fade-in' : 'hidden') : 'block'}`}>
          <UserProfile />
          <div className="flex-1 overflow-y-auto">
            <OnlineUsersList 
              onSelectUser={handleSelectUser}
              selectedUserId={selectedUser.id}
            />
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
          <ChatInterface selectedUser={selectedUser} />
        </main>
        
        {/* Right sidebar - external links */}
        <aside className="w-64 border-l hidden md:block">
          <ExternalLinksSidebar />
        </aside>
      </div>
    </div>
  );
}
