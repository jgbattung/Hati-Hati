"use client"

import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Trash } from 'lucide-react'
import { useLoadingStore } from '@/lib/store';
import { deleteGroup } from '@/lib/actions/group.actions';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { deleteGroupTestIds } from '@/utils/constants';

interface DeleteGroupProps {
  groupId: string;
}


const DeleteGroup = ({ groupId }: DeleteGroupProps) => {
  const { user } = useUser();
  const { isLoading, setIsLoading } = useLoadingStore();
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) return;

      const result = await deleteGroup({ groupId: groupId, userId: user?.id })

      if (!result.error && result.success) {
        router.push('/groups');
      }
    } catch (error) {
      console.error("Error deleting group: ", error);
    } finally {
      setIsLoading(false)
    }
  }; 

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          data-testid={deleteGroupTestIds.deleteGroupButton}
          className='flex items-center justify-start gap-5 text-rose-600 hover:text-rose-700'
        >
          <Trash
            size={18}
            className='text-inherit'
          />
          <p className='text-sm'>Delete group</p>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        data-testid={deleteGroupTestIds.deleteGroupDialog}
        className='flex flex-col items-center justify-center max-sm:max-w-72 rounded-md bg-zinc-900'
      >
        <AlertDialogHeader className='text-left flex flex-col gap-3'>
          <AlertDialogTitle data-testid={deleteGroupTestIds.dialogTitle} className='text-lg font-bold'>Delete group?</AlertDialogTitle>
          <AlertDialogDescription className='text-sm'>This action cannot be undone. This will remove this group for ALL users involed, not just yourself.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='w-full mt-3'>
          <AlertDialogCancel data-testid={deleteGroupTestIds.cancelButton}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            data-testid={deleteGroupTestIds.confirmDeleteButton}
            disabled={isLoading}
            onClick={handleDelete}
            className='rounded-md bg-rose-800 hover:bg-rose-900 transition-colors'
          >
            {isLoading ? 'Deleting group...' : 'Delete group'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteGroup