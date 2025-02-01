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
import { useCallback, useState } from "react"
import ContactSuccessMessage from "./form-success/ContactSuccessMessage"

const AddContact = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof ContactValidation>>({
    resolver: zodResolver(ContactValidation),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
      form.reset();
    }, 300)
  }, [form]);

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  }

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

      if (!result.error && result.success) {
        if (result.isExistingUser && result.user) {
          setSuccessMessage(`${result.user.name} has been added to your friends list.`);
        }

        if (!result.isExistingUser && result.invitation) {
          setSuccessMessage(`Invitation email has been sent to ${result.invitation.name}. They will automatically be added to your friends list when they sign up.`)
        }

        setShowSuccess(true);

        const timeoutId = setTimeout(handleClose, 10000);

        return () => clearTimeout(timeoutId)
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
      {showSuccess ? (
        <ContactSuccessMessage message={successMessage} onClose={handleClose} />
      ) : (
        <DialogContent
          className="max-sm:max-w-72 rounded-md border-2 border-zinc-600 [&>button:last-child]:hidden"
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
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  type="submit"
                  className="px-2 py-1 rounded-md bg-violet-700 hover:bg-violet-800 text-zinc-50 font-medium transition-colors"
                >
                  Add new contact
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
      )}
    </Dialog>
  )
}

export default AddContact