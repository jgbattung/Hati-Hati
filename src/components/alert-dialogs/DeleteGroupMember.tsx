"use client"

import { useLoadingStore } from "@/lib/store";
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { SquareArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { removeGroupMember } from "@/lib/actions/group.actions";
import { useState } from "react";
import { GROUP_ERROR_MESSAGES } from "@/lib/errors";

interface DeleteGroupMemberProps {
  groupId: string;
  memberId: string;
}

const DeleteGroupMember = ({ groupId, memberId }: DeleteGroupMemberProps) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      } else if (result.error) {
        setError(GROUP_ERROR_MESSAGES[result.error] || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing user from the group: ", error);
      setError("An unexpected error occurred");
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="text-rose-600 hover:text-rose-700 transition-colors">
          <SquareArrowRight
            strokeWidth={1.5}
            size={24}
          />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className='flex flex-col items-center justify-center max-sm:max-w-72 rounded-md bg-zinc-900'
      >
        <AlertDialogHeader className="text-left flex flex-col gap-3">
          <AlertDialogTitle className="text-lg font-bold">Remove member?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Are you sure you want to remove this person from this group?
            {error && (
              <p className="text-rose-500 mt-2">{error}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='w-full mt-3'>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
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