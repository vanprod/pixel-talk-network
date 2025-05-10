
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUsers } from '@/hooks/use-users';
import { toast } from '@/components/ui/use-toast';
import { Plus, User } from 'lucide-react';

export function FriendsManager() {
  const { currentUser, addFriend, removeFriend, isFriend, getFriends } = useAuth();
  const { users, searchUsersByName } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsView, setFriendsView] = useState<'all' | 'friends'>('friends');
  
  if (!currentUser) return null;
  
  const friends = getFriends();
  
  // Filter users based on search and current view
  const filteredUsers = searchTerm
    ? searchUsersByName(searchTerm)
    : friendsView === 'friends'
      ? friends
      : users.filter(user => user.id !== currentUser.id);
  
  const handleAddFriend = (userId: string) => {
    addFriend(userId);
    toast({
      title: "Friend added",
      description: "User has been added to your friends list",
    });
  };
  
  const handleRemoveFriend = (userId: string) => {
    removeFriend(userId);
    toast({
      title: "Friend removed",
      description: "User has been removed from your friends list",
    });
  };
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Friends Manager</h2>
      
      <div className="flex items-center space-x-2 mb-4">
        <Button 
          variant={friendsView === 'friends' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFriendsView('friends')}
        >
          My Friends
        </Button>
        <Button 
          variant={friendsView === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFriendsView('all')}
        >
          Find Users
        </Button>
      </div>
      
      <div className="relative">
        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-3">
                <UserAvatar name={user.name} image={user.avatar} status={user.status} />
                <span className="font-medium">{user.name}</span>
              </div>
              
              {user.id !== currentUser.id && (
                isFriend(user.id) ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRemoveFriend(user.id)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddFriend(user.id)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                )
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {searchTerm ? 'No users found' : 'No friends yet'}
          </div>
        )}
      </div>
    </div>
  );
}
