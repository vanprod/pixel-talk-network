
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RegisterForm } from '@/components/RegisterForm';

export default function Register() {
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
              <h1 className="text-2xl font-bold">SIGN UP</h1>
              <p className="text-sm text-muted-foreground">
                Create an account to access the network
              </p>
            </div>
            
            <RegisterForm />
            
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Already have an account? <Link to="/login" className="underline">Login</Link></p>
              <div className="terminal-cursor mt-2">_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
