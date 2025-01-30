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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new contact</DialogTitle>
          <DialogDescription>
            {`Add a new contact to Hati-hati and add them to your groups.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="col-span-3"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="col-span-3"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
              >
                Add new contact
              </Button>
              <Button>
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