
import React from 'react';
import { LoginForm } from '@/components/LoginForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with only theme toggle */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-mono font-bold text-lg">PIXEL TALK NETWORK</h1>
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
                Enter your credentials to access the network
              </p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Demo credentials: demo@example.com / demo123</p>
              <p className="mt-4">
                A retro-style messaging platform with cryptocurrency tracking.
              </p>
              <div className="terminal-cursor mt-2">_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
