"use client"

import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

const AddContact = () => {
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
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor="name" className='text-right'>Name</Label>
            <Input
              id="name"
              className='col-span-3'
            />
          </div>
        </div>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor="email" className='text-right'>Email</Label>
            <Input
              id="email"
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter className='flex flex-col gap-2'>
          <Button>
            Cancel
          </Button>
          <Button>
            Add new contact
          </Button>
        </DialogFooter> 
      </DialogContent>
    </Dialog>
  )
}

export default AddContact