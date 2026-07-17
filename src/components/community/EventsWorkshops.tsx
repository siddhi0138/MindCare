
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, Filter, ExternalLink, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { EventsWorkshopsProps } from "./EventsWorkshops.d";
import { useAuth } from "@/contexts/AuthContext";
import { rsvpToEvent, cancelEventRsvp, getUserEventRsvps, getEventAttendeeCounts, saveUserActivity } from "@/configs/firebase";
import { sendNotificationEmail } from "@/lib/notify";
import { downloadIcsEvent } from "@/lib/ics";
import { addEventToGoogleCalendar } from "@/lib/googleCalendar";

// Parses seed duration strings like "1.5 hours", "1 hour", "30 minutes" into minutes
const parseDurationMinutes = (duration: string): number => {
  const match = duration.match(/([\d.]+)\s*(hour|minute)/i);
  if (!match) return 60;
  const value = parseFloat(match[1]);
  return match[2].toLowerCase().startsWith('hour') ? value * 60 : value;
};

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  type: "workshop" | "webinar" | "meditation" | "panel";
  attendees: number;
  maxAttendees: number;
  host: string;
  image: string;
  tags: string[];
}

// Seed events keep a rolling schedule relative to today, rather than a fixed past date that would always read as "over"
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const EVENTS_DATA: Event[] = [
  {
    id: "1",
    title: "Mindfulness for Beginners Workshop",
    description: "Learn the basics of mindfulness meditation in this interactive workshop led by Dr. Sarah Johnson.",
    date: daysFromNow(5),
    time: "18:00",
    duration: "1.5 hours",
    location: "Online",
    type: "workshop",
    attendees: 42,
    maxAttendees: 100,
    host: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400",
    tags: ["mindfulness", "meditation", "beginner"]
  },
  {
    id: "2",
    title: "Coping with Anxiety Webinar",
    description: "Join our panel of experts as they discuss evidence-based strategies for managing anxiety.",
    date: daysFromNow(7),
    time: "19:00",
    duration: "1 hour",
    location: "Online",
    type: "webinar",
    attendees: 89,
    maxAttendees: 200,
    host: "Mental Health Alliance",
    image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400",
    tags: ["anxiety", "coping", "mental health"]
  },
  {
    id: "3",
    title: "Live Guided Meditation Session",
    description: "Join our popular weekly guided meditation session to reduce stress and improve focus.",
    date: daysFromNow(1),
    time: "08:00",
    duration: "30 minutes",
    location: "Online",
    type: "meditation",
    attendees: 67,
    maxAttendees: 150,
    host: "Mark Williams, Meditation Instructor",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400",
    tags: ["meditation", "stress relief", "morning routine"]
  },
  {
    id: "4",
    title: "Building Healthy Relationships Workshop",
    description: "Learn practical skills for improving communication and building healthier relationships.",
    date: daysFromNow(10),
    time: "17:30",
    duration: "2 hours",
    location: "Community Center, 123 Main St.",
    type: "workshop",
    attendees: 28,
    maxAttendees: 40,
    host: "Dr. Michael Chen",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400",
    tags: ["relationships", "communication", "in-person"]
  },
  {
    id: "5",
    title: "Mental Health in the Workplace Panel",
    description: "Industry experts discuss creating mentally healthy work environments and supporting employee wellbeing.",
    date: daysFromNow(14),
    time: "12:00",
    duration: "1.5 hours",
    location: "Online",
    type: "panel",
    attendees: 112,
    maxAttendees: 300,
    host: "Workplace Wellness Network",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=400",
    tags: ["workplace", "panel discussion", "professional"]
  }
];

const EventsWorkshops = ({ onRSVP }: EventsWorkshopsProps) => {
  const { currentUser } = useAuth();
  const [events] = useState<Event[]>(EVENTS_DATA);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsEvent, setDetailsEvent] = useState<Event | null>(null);
  const [rsvpedEventIds, setRsvpedEventIds] = useState<string[]>([]);
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({});
  const [sendReminder, setSendReminder] = useState(true);
  const [addToCalendar, setAddToCalendar] = useState(true);

  useEffect(() => {
    getEventAttendeeCounts().then(setAttendeeCounts);
    if (currentUser) {
      getUserEventRsvps(currentUser.id).then(setRsvpedEventIds);
    } else {
      setRsvpedEventIds([]);
    }
  }, [currentUser]);

  const attendeeCount = (event: Event) => event.attendees + (attendeeCounts[event.id] || 0);

  const handleRSVP = (event: Event) => {
    if (!currentUser) {
      toast.error("Login required", { description: "Please log in to RSVP for events." });
      return;
    }
    setSelectedEvent(event);
    setSendReminder(true);
    setAddToCalendar(true);
    if (onRSVP) {
      onRSVP(event.title);
    }
  };

  const confirmRSVP = async () => {
    if (!selectedEvent || !currentUser) return;
    const eventStart = new Date(`${selectedEvent.date}T${selectedEvent.time}`);

    const googleCalendarResult = addToCalendar
      ? await addEventToGoogleCalendar({
          title: selectedEvent.title,
          description: selectedEvent.description,
          location: selectedEvent.location,
          start: eventStart,
          durationMinutes: parseDurationMinutes(selectedEvent.duration),
        })
      : null;

    const result = await rsvpToEvent(currentUser.id, selectedEvent.id, selectedEvent.title, eventStart, sendReminder);
    if (result.success) {
      setRsvpedEventIds((prev) => [...prev, selectedEvent.id]);
      setAttendeeCounts((prev) => ({ ...prev, [selectedEvent.id]: (prev[selectedEvent.id] || 0) + 1 }));
      toast.success(`RSVP confirmed for "${selectedEvent.title}"`, {
        description: "We've sent the event details to your email."
      });

      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'rsvp_event',
        activityName: `RSVP'd to ${selectedEvent.title}`,
        pageName: 'CommunityPage',
      });

      if (currentUser.email) {
        sendNotificationEmail(
          currentUser.email,
          `RSVP confirmed: ${selectedEvent.title}`,
          `You're confirmed for "${selectedEvent.title}" on ${eventStart.toLocaleString()} at ${selectedEvent.location}, hosted by ${selectedEvent.host}.${sendReminder ? ` We'll email you daily reminders starting 5 days before, through the day of the event.` : ''}`
        );
      }

      if (addToCalendar) {
        if (googleCalendarResult?.success) {
          toast.success("Added to Google Calendar");
        } else {
          downloadIcsEvent({
            title: selectedEvent.title,
            description: selectedEvent.description,
            location: selectedEvent.location,
            start: eventStart,
            durationMinutes: parseDurationMinutes(selectedEvent.duration),
          });
        }
      }
    } else {
      toast.error("Could not RSVP", { description: "Please try again in a moment." });
    }
    setSelectedEvent(null);
  };

  const handleCancelRSVP = async (event: Event) => {
    if (!currentUser) return;
    const result = await cancelEventRsvp(currentUser.id, event.id);
    if (result.success) {
      setRsvpedEventIds((prev) => prev.filter((id) => id !== event.id));
      setAttendeeCounts((prev) => ({ ...prev, [event.id]: Math.max(0, (prev[event.id] || 0) - 1) }));
      toast.info(`RSVP cancelled for "${event.title}"`);
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'cancel_rsvp',
        activityName: `Cancelled RSVP for ${event.title}`,
        pageName: 'CommunityPage',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          <span>Filter Events</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="border-primary/10 overflow-hidden card-hover h-full">
            <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}>
              <div className="h-full w-full flex items-start justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <Badge className="capitalize bg-white/80 text-black hover:bg-white/70">
                  {event.type}
                </Badge>
                {new Date(event.date) > new Date() && (
                  <Badge className="bg-green-500 hover:bg-green-600">Upcoming</Badge>
                )}
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-muted-foreground" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-muted-foreground" />
                <span>{event.time} • {event.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={16} className="text-muted-foreground" />
                <span>{attendeeCount(event)}/{event.maxAttendees} attending</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {event.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex gap-2">
                {rsvpedEventIds.includes(event.id) ? (
                  <Button
                    className="flex-1 flex items-center justify-center gap-2"
                    variant="outline"
                    onClick={() => handleCancelRSVP(event)}
                  >
                    <Check size={16} /> RSVP'd — Cancel
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={() => handleRSVP(event)}
                    disabled={attendeeCount(event) >= event.maxAttendees}
                  >
                    {attendeeCount(event) >= event.maxAttendees ? "Fully Booked" : "RSVP"}
                  </Button>
                )}
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setDetailsEvent(event)}>
                  <ExternalLink size={16} />
                  <span>Details</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP to {selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Reserve your spot for this event. You'll receive a confirmation email with all details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Date & Time</span>
              <span className="text-sm text-muted-foreground">
                {selectedEvent && formatDate(selectedEvent.date)} at {selectedEvent?.time}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Location</span>
              <span className="text-sm text-muted-foreground">{selectedEvent?.location}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Host</span>
              <span className="text-sm text-muted-foreground">{selectedEvent?.host}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="event-reminder"
                className="rounded"
                checked={sendReminder}
                onChange={(e) => setSendReminder(e.target.checked)}
              />
              <label htmlFor="event-reminder">Email me daily reminders starting 5 days before the event</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="add-calendar"
                className="rounded"
                checked={addToCalendar}
                onChange={(e) => setAddToCalendar(e.target.checked)}
              />
              <label htmlFor="add-calendar">Add to my Google Calendar</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>Cancel</Button>
            <Button onClick={confirmRSVP}>Confirm RSVP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detailsEvent} onOpenChange={(open) => !open && setDetailsEvent(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detailsEvent?.title}</DialogTitle>
            <DialogDescription>{detailsEvent?.description}</DialogDescription>
          </DialogHeader>
          {detailsEvent && (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-muted-foreground" />
                <span>{formatDate(detailsEvent.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-muted-foreground" />
                <span>{detailsEvent.time} • {detailsEvent.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-muted-foreground" />
                <span>{detailsEvent.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={16} className="text-muted-foreground" />
                <span>{attendeeCount(detailsEvent)}/{detailsEvent.maxAttendees} attending</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Host: </span>
                <span className="text-muted-foreground">{detailsEvent.host}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {detailsEvent.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsEvent(null)}>Close</Button>
            {detailsEvent && !rsvpedEventIds.includes(detailsEvent.id) && (
              <Button onClick={() => { handleRSVP(detailsEvent); setDetailsEvent(null); }}>RSVP</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsWorkshops;
