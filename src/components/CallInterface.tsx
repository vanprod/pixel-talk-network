
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PhoneCall, MicOff, Mic, Video, VideoOff, X } from 'lucide-react';

interface CallInterfaceProps {
  username: string;
  onEndCall: () => void;
}

export function CallInterface({ username, onEndCall }: CallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callTime, setCallTime] = useState(0);
  
  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format call time as mm:ss
  const formatCallTime = () => {
    const minutes = Math.floor(callTime / 60);
    const seconds = callTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 bg-gradient-to-b from-[#1C2533] to-black">
      <div className="bg-[#1C2533]/70 p-6 rounded-xl shadow-lg w-full max-w-md border border-hadra-green/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-hadra-green">Call with {username}</h2>
          <div className="text-sm text-gray-400">{formatCallTime()}</div>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-hadra-green/40 ring-2 ring-hadra-green/20">
              <AvatarImage src="/placeholder.svg" alt={username} />
              <AvatarFallback className="bg-hadra-green/20 text-hadra-green text-2xl">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                <VideoOff className="text-white/70" />
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg font-semibold">{username}</p>
          <p className="text-sm text-muted-foreground">Active Call</p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`rounded-full h-12 w-12 ${isMuted ? 'bg-red-600/20 border-red-600/70' : 'bg-hadra-green/20 border-hadra-green/70'}`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`rounded-full h-12 w-12 ${!isVideoEnabled ? 'bg-red-600/20 border-red-600/70' : 'bg-hadra-green/20 border-hadra-green/70'}`}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="destructive" 
            size="icon"
            onClick={onEndCall}
            className="rounded-full h-12 w-12 bg-red-600 hover:bg-red-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
