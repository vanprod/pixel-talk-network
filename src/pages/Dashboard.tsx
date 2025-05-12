
import React from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b p-2 bg-background shadow-sm">
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
      
      <main className="flex-1">
        <AppLayout />
      </main>
    </div>
  );
}
