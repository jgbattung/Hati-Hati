import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { addContactTestIds } from "@/utils/constants";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CircleX } from "lucide-react";

interface ContactErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ContactErrorMessage = ({ message, onClose }: ContactErrorMessageProps) => {
  return (
    <DialogContent
      data-testid={addContactTestIds.errorDialog}
      className="flex flex-col items-center justify-center max-sm:max-w-72 rounded-md border-2 border-zinc-600 [&>button:last-child]:hidden"
    >
    <CircleX
      size={60}
      color="#f43f5e"
    />
    <DialogTitle className="font-bold text-2xl">Oops!</DialogTitle>
    <div className="flex flex-col items-center justify-center gap-5">
      <p className="text-center text-zinc-400 text-sm">{message}</p>
      <Button 
        onClick={onClose}
        className="px-4 py-2 rounded-md max-md:w-full bg-rose-500 hover:bg-rose-600 text-zinc-100 transition-colors"
      >
        Continue
      </Button>
    </div>
  </DialogContent>
  )
}

export default ContactErrorMessage;