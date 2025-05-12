
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, Heart, MessageCircle } from 'lucide-react';
import { StoryCreator } from '@/components/StoryCreator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useMessageService } from '@/services/messageService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock stories data - in a real app, this would come from your backend
const mockStories = [
  {
    id: '1',
    userId: '1',
    username: 'CryptoExpert',
    userAvatar: '/placeholder.svg',
    content: 'Just learned about a new blockchain technology that could revolutionize the industry!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 12,
    comments: 3,
    media: null
  },
  {
    id: '2',
    userId: '2',
    username: 'TechEnthusiast',
    userAvatar: '/placeholder.svg',
    content: 'Check out this new encrypted messaging protocol I\'ve been working on.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 24,
    comments: 7,
    media: '/placeholder.svg'
  },
  {
    id: '3',
    userId: '3',
    username: 'PrivacyAdvocate',
    userAvatar: '/placeholder.svg',
    content: 'Here\'s why everyone should be using end-to-end encryption for all communications.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    likes: 42,
    comments: 15,
    media: null
  }
];

export default function Stories() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Changed from 'user' to 'currentUser' to match the AuthContextType
  const [activeTab, setActiveTab] = useState('all');
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const { createStory } = useMessageService();
  const [stories, setStories] = useState(mockStories);
  
  // In a real app, you would fetch stories from your backend
  useEffect(() => {
    // Simulate loading stories
    // This would be replaced with actual API call
    const fetchStories = async () => {
      // const response = await yourApiService.getStories();
      // setStories(response.data);
      setStories(mockStories);
    };
    
    fetchStories();
  }, []);
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  const toggleLike = (storyId: string) => {
    setStories(prev => 
      prev.map(story => 
        story.id === storyId 
          ? { ...story, likes: story.likes + 1 }  // In a real app, toggle between like/unlike
          : story
      )
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b p-3 bg-background shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="hover:bg-hadra-green/20 hover:text-hadra-green transition-all animate-click-effect"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="font-mono font-bold text-lg">Stories</h1>
          </div>
          
          <Button 
            onClick={() => setShowStoryCreator(!showStoryCreator)}
            size="sm" 
            className="bg-hadra-green hover:bg-hadra-green/90 text-white"
          >
            {showStoryCreator ? 'Cancel' : <><Plus className="mr-1 h-4 w-4" /> New Story</>}
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-4 px-4 max-w-3xl">
        {showStoryCreator && (
          <div className="mb-6 bg-card rounded-lg shadow-md animate-fade-in">
            <StoryCreator />
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Stories</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="my">My Stories</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-6">
          {stories.length > 0 ? (
            stories.map(story => (
              <div key={story.id} className="border bg-card rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg hover:border-hadra-green/50">
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={story.userAvatar} alt={story.username} />
                      <AvatarFallback>{story.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{story.username}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{formatTimestamp(story.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-3">{story.content}</p>
                  
                  {story.media && (
                    <div className="rounded-md overflow-hidden mb-3">
                      <img 
                        src={story.media} 
                        alt="Story media" 
                        className="w-full object-cover max-h-80" 
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-4 pt-3 border-t">
                    <button 
                      onClick={() => toggleLike(story.id)}
                      className="flex items-center space-x-1 text-sm hover:text-hadra-green transition-colors animate-click-effect"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{story.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-sm hover:text-hadra-green transition-colors animate-click-effect">
                      <MessageCircle className="h-4 w-4" />
                      <span>{story.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No stories to display</p>
              <Button 
                onClick={() => setShowStoryCreator(true)}
                className="mt-4 bg-hadra-green hover:bg-hadra-green/90"
              >
                Create Your First Story
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
