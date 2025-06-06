
import React from 'react';
import { LoginForm } from '@/components/LoginForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with back button and theme toggle */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 hover:bg-hadra-green/20 hover:text-hadra-green transition-all animate-click-effect"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="font-mono font-bold text-lg">HADRA</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="retro-card">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">LOGIN</h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access Hadra
              </p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Demo credentials: demo@example.com / demo123</p>
              <p className="mt-4">
                A modern messaging platform with secure communications.
              </p>
              <div className="terminal-cursor mt-2">_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
