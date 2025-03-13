import { getGroupById } from '@/lib/actions/group.actions';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import React from 'react'
import groupPlaceholderImg from '../../../../public/assets/group-paceholder.jpeg'
import somethingWentWrong from '../../../../public/assets/something-went-wrong.svg'
import { groupPageTestIds } from '@/utils/constants';
import { GROUP_ERROR_MESSAGES, GROUP_ERRORS } from '@/lib/errors';
import Header from '@/components/shared/Header';
import AddGroupMember from '@/components/dialogs/AddGroupMember';

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
    <div data-testid={groupPageTestIds.groupPage} className='w-full min-h-dvh'>
      <Header />
      {groupInfo.success && groupInfo.group ? (
        <div
          data-testid={groupPageTestIds.groupInfoDiv}
          className='w-full flex flex-col gap-4'
        >
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
                data-testid={groupPageTestIds.groupPageImage}
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
          <div className='w-full mt-6 flex flex-col items-center justify-center gap-4'>
            <p>{`You're the only one here`}</p>
            <AddGroupMember />
          </div>
        </div>
      ) : (
        <div 
          data-testid={groupPageTestIds.groupPageError}
          className='w-full min-h-dvh flex flex-col items-center justify-center'
        >
          <div className='flex flex-col items-center justify-center'>
            <Image 
              src={somethingWentWrong}
              alt="somehting-went-wrong"
              width={200}
              height={200}
            />
            <div className='flex flex-col items-center justify-center gap-4 mt-5'>
              <h1 className='text-xl font-bold'>Something went wrong</h1>
              <p className='text-zinc-400 text-sm'>
              {!groupInfo.success && groupInfo.error
                ? GROUP_ERROR_MESSAGES[groupInfo.error]
                : GROUP_ERROR_MESSAGES[GROUP_ERRORS.GENERAL_ERROR]
              }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Group