
import React, { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CallInterface } from '@/components/CallInterface';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callingUser, setCallingUser] = useState<string | null>(null);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const startCall = (username: string) => {
    setCallingUser(username);
    setIsCallActive(true);
  };
  
  const endCall = () => {
    setIsCallActive(false);
    setCallingUser(null);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b p-2 bg-card shadow-sm">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="hover:bg-hadra-green/20 hover:text-hadra-green transition-all animate-click-effect"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="font-mono font-bold">HADRA Dashboard</h1>
        </div>
      </header>
      
      {isCallActive ? (
        <CallInterface username={callingUser || 'User'} onEndCall={endCall} />
      ) : (
        <main className="flex-1">
          <AppLayout />
        </main>
      )}
    </div>
  );
}
