"use client"

import { useState } from "react";
import { useLoadingStore } from "@/lib/store";
import { z } from "zod";
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GroupValidation } from "@/lib/validations/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { updateGroupDetails } from "@/lib/actions/group.actions";
import { updateGroupNameTestIds } from "@/utils/constants";

interface UpdateGroupNameProps {
  groupId: string;
  currentName: string;
}

const UpdateGroupName = ({ groupId, currentName }: UpdateGroupNameProps) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false)
  const { isLoading, setIsLoading } = useLoadingStore();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof GroupValidation>>({
    resolver: zodResolver(GroupValidation),
    defaultValues: {
      name: currentName,
    },
  });

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof GroupValidation>) => {
    setIsLoading(true)
    try {
      if (!user?.id) return;

      const result = await updateGroupDetails({
        groupId,
        userId: user.id,
        name: values.name,
      });

      if (result.success && result.group) {
        setOpen(false);
        form.reset();
        router.push(`/groups/${groupId}/settings`);
      }

      if (result.error) {
        console.error("Error renaming group: ", result.error)
      }
    } catch (error) {
      console.error("Error renaming group: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid={updateGroupNameTestIds.updateGroupButton}>
          <Pencil size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent
        data-testid={updateGroupNameTestIds.updateGroupDialog}
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-72 rounded-md border-2 p-5 border-zinc-600 bg-zinc-900 [&>button:last-child]:hidden"
      >
        <DialogHeader
          className='flex flex-col items-center justify-center gap-3'
        >
          <DialogTitle data-testid={updateGroupNameTestIds.dialogTitle}>Rename your group</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-center">
                  <FormLabel className="text-xs">Group Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-xs rounded-md"
                    />
                  </FormControl>
                  <FormMessage
                    className="text-xs text-rose-500"
                  />
                </FormItem>
              )}
            />
            <div className="mt-6 flex flex-col gap-2">
              <Button
                data-testid={updateGroupNameTestIds.confirmButton}
                type="submit"
                disabled={isLoading}
                className={`px-2 py-1 rounded-md bg-violet-700 hover:bg-violet-800 text-zinc-50 font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Confirm
              </Button>
              <Button
                data-testid={updateGroupNameTestIds.cancelButton}
                type="button"
                onClick={handleCancel}
                className="px-2 py-1 rounded-md border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateGroupName


