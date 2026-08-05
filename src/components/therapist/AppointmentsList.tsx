import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Video, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAppointments, cancelAppointment, saveUserActivity } from '@/configs/firebase';
import { toast } from '@/components/ui/sonner';
import VideoCallDialog from './VideoCallDialog';

interface AppointmentsListProps {
  mode: 'upcoming' | 'past';
  refreshKey: number;
}

const AppointmentsList = ({ mode, refreshKey }: AppointmentsListProps) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Awaited<ReturnType<typeof getUserAppointments>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCallTherapist, setActiveCallTherapist] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getUserAppointments(currentUser.id).then((all) => {
      const now = new Date();
      const filtered = all.filter((a) => {
        const isPast = a.scheduledFor.toDate() < now;
        if (mode === 'upcoming') return a.status === 'upcoming' && !isPast;
        return isPast || a.status === 'cancelled';
      });
      setAppointments(filtered);
      setIsLoading(false);
    });
  }, [currentUser, mode, refreshKey]);

  const handleCancel = async (appointmentId: string) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    const result = await cancelAppointment(appointmentId);
    if (result.success) {
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      toast.success('Appointment cancelled');
      if (currentUser && appointment) {
        saveUserActivity({
          userId: currentUser.id,
          timestamp: new Date().toISOString(),
          activityType: 'cancel_appointment',
          activityName: `Cancelled appointment with ${appointment.therapistName}`,
          pageName: 'TherapistPage',
        });
      }
    } else {
      toast.error('Could not cancel appointment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-center border rounded-lg bg-muted/10 shadow-sm">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    const Icon = mode === 'upcoming' ? CalendarClock : Video;
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 shadow-sm">
        <Icon className="h-16 w-16 text-muted-foreground mb-6" />
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {mode === 'upcoming' ? 'No Current Appointments' : 'No Past Sessions'}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {mode === 'upcoming'
            ? 'Schedule your first appointment with one of our qualified therapists to get started.'
            : 'Your therapy session history will be displayed here once you complete your first session.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="border-primary/10">
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-2 rounded-full bg-primary/10 shrink-0">
                {appointment.type === 'video' ? <Video className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <h4 className="font-medium truncate md:whitespace-normal md:overflow-visible">{appointment.therapistName}</h4>
                <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{appointment.scheduledFor.toDate().toLocaleString()}</span>
                  <Badge variant="outline" className="capitalize">{appointment.type}</Badge>
                  {appointment.status === 'cancelled' && <Badge variant="destructive">Cancelled</Badge>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mode === 'upcoming' && appointment.type === 'video' && appointment.status === 'upcoming' && (
                <Button
                  size="sm"
                  className="flex items-center gap-1.5"
                  onClick={() => {
                    setActiveCallTherapist(appointment.therapistName);
                    if (currentUser) {
                      saveUserActivity({
                        userId: currentUser.id,
                        timestamp: new Date().toISOString(),
                        activityType: 'join_video_call',
                        activityName: `Joined simulated video call with ${appointment.therapistName}`,
                        pageName: 'TherapistPage',
                      });
                    }
                  }}
                >
                  <Video size={14} /> Join Call
                </Button>
              )}
              {mode === 'upcoming' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCancel(appointment.id)}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <VideoCallDialog
        therapistName={activeCallTherapist || ''}
        open={activeCallTherapist !== null}
        onClose={() => setActiveCallTherapist(null)}
      />
    </div>
  );
};

export default AppointmentsList;
