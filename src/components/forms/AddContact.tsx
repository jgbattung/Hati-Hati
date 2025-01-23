"use client"

import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { z } from "zod";
import { ContactValidation } from "@/lib/validations/contact"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"

const AddContact = () => {
  const form = useForm<z.infer<typeof ContactValidation>>({
    resolver: zodResolver(ContactValidation),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async () => {
    console.log("SUBMIT")
  }

  return (
    <Dialog>
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
                Cancel
              </Button>
              <Button>
                Add new contact
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddContact