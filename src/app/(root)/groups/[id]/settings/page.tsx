import Header from '@/components/shared/Header'
import { getGroupById } from '@/lib/actions/group.actions';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'
import Image from 'next/image';
import somethingWentWrong from '../../../../../public/assets/something-went-wrong.svg'
import groupPlaceholderImg from '../../../../../public/assets/group-paceholder.jpeg'
import UpdateGroupName from '@/components/forms/UpdateGroupName';
import DeleteGroup from '@/components/alert-dialogs/DeleteGroup';
import GroupMembers from '@/components/shared/GroupMembers';

interface SettingsProps {
  params: {
    id: string;
  }
}

const Settings = async ({ params }: SettingsProps) => {
  const user = await currentUser();

  if (!user) return null

  const groupInfo = await getGroupById({
    groupId: params.id,
    userId: user.id!,
  });

  const headerTitle = 'Group settings'

  if (!groupInfo.success || !groupInfo.group) {
    return (
      <div className='w-full min-h-dvh flex flex-col items-center justify-center px-5'>
        <Header headerTitle={headerTitle} />
        <div className='flex flex-col items-center justify-center'>
          <Image 
              src={somethingWentWrong}
              alt="somehting-went-wrong"
              width={200}
              height={200}
            />
            <div className='flex flex-col items-center justify-center gap-4 mt-5'>
                <h1 className='text-xl font-bold'>Something went wrong</h1>
                <p className='text-zinc-400 text-sm text-center'>There was an error loading the page settings. Try again later.</p>
            </div>
          </div>
      </div>
    )
  }

  return (
    <div className='w-full min-h-dvh'>
      <Header headerTitle={headerTitle} />
      <div className='w-full flex flex-col items-center justify-center pt-14'>
        <div className='w-full flex items-center justify-between px-4'>
          <div className='flex items-center justify-center gap-2'>
            <Image
              src={groupPlaceholderImg}
              alt='group-image'
              width={64}
              height={64}
              className='object-cover min-h-16 min-w-16 max-h-16 max-w-16 border-4 border-zinc-900 rounded-lg'
            />
            <p className='font-thin'>{groupInfo.group.name}</p>
          </div>
          <div className='pr-2'>
            <UpdateGroupName groupId={groupInfo.group.id} currentName={groupInfo.group.name} />
          </div>
        </div>
      </div>
      <div className="w-full border-t border-zinc-700 mt-1 mb-3" />
      <div className='flex flex-col items-start justify-center gap-5 px-4 py-2'>
        <div className='w-full'>
          <GroupMembers users={groupInfo.group.members} />
        </div>
        <div className='flex flex-col items-start justify-center gap-3'>
          <p className='text-xs'>Advanced Settings</p>
          <p className='text-sm'>Leave Group</p>
          <div>
            <DeleteGroup groupId={groupInfo.group.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings