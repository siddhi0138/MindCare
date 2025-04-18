
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, Filter, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/sonner";

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

const EVENTS_DATA: Event[] = [
  {
    id: "1",
    title: "Mindfulness for Beginners Workshop",
    description: "Learn the basics of mindfulness meditation in this interactive workshop led by Dr. Sarah Johnson.",
    date: "2025-04-25",
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
    date: "2025-04-27",
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
    date: "2025-04-21",
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
    date: "2025-04-30",
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
    date: "2025-05-03",
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

const EventsWorkshops = () => {
  const [events] = useState<Event[]>(EVENTS_DATA);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleRSVP = (event: Event) => {
    setSelectedEvent(event);
  };

  const confirmRSVP = () => {
    toast.success(`RSVP confirmed for "${selectedEvent?.title}"`, {
      description: "We've sent the event details to your email."
    });
    setSelectedEvent(null);
  };

  // Format date to readable format
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Events & Workshops</h2>
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
                <span>{event.attendees}/{event.maxAttendees} attending</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {event.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={() => handleRSVP(event)}
                  disabled={event.attendees >= event.maxAttendees}
                >
                  {event.attendees >= event.maxAttendees ? "Fully Booked" : "RSVP"}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
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
              <input type="checkbox" id="event-reminder" className="rounded" />
              <label htmlFor="event-reminder">Send me a reminder 1 hour before the event</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="add-calendar" className="rounded" />
              <label htmlFor="add-calendar">Add to my calendar</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>Cancel</Button>
            <Button onClick={confirmRSVP}>Confirm RSVP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsWorkshops;
