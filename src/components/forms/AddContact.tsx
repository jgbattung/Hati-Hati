"use client"

import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { z } from "zod";
import { ContactValidation } from "@/lib/validations/contact"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { useUser } from "@clerk/nextjs"
import { addFriend } from "@/lib/actions/user.actions"
import { useState } from "react"

const AddContact = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof ContactValidation>>({
    resolver: zodResolver(ContactValidation),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof ContactValidation>) => {
    try {
      if (!user?.id) return;

      const result = await addFriend({
        email: values.email,
        name: values.name,
        currentUserId: user.id,
        currentUserName: user.firstName!,
      });

      if(result) console.log('EMAIL SENT')

      if (!result.error) {
        setOpen(false)
        form.reset();
      }

    } catch (error) {
      console.error("Error adding friend: ", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add new friend</Button>
      </DialogTrigger>
      <DialogContent
        className="max-sm:max-w-72 rounded-md border-2 border-zinc-600"
      >
        <DialogHeader>
          <DialogTitle>Add a new contact</DialogTitle>
          <DialogDescription
            className="text-zinc-400 text-xs"
          >
            {`Add a new contact to Hati-Hati to add them to your groups.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-center">
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-xs rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-center mt-3">
                  <FormLabel className="text-xs">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-xs rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-4 flex flex-col gap-2">
              <Button
                type="submit"
                className="px-2 py-1 rounded-md bg-violet-700 hover:bg-violet-800 text-zinc-50 font-medium transition-colors"
              >
                Add new contact
              </Button>
              <Button
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

export default AddContact