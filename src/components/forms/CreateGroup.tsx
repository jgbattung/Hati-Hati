"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from "zod";
import { GroupValidation } from '@/lib/validations/group'
import { useUser } from '@clerk/nextjs'
import { DialogContent } from '@radix-ui/react-dialog'
import { Users } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useLoadingStore } from '@/lib/store';
import { createGroup } from '@/lib/actions/group.actions';

const CreateGroup = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false)
  const { isLoading, setIsLoading } = useLoadingStore();


  const form = useForm<z.infer<typeof GroupValidation>>({
    resolver: zodResolver(GroupValidation),
    defaultValues: {
      name: "",
    },
  });

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  }


  const onSubmit = async (values: z.infer<typeof GroupValidation>) => {
    setIsLoading(true)
    try {
      if (!user?.id) return;

      const result = await createGroup({
        name: values.name,
        userId: user.id,
        username: user.username!,
        userDisplayName: user.fullName ? user.fullName : "",
      });

      if (result) console.log(result.group);

      if (result.error) {
        console.error("Error creating group: ", result.error);
      }

    } catch (error) {
      console.error("Error creating group: ", error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center px-5 py-6 rounded-3xl bg-teal-600 hover:bg-teal-700 text-zinc-100 transition-colors"
        >
          <Users
            strokeWidth={3}
          />
          Create new group
        </Button>
      </DialogTrigger>
      <DialogContent
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-72 rounded-md border-2 p-5 border-zinc-600 [&>button:last-child]:hidden"
        >
        <DialogHeader
          className='flex flex-col items-center justify-center gap-3'
        >
          <DialogTitle>Create a group</DialogTitle>
          <DialogDescription
            className="text-zinc-400 text-xs"
          >
            {`Set your group's name. You can add group members later.`}  
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-center mt-5">
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
                type="submit"
                disabled={isLoading}
                className={`px-2 py-1 rounded-md bg-violet-700 hover:bg-violet-800 text-zinc-50 font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Create group
              </Button>
              <Button
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

export default CreateGroup