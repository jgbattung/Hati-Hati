"use client"

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { UserPlus } from 'lucide-react'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useLoadingStore } from '@/lib/store'
import { redirect } from 'next/navigation'
import { getUserFriends } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import FriendSelectionList from '../shared/FriendSelectionList'

interface FriendItem {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

interface AddGroupMemberParams {
  groupId: string;
  userId: string;
}

const AddGroupMember = ({ groupId, userId }: AddGroupMemberParams) => {
  const [open, setOpen] = useState(false)
  const [friends, setFriends] = useState<FriendItem[]>([]);  const { isLoading, setIsLoading } = useLoadingStore();
  
  if (!userId) redirect('sign-in');

  const handleAddComplete = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    async function fetchFriends() {
      if (open && userId) {
        setIsLoading(true);
        try {
          const friendsData = await getUserFriends(userId);

          const formattedFriends = (friendsData || []).map(f => ({
            id: f.friend.id,
            name: f.friend.name || f.friend.username,
            username: f.friend.username,
            image: f.friend.image
          }));

          setFriends(formattedFriends);
        } catch (error) {
          console.error("Error feteching friends: ", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchFriends();
  }, [open, userId]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='flex items-center justify-center gap-6 px-5 py-6 text-teal-200'>
          <div className='relative flex items-center justify-center'>
            <div className='absolute bg-teal-200 rounded-full h-8 w-8'></div>
            <UserPlus size={16} color='#18181b' fill='#18181b' className='z-10' />
          </div>
          <p>Add group members</p>
        </button>
      </DialogTrigger>
      <DialogContent
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-72 min-h-96 rounded-md border-2 p-5 border-zinc-600 bg-zinc-900 [&>button:last-child]:hidden flex flex-col"
      >
        <DialogHeader className='text-left'>
          <DialogTitle>Add a member to the group</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className='flex items-center justify-start w-full'>
          {isLoading ? (
            <div className='w-full flex flex-col gap-5 text-center mt-20'>
              <div className='h-full flex items-center justify-center'>
                <span className="loader" />
              </div>
              <p className='text-zinc-400'>Loading friends...</p>
            </div>
          ) : (
            <div className='w-full'>
              <FriendSelectionList
                friends={friends}
                groupId={groupId}
                onAddComplete={handleAddComplete} 
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddGroupMember