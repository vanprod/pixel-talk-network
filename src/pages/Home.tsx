
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with navigation */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-mono font-bold text-lg">PIXEL TALK NETWORK</h1>
          <div className="flex items-center gap-4">
            <Link to="/login" className="retro-button text-sm">LOGIN</Link>
            <Link to="/register" className="retro-button text-sm">SIGN UP</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="retro-card p-6">
            <h2 className="text-xl font-bold mb-4">WELCOME TO PIXEL TALK</h2>
            <p className="mb-6">
              A retro-style messaging platform with cryptocurrency tracking.
              Connect with friends in a secure, minimalist environment.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="retro-button retro-glow">
                LOGIN
              </Link>
              <Link to="/register" className="retro-button">
                SIGN UP
              </Link>
            </div>
            <div className="terminal-cursor mt-6">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}
