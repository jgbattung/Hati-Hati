import { getGroupById } from '@/lib/actions/group.actions';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import React from 'react'
import groupPlaceholderImg from '../../../../public/assets/group-paceholder.jpeg'

interface GroupPageProps {
  params: {
    id: string;
  }
}

const Group = async ({ params }: GroupPageProps) => {
  const user = await currentUser();

  if (!user) return null

  const groupInfo = await getGroupById({
    groupId: params.id,
    userId: user.id!,
  });

  return (
    <div className='w-full min-h-dvh'>
      {groupInfo.success && groupInfo.group ? (
        <div className='w-full flex flex-col gap-4'>
          {/* Cover photo and group photo */}
          <div className='w-full flex flex-col'>
            <div className='w-full h-32 relative overflow-hidden'>
              <Image
                src={groupPlaceholderImg}
                alt="group-img"
                width={2000}
                height={0}
                className='object-cover max-h-32 opacity-60'
                priority
              />
            </div>
            <div className='-mt-12 z-50 ml-8'>
              <Image
                src={groupPlaceholderImg}
                alt="img"
                width={80}
                height={80}
                className='object-cover min-h-20 min-w-20 max-h-20 max-w-20 border-4 border-zinc-900 rounded-lg'
              />
            </div>
          </div>
          <div className='mx-8 flex flex-col gap-3'>
            <p className='font-normal text-xl'>{groupInfo.group.name}</p>
            <p className='text-sm'>You are all settled up in this group.</p>
          </div>
        </div>
      ) : (
        <p>ERROR</p>
      )}
    </div>
  )
}

export default Group