import AddContact from '@/components/forms/AddContact'
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { getUserFriends } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation';
import Image from 'next/image';

const Friends = async () => {
  const user = await currentUser();
  if (!user) redirect('sign-in');
  const userFriends = await getUserFriends(user.id)
  
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='w-full px-5 mt-10'>
        {userFriends?.map((friends) => (
          <div
            key={friends.friend.id}
            className='flex items-center justify-between my-3'
          >
            <div className='flex items-center justify-center gap-4'>
              <Image
                src={friends.friend.image!}
                alt={`${friends.friend.name}'s profile picture`}
                width={28}
                height={28}
                className='rounded-full'
              />
              <p>{friends.friend.name}</p>
            </div>
            <div>
              <p className='text-xs font-light text-zinc-400'>no expenses</p>
            </div>
          </div>
        ))}
      </div>
      <AddContact />
    </div>
  )
}

export default Friends