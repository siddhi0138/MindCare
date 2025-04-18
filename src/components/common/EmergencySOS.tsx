
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Phone, HeartPulse, X } from 'lucide-react';

const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full size-14 bg-destructive hover:bg-destructive/90 text-white" 
        onClick={() => setIsOpen(true)}
      >
        <HeartPulse size={26} />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <HeartPulse className="text-destructive" /> Emergency Support
            </DialogTitle>
            <DialogDescription>
              If you're experiencing a mental health emergency, please reach out for immediate help.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-medium text-lg">Crisis Helpline</h3>
              <p className="text-sm text-muted-foreground mb-3">Available 24/7 for emotional support</p>
              <Button className="w-full flex items-center gap-2 bg-destructive hover:bg-destructive/90">
                <Phone size={16} /> Call 988
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-medium text-lg">Text Crisis Line</h3>
              <p className="text-sm text-muted-foreground mb-3">Text HOME to 741741 to connect with a crisis counselor</p>
              <Button className="w-full" variant="outline">
                Text Crisis Line
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="font-medium text-lg">Emergency Services</h3>
              <p className="text-sm text-muted-foreground mb-3">For immediate danger, call emergency services</p>
              <Button className="w-full" variant="secondary">
                Call 911
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center pt-2">
              These resources are available to provide immediate support during a crisis.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencySOS;
