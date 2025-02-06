import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { addContactTestIds } from "@/utils/constants";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";

interface ContactSuccessMessageProps {
  message: string;
  onClose: () => void;
}

const ContactSuccessMessage = ({ message, onClose }: ContactSuccessMessageProps) => {
  return (
    <DialogContent
      data-testid={addContactTestIds.successDialog}
      className="flex flex-col items-center justify-center max-sm:max-w-72 rounded-md border-2 border-zinc-600 [&>button:last-child]:hidden"
    >
      <CheckCircle2
        size={60}
        color="#fafafa"
        fill="#059669"
      />
      <DialogTitle className="font-bold text-2xl">Success</DialogTitle>
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="text-center text-zinc-400 text-sm">{message}</p>
        <Button 
          onClick={onClose}
          className="px-4 py-2 rounded-md max-md:w-full bg-teal-600 hover:bg-teal-700 text-zinc-100 transition-colors"
        >
          Continue
        </Button>
      </div>
    </DialogContent>
  )
};

export default ContactSuccessMessage