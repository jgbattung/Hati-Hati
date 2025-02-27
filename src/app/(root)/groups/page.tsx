import CreateGroup from '@/components/forms/CreateGroup';
import InvitationHandler from '@/components/invite/InvitationHandler';
import { updateUser } from '@/lib/actions/user.actions';
import { doesuserExist } from '@/lib/db/users.db';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Groups = async () => {
  const user = await currentUser();

  if (user) {
    const userExists = await doesuserExist(user.id);

    if (!userExists) {
      try {
        await updateUser({
          id: user.id,
          username: user.username!,
          email: user.emailAddresses[0].emailAddress,
          name: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName
          || null,
          image: user.imageUrl,
        })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw new Error(`Failed to save user: ${error.message}`);
      }
    }
    return (
      <div className='w-full min-h-dvh relative pb-20'>
        <InvitationHandler />
        <div className='fixed bottom-24 right-4 z-10'>
          <CreateGroup />
        </div>
      </div>
    )
  }

  return null
}

export default Groups