import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header with navigation */}
      <header className="border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-mono font-bold text-lg text-hadra-green">HADRA</h1>
          <div className="flex items-center gap-4">
            <Link to="/login" className="retro-button text-sm transition-transform hover:scale-110 active:scale-95 animate-click-effect">LOGIN</Link>
            <Link to="/register" className="retro-button text-sm transition-transform hover:scale-110 active:scale-95 animate-click-effect">SIGN UP</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="retro-card border-hadra-green/30 p-6">
            <h2 className="text-xl font-bold mb-4 text-hadra-green">WELCOME TO HADRA</h2>
            <p className="mb-6">
              A modern messaging platform with secure communications.
              Connect with friends in a secure, minimalist environment.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="retro-button retro-glow transition-transform hover:scale-110 active:scale-95">
                LOGIN
              </Link>
              <Link to="/register" className="retro-button transition-transform hover:scale-110 active:scale-95">
                SIGN UP
              </Link>
            </div>
            <div className="terminal-cursor mt-6">_</div>
          </div>
        </div>
      </div>
      
      {/* Footer with app info */}
      <footer className="border-t p-6 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-hadra-green mb-3">About Hadra</h3>
              <p className="text-sm">
                Hadra is a modern messaging application designed for secure and private communications. 
                Our platform prioritizes your privacy while providing a feature-rich experience.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-hadra-green mb-3">Features</h3>
              <ul className="text-sm space-y-2">
                <li>• End-to-end encryption</li>
                <li>• Media sharing (images, videos, audio)</li>
                <li>• Document sharing</li>
                <li>• Story posts</li>
                <li>• Real-time chat</li>
                <li>• Video & Audio calls</li>
                <li>• Message reactions & emojis</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-hadra-green mb-3">Connect With Us</h3>
              <p className="text-sm mb-2">
                Have questions or suggestions? Reach out to our support team.
              </p>
              <a href="mailto:support@hadra.com" className="text-sm text-hadra-green hover:underline">
                support@hadra.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Hadra Messaging. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
