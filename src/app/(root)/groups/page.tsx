import CreateGroup from '@/components/forms/CreateGroup';
import InvitationHandler from '@/components/invite/InvitationHandler';
import { getUserGroups } from '@/lib/actions/group.actions';
import { updateUser } from '@/lib/actions/user.actions';
import { doesuserExist } from '@/lib/db/users.db';
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import imagePlaceholder from '../../../public/assets/group-paceholder.jpeg'
import { Users } from 'lucide-react';
import { groupsPageTestIds } from '@/utils/constants';
import { SignOutButton } from '@clerk/nextjs';

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

    const userGroups = await getUserGroups({
      userId: user.id,
    });

    const hasGroups = userGroups.groups && userGroups.groups.length > 0;

    return (
      <>
        <div
          data-testid={groupsPageTestIds.groupsPage}
          className='w-full min-h-dvh relative pb-20 py-10 px-4'
        >
          <InvitationHandler />
          {!hasGroups ? (
            <div
                data-testid={groupsPageTestIds.noGroupsDiv}
                className='w-full min-h-dvh relative pb-20 py-10 px-4 flex flex-col items-center justify-center gap-4'
              >
              <Users size={64} className="text-zinc-600" />
              <h3 className="text-xl font-medium">No groups yet</h3>
              <p className="text-zinc-400 text-sm text-center mt-4">
                Create your first group to start tracking shared expenses with friends.
              </p>
              <div className='fixed bottom-24 right-4 z-10'>
                <CreateGroup />
              </div>
            </div>
          ) : (
            <div className='w-full flex flex-col items-start justify-center gap-4'>
              {userGroups.groups?.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                >
                  <div
                    data-testid={groupsPageTestIds.groupsDiv}
                    className='flex gap-4 items-center justify-center'
                  >
                    <div>
                      <Image
                        src={imagePlaceholder}
                        alt="group image"
                        width={90}
                        height={90}
                        className='object-cover min-w-24 max-w-24 min-h-20 max-h-20 rounded-xl'
                      />
                    </div>
                    <div className='flex flex-col'>
                      <p className='font-semibold'>{group.name}</p>
                      <p className='text-zinc-400'>settled up</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className='fixed bottom-24 right-4 z-10'>
          <CreateGroup />
        </div>
      </>
    );
  }
}

export default Groups