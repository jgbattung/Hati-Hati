"use client"

import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { z } from "zod";
import { ContactValidation } from "@/lib/validations/contact"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useUser } from "@clerk/nextjs"
import { addFriend } from "@/lib/actions/user.actions"
import { useCallback, useState } from "react"
import ContactSuccessMessage from "./form-success/ContactSuccessMessage"
import { FRIEND_ERROR_MESSAGES, FRIEND_ERRORS } from "@/lib/errors"
import ContactErrorMessage from "./form-error/ContactErrorMessage"
import { addContactTestIds } from "@/utils/constants"
import { UserRoundPlus } from "lucide-react"
import { useLoadingStore } from "@/lib/store"

const AddContact = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoading, setIsLoading } = useLoadingStore();

  const form = useForm<z.infer<typeof ContactValidation>>({
    resolver: zodResolver(ContactValidation),
    defaultValues: {
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
    setIsLoading(true);
    try {
      if (!user?.id) return;

      const result = await addFriend({
        email: values.email,
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

      if (result.error) {
        setErrorMessage(FRIEND_ERROR_MESSAGES[result.error] || FRIEND_ERROR_MESSAGES[FRIEND_ERRORS.GENERAL_ERROR]);
        setShowError(true);
      }
    } catch (error) {
      console.error("Error adding friend: ", error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid={addContactTestIds.addNewFriendButton}
          className="flex items-center justify-center gap-3 border border-teal-500 text-teal-500  hover:bg-teal-500/10 transition-colors"
        >
          <UserRoundPlus />
          Add more friends
        </Button>
      </DialogTrigger>
      {showSuccess ? (
        <ContactSuccessMessage message={successMessage} onClose={handleClose} />
      ) : showError ? (
        <ContactErrorMessage message={errorMessage} onClose={handleClose} />
      ) : (
        <DialogContent
          data-testid={addContactTestIds.addContactDialog}
          className="max-sm:max-w-72 rounded-md border-2 border-zinc-600 [&>button:last-child]:hidden"
        >
          <DialogHeader>
            <DialogTitle data-testid={addContactTestIds.dialogTitle}>Add a new contact</DialogTitle>
            <DialogDescription
              data-testid={addContactTestIds.dialogDescription}
              className="text-zinc-400 text-xs"
            >
              {`Add a new contact to Hati-Hati to add them to your groups.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage data-testid={addContactTestIds.emailMessage} className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  data-testid={addContactTestIds.submitButton}
                  type="submit"
                  disabled={isLoading}
                  className={`px-2 py-1 rounded-md bg-violet-700 hover:bg-violet-800 text-zinc-50 font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Add new contact
                </Button>
                <Button
                  data-testid={addContactTestIds.cancelButton}
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