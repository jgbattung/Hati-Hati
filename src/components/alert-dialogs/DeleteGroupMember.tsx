"use client"

import { useLoadingStore } from "@/lib/store";
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { SquareArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { removeGroupMember } from "@/lib/actions/group.actions";
import { useState } from "react";
import { deleteGroupMemberTestIds } from "@/utils/constants";

interface DeleteGroupMemberProps {
  groupId: string;
  memberId: string;
}

const DeleteGroupMember = ({ groupId, memberId }: DeleteGroupMemberProps) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const { isLoading, setIsLoading } = useLoadingStore();
  const router = useRouter();

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) return;

      const result = await removeGroupMember({
        groupId: groupId,
        memberId: memberId,
        currentUserId: user.id
      });

      if (result.success) {
        if (memberId === user.id) {
          router.push('/groups');
        }
      }
    } catch (error) {
      console.error("Error removing user from the group: ", error);
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          data-testid={deleteGroupMemberTestIds.deleteMemberButton}
          className="text-rose-600 hover:text-rose-700 transition-colors"
        >
          <SquareArrowRight
            strokeWidth={1.5}
            size={24}
          />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        data-testid={deleteGroupMemberTestIds.deleteMemberDialog}
        className='flex flex-col items-center justify-center max-sm:max-w-72 rounded-md bg-zinc-900'
      >
        <AlertDialogHeader className="text-left flex flex-col gap-3">
          <AlertDialogTitle data-testid={deleteGroupMemberTestIds.dialogTitle} className="text-lg font-bold">Remove member?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Are you sure you want to remove this person from this group?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='w-full mt-3'>
          <AlertDialogCancel data-testid={deleteGroupMemberTestIds.cancelButton}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            data-testid={deleteGroupMemberTestIds.confirmButton}
            disabled={isLoading}
            onClick={handleRemove}
            className="rounded-md bg-rose-800 hover:bg-rose-900 transition-colors"
          >
            {isLoading ? "Removing member..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteGroupMember