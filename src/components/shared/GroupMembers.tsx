import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { groupMemberTestIds } from '@/utils/constants';
import DeleteGroupMember from '../alert-dialogs/DeleteGroupMember';

interface UserInfo {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  email: string;
}

interface GroupMember {
  id: string;
  groupId: string;
  status: string;
  user: UserInfo;
}

interface GroupMemberProps {
  users: GroupMember[];
}

const GroupMembers = ({ users }: GroupMemberProps) => {
  const activeUsers = users.filter(user => user.status === 'ACTIVE');

  return (
    <div data-testid={groupMemberTestIds.groupMembersDiv} className='flex flex-col gap-2 w-full'>
      <div className='flex flex-col gap-5'>
        {activeUsers.map((member) => (
          <div
            key={member.id}
            data-testid={groupMemberTestIds.memberDiv}
            className='flex items-center justify-between gap-3'
          >
            <div className='flex items-center justify-start gap-3'>
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user.image || ""} />
                <AvatarFallback>{member.user.username[0]}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start justify-start'>
                <p className='text-sm'>{member.user.name}<span className='font-light'> ({member.user.username})</span></p>
                <p className='text-xs text-zinc-400'>{member.user.email}</p>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <DeleteGroupMember groupId={member.groupId} memberId={member.user.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupMembers