
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Star, Video } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { bookAppointment, saveUserActivity } from '@/configs/firebase';
import { sendNotificationEmail } from '@/lib/notify';
import { downloadIcsEvent } from '@/lib/ics';
import { addEventToGoogleCalendar } from '@/lib/googleCalendar';

interface Therapist {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  reviews: number;
  experience: number;
  price: number;
  image: string;
  available: boolean;
  location: string;
  distance: string;
  nextAvailable: string;
}

interface TherapistCardProps {
  id?: string;
  name?: string;
  specialty?: string;
  imageUrl?: string;
  rating?: number;
  experience?: string;
  price?: string;
  availableToday?: boolean;
  therapist?: Therapist;
  onBooked?: () => void;
}

const TherapistCard = ({
  id,
  name,
  specialty,
  imageUrl,
  rating,
  experience,
  price,
  availableToday = false,
  therapist,
  onBooked,
}: TherapistCardProps) => {
  const { currentUser } = useAuth();
  const [bookingType, setBookingType] = useState<'consultation' | 'video' | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [remindMe, setRemindMe] = useState(true);
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const displayId = therapist ? therapist.id : id;
  const displayName = therapist ? therapist.name : name;
  const displaySpecialty = therapist ? therapist.specialties[0] : specialty;
  const displayImageUrl = therapist ? therapist.image : imageUrl;
  const displayRating = therapist ? therapist.rating : rating;
  const displayExperience = therapist ? `${therapist.experience} years` : experience;
  const displayPrice = therapist ? `$${therapist.price}/session` : price;
  const displayAvailableToday = therapist ? (therapist.nextAvailable === "Today") : availableToday;

  const openBookingDialog = (type: 'consultation' | 'video') => {
    if (!currentUser) {
      toast.error('Login required', { description: 'Please log in to book an appointment.' });
      return;
    }
    setBookingType(type);
    setScheduledDate('');
    setScheduledTime('');
  };

  const confirmBooking = async () => {
    if (!currentUser || !bookingType || !displayId || !displayName) return;
    if (!scheduledDate || !scheduledTime) {
      toast.error('Missing information', { description: 'Please choose a date and time.' });
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
    if (Number.isNaN(scheduledFor.getTime()) || scheduledFor < new Date()) {
      toast.error('Invalid time', { description: 'Please choose a future date and time.' });
      return;
    }

    setIsBooking(true);
    const googleCalendarResult = addToCalendar
      ? await addEventToGoogleCalendar({
          title: `${bookingType === 'video' ? 'Video Session' : 'Consultation'} with ${displayName}`,
          description: `${bookingType === 'video' ? 'Video session' : 'Consultation'} booked via MindCare.`,
          location: bookingType === 'video' ? 'Video call' : 'MindCare',
          start: scheduledFor,
          durationMinutes: 50,
        })
      : null;

    const result = await bookAppointment({
      therapistId: displayId,
      therapistName: displayName,
      type: bookingType,
      scheduledFor,
      remindersEnabled: remindMe,
    });
    setIsBooking(false);

    if (result.success) {
      toast.success('Appointment booked', {
        description: `${bookingType === 'video' ? 'Video session' : 'Consultation'} with ${displayName} on ${scheduledFor.toLocaleString()}.`,
      });
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'book_appointment',
        activityName: `Booked ${bookingType} with ${displayName}`,
        pageName: 'TherapistPage',
      });
      if (currentUser.email) {
        sendNotificationEmail(
          currentUser.email,
          `Appointment confirmed with ${displayName}`,
          `Your ${bookingType === 'video' ? 'video session' : 'consultation'} with ${displayName} is confirmed for ${scheduledFor.toLocaleString()}.${remindMe ? ` We'll email you daily reminders starting 5 days before, through the day of your appointment.` : ''}`
        );
      }
      if (addToCalendar) {
        if (googleCalendarResult?.success) {
          toast.success('Added to Google Calendar');
        } else {
          downloadIcsEvent({
            title: `${bookingType === 'video' ? 'Video Session' : 'Consultation'} with ${displayName}`,
            description: `${bookingType === 'video' ? 'Video session' : 'Consultation'} booked via MindCare.`,
            location: bookingType === 'video' ? 'Video call' : 'MindCare',
            start: scheduledFor,
            durationMinutes: 50,
          });
        }
      }
      setBookingType(null);
      onBooked?.();
    } else {
      toast.error('Could not book appointment', { description: 'Please try again in a moment.' });
    }
  };

  return (
    <Card className="border bg-card hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative p-6 md:w-1/3 flex items-center justify-center bg-muted/10">
          <Avatar className="h-32 w-32">
            <AvatarImage src={displayImageUrl} alt={displayName} />
            <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-col flex-grow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">{displayName}</CardTitle>
                <CardDescription className="text-sm">{displaySpecialty}</CardDescription>
              </div>
              {displayAvailableToday && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 whitespace-nowrap">
                  Available Today
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-2 flex-grow">
            {displayRating && (
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < displayRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">({displayRating.toFixed(1)})</span>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{displayExperience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Session Fee</span>
                <span className="font-medium">{displayPrice}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-2 pt-4 border-t">
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => openBookingDialog('consultation')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={() => openBookingDialog('video')}
            >
              <Video className="mr-2 h-4 w-4" />
              Book Video Session
            </Button>
          </CardFooter>
        </div>
      </div>

      <Dialog open={bookingType !== null} onOpenChange={(open) => !open && setBookingType(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {bookingType === 'video' ? 'Book Video Session' : 'Schedule Consultation'} with {displayName}
            </DialogTitle>
            <DialogDescription>
              Choose a date and time. You'll be able to cancel it later from the Appointments tab.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label htmlFor="appointment-date" className="mb-1 block">Date</Label>
              <Input
                id="appointment-date"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="appointment-time" className="mb-1 block">Time</Label>
              <Input
                id="appointment-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="appointment-reminder"
                className="rounded"
                checked={remindMe}
                onChange={(e) => setRemindMe(e.target.checked)}
              />
              <label htmlFor="appointment-reminder" className="text-sm">
                Email me daily reminders starting 5 days before
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="appointment-calendar"
                className="rounded"
                checked={addToCalendar}
                onChange={(e) => setAddToCalendar(e.target.checked)}
              />
              <label htmlFor="appointment-calendar" className="text-sm">
                Add to my Google Calendar
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingType(null)}>Cancel</Button>
            <Button onClick={confirmBooking} disabled={isBooking}>
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TherapistCard;
