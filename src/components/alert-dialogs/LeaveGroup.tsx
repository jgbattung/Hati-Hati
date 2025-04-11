"use client"

import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useLoadingStore } from '@/lib/store';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { SquareArrowRight } from 'lucide-react';
import { deleteGroupTestIds } from '@/utils/constants';
import { removeGroupMember } from '@/lib/actions/group.actions';

interface LeaveGroupProps {
  groupId: string;
}

const LeaveGroup = ({ groupId }: LeaveGroupProps) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const { isLoading, setIsLoading } = useLoadingStore();
  const router = useRouter();

  const handleLeave = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) return;

      const result = await removeGroupMember({
        groupId: groupId,
        memberId: user.id,
        currentUserId: user.id,
      });

      if (result.success) {
        router.push('/groups');
      }
    } catch (error) {
      console.error("Error leaving the group: ", error);
    } finally {
      setOpen(false);
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className='flex items-center justify-start gap-5 text-rose-600 hover:text-rose-700'
        >
          <SquareArrowRight
            size={18}
          />
          <p className='text-sm'>Leave group</p>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className='flex flex-col items-center justify-center max-sm:max-w-72 rounded-md bg-zinc-900'
      >
        <AlertDialogHeader className='text-left flex flex-col gap-3'>
          <AlertDialogTitle data-testid={deleteGroupTestIds.dialogTitle} className='text-lg font-bold'>Leave group?</AlertDialogTitle>
          <AlertDialogDescription className='text-sm'>Are you sure you want to leave this group?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='w-full mt-3'>
          <AlertDialogCancel data-testid={deleteGroupTestIds.cancelButton}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            data-testid={deleteGroupTestIds.confirmDeleteButton}
            disabled={isLoading}
            onClick={handleLeave}
            className='rounded-md bg-rose-800 hover:bg-rose-900 transition-colors'
          >
            {isLoading ? 'Leaving group...' : 'Leave group'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LeaveGroup
