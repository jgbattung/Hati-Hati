"use client"

import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { CheckIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import { useLoadingStore } from '@/lib/store';
import { addMembersToGroup } from '@/lib/actions/group.actions';
import { friendsSelectionListTestIds } from '@/utils/constants';

interface FriendSelectItem {
  id: string;
  name: string;
  username: string;
  image?: string | null;
}

interface FriendSelectionListProps {
  friends: FriendSelectItem[];
  groupId: string;
  onAddComplete?: () => void;
}

const FriendSelectionList = ({ friends, groupId, onAddComplete }: FriendSelectionListProps) => {
  const { user } = useUser();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, setIsLoading } = useLoadingStore();

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) 
        : [...prev, friendId]
    )
  };

  const selectedFriendDetails = selectedFriends.map(id => 
    friends.find(friend => friend.id === id)
  ).filter(Boolean) as FriendSelectItem[];

  const handleAddToGroup = async () => {
    if (!user || selectedFriends.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await addMembersToGroup({
        groupId,
        memberIds: selectedFriends,
        currentUserId: user.id,
      });

      if (result.success) {
        if (onAddComplete) onAddComplete();
      } else {
        setError(result.error || "Failed to add members to group");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div>
      {selectedFriendDetails.length > 0 && (
        <div
          data-testid={friendsSelectionListTestIds.selectedListDiv} 
          className="mb-4 pb-2 border-b border-zinc-600"
        >
          <div className="flex flex-wrap gap-2">
            {selectedFriendDetails.map(friend => (
              <div
                data-testid={friendsSelectionListTestIds.selectedDiv} 
                key={`selected-${friend.id}`}
                className="flex flex-col items-center"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.image || ""} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <span data-testid={friendsSelectionListTestIds.selectedName} className="text-xs mt-1 text-center max-w-14 truncate">{friend.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        data-testid={friendsSelectionListTestIds.listDiv}
        className='space-y-2 max-h-80 overflow-y-auto custom-scrollbar'
      >
        {friends.map((friend) => (
          <div
            data-testid={friendsSelectionListTestIds.friendDiv}
            key={friend.id}
            onClick={() => toggleFriend(friend.id)}
            className={`w-full flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-zinc-800/50 transition-colors`}
          >
            <div className='flex items-center justify-start gap-3'>
              <Avatar data-testid={friendsSelectionListTestIds.friendAvatar} className='h-9 w-9'>
                <AvatarImage
                  src={friend.image ? friend.image : ""}
                />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <div className='flex flex-col text-xs'>
                <p data-testid={friendsSelectionListTestIds.friendName} className="font-medium">{friend.name}</p>
                <p data-testid={friendsSelectionListTestIds.friendUsername} className="text-zinc-400">@{friend.username}</p>
              </div>
            </div>

            {selectedFriends.includes(friend.id) && (
            <div data-testid={friendsSelectionListTestIds.checkIcon} className="text-teal-500">
              <CheckIcon size={18} />
            </div>
          )}
          </div>
        ))}

      </div>
      {selectedFriends.length > 0 && (
        <div className='flex flex-col items-end'>
          {error && <p className="text-xs text-rose-500 mb-2">{error}</p>}
          <Button
            data-testid={friendsSelectionListTestIds.addButton}
            type="button"
            onClick={handleAddToGroup}
            disabled={isLoading}
            className='bg-violet-600 hover:bg-violet-700 transition-all duration-300 ease-in-out 
            transform scale-100 opacity-100 animate-in fade-in slide-in-from-bottom-5'
          >
            {isLoading ? 'Adding...' : 'Add to group'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FriendSelectionList