
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { PhoneCall, MessageSquare, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const emergencyContacts = [
    { 
      name: 'National Suicide Prevention Lifeline', 
      number: '988', 
      description: '24/7, free and confidential support for people in distress'
    },
    { 
      name: 'Crisis Text Line', 
      number: 'Text HOME to 741741', 
      description: 'Free crisis support via text message'
    },
    { 
      name: 'Emergency Services', 
      number: '911', 
      description: 'For immediate emergencies'
    }
  ];
  
  return (
    <>
      <Button 
        className="fixed right-6 bottom-6 rounded-full h-12 w-12 shadow-lg z-40 flex items-center justify-center p-0"
        variant="destructive"
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="h-5 w-5" />
        <span className="sr-only">Emergency SOS</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Emergency Support
            </DialogTitle>
            <DialogDescription>
              If you're experiencing a mental health emergency, please reach out to one of these resources immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            {emergencyContacts.map((contact, i) => (
              <Card key={i} className="p-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="flex items-center gap-2"
                      asChild
                    >
                      <a href={`tel:${contact.number.replace(/\D/g, '')}`}>
                        <PhoneCall className="h-4 w-4" />
                        <span>Call</span>
                      </a>
                    </Button>
                    
                    {contact.name === 'Crisis Text Line' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                        asChild
                      >
                        <a href={`sms:741741&body=HOME`}>
                          <MessageSquare className="h-4 w-4" />
                          <span>Text</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <p className="text-xs text-muted-foreground">
              This is not a substitute for professional medical advice. If you're in immediate danger, please call emergency services.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencySOS;
