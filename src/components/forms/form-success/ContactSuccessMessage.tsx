import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";

interface ContactSuccessMessageProps {
  message: string;
  onClose: () => void;
}

const ContactSuccessMessage = ({ message, onClose }: ContactSuccessMessageProps) => {
  return (
    <DialogContent>
      <DialogTitle>Success</DialogTitle>
      <div>
        <CheckCircle2 />
        <p>{message}</p>
        <Button 
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition-colors"
        >
          Close
        </Button>
      </div>
    </DialogContent>
  )
};

export default ContactSuccessMessage