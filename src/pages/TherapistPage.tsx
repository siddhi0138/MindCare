
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import TherapistDirectory from "@/components/therapist/TherapistDirectory";
import AppointmentsList from "@/components/therapist/AppointmentsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSearch, CalendarClock, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { recordActivity } from "@/hooks/use-toast";

const TherapistPage = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const specialty = searchParams.get("specialty") || undefined;
  const [bookingVersion, setBookingVersion] = useState(0);

  useEffect(() => {
    if (currentUser) recordActivity('visit-therapist-page', 'Visited Therapist Page', 'TherapistPage');
  }, [currentUser]);

  return (
    <MainLayout>
      <div className="w-full mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Find a Mental Health Professional</h1>
          <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
            Connect with licensed therapists specializing in anxiety, depression, relationships, and more.
            Choose between in-person or virtual sessions to begin your wellness journey.
          </p>
        </div>

        <Tabs
          defaultValue="find"
          className="w-full"
          onValueChange={(value) => {
            if (currentUser) recordActivity('tab-switch', value, 'TherapistPage');
          }}
        >
          <TabsList className="bg-background border-b rounded-none w-full mb-10">
            <TabsTrigger value="find" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none ">
              <UserSearch className="h-4 w-4" />
              <span>Browse Therapists</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <CalendarClock className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Video className="h-4 w-4" />
              <span>Sessions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="find">
            <TherapistDirectory initialSearch={specialty} onBooked={() => setBookingVersion((v) => v + 1)} />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsList mode="upcoming" refreshKey={bookingVersion} />
          </TabsContent>

          <TabsContent value="sessions">
            <AppointmentsList mode="past" refreshKey={bookingVersion} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TherapistPage;
