"use client"

import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { CheckIcon } from 'lucide-react';

interface FriendSelectItem {
  id: string;
  name: string;
  username: string;
  image?: string | null;
}

const FriendSelectionList = ({ friends }: { friends: FriendSelectItem[] }) => {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

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

  return (
    <div>
      {selectedFriendDetails.length > 0 && (
        <div className="mb-4 pb-2 border-b border-zinc-600">
          <div className="flex flex-wrap gap-2">
            {selectedFriendDetails.map(friend => (
              <div key={`selected-${friend.id}`} className="flex flex-col items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.image || ""} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs mt-1 text-center max-w-14 truncate">{friend.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='space-y-2 max-h-80 overflow-y-auto custom-scrollbar'>
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => toggleFriend(friend.id)}
            className={`w-full flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-zinc-800/50 transition-colors`}
          >
            <div className='flex items-center justify-start gap-3'>
              <Avatar className='h-9 w-9'>
                <AvatarImage
                  src={friend.image ? friend.image : ""}
                />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <div className='flex flex-col text-xs'>
                <p className="font-medium">{friend.name}</p>
                <p className="text-zinc-400">@{friend.username}</p>
              </div>
            </div>

            {selectedFriends.includes(friend.id) && (
            <div className="text-teal-500">
              <CheckIcon size={18} />
            </div>
          )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendSelectionList