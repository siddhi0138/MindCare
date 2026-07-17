
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
import { useAuth } from '@/contexts/AuthContext';
import { saveUserActivity } from '@/configs/firebase';

interface EmergencyContact {
  region: string;
  name: string;
  number: string;
  description: string;
  action: 'call' | 'text';
}

const EmergencySOS = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    if (currentUser) {
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'sos-opened',
        activityName: 'Opened Emergency SOS',
        pageName: 'EmergencySOS',
      });
    }
  };

  const handleContactAction = (contact: EmergencyContact) => {
    if (currentUser) {
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: contact.action === 'call' ? 'sos-call' : 'sos-text',
        activityName: `${contact.action === 'call' ? 'Called' : 'Texted'} ${contact.name}`,
        pageName: 'EmergencySOS',
      });
    }
  };

  const emergencyContacts: EmergencyContact[] = [
    {
      region: 'India',
      name: 'AASRA',
      number: '+91-9820466726',
      description: '24/7 confidential helpline for emotional distress and suicide prevention',
      action: 'call',
    },
    {
      region: 'India',
      name: 'iCall',
      number: '+91-9152987821',
      description: 'Mon-Sat, 8am-10pm — free psychosocial counseling',
      action: 'call',
    },
    {
      region: 'India',
      name: 'Kiran Mental Health Helpline',
      number: '1800-599-0019',
      description: '24/7 toll-free helpline by the Government of India',
      action: 'call',
    },
    {
      region: 'International',
      name: '988 Suicide & Crisis Lifeline (US)',
      number: '988',
      description: '24/7, free and confidential support for people in distress',
      action: 'call',
    },
    {
      region: 'International',
      name: 'Crisis Text Line (US)',
      number: '741741',
      description: 'Free crisis support via text message — text HOME to start',
      action: 'text',
    },
    {
      region: 'International',
      name: 'Emergency Services (US)',
      number: '911',
      description: 'For immediate emergencies',
      action: 'call',
    },
  ];

  const regions = Array.from(new Set(emergencyContacts.map((c) => c.region)));

  return (
    <>
      <Button
        className="fixed right-6 bottom-6 rounded-full h-12 w-12 shadow-lg z-40 flex items-center justify-center p-0"
        variant="destructive"
        onClick={handleOpen}
      >
        <AlertTriangle className="h-5 w-5" />
        <span className="sr-only">Emergency SOS</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Emergency Support
            </DialogTitle>
            <DialogDescription>
              If you're experiencing a mental health emergency, please reach out to one of these resources immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            {regions.map((region) => (
              <div key={region} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{region}</h3>
                {emergencyContacts
                  .filter((c) => c.region === region)
                  .map((contact, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex flex-col space-y-2">
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {contact.action === 'call' ? (
                            <Button variant="default" size="sm" className="flex items-center gap-2" asChild>
                              <a
                                href={`tel:${contact.number.replace(/\D/g, '')}`}
                                onClick={() => handleContactAction(contact)}
                              >
                                <PhoneCall className="h-4 w-4" />
                                <span>Call</span>
                              </a>
                            </Button>
                          ) : (
                            <Button variant="default" size="sm" className="flex items-center gap-2" asChild>
                              <a
                                href={`sms:${contact.number}?body=HOME`}
                                onClick={() => handleContactAction(contact)}
                              >
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
