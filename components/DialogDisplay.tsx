import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Frown } from 'lucide-react';

interface DialogDisplayProps {
    isopen?: boolean
    setIsOpen?: (isOpen: boolean) => void
    description: string
}
const DialogDisplay: React.FC<DialogDisplayProps> = ({isopen, setIsOpen, description}) => {
    return (
        <Dialog open={isopen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader className='items-center'>
                <DialogTitle><Frown size={100} color='#d95950'/></DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )

}
export default DialogDisplay