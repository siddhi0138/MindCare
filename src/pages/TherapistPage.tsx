
import MainLayout from "@/components/layout/MainLayout";
import TherapistDirectory from "@/components/therapist/TherapistDirectory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSearch, CalendarClock, Video } from "lucide-react";

const TherapistPage = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Connect with a Therapist</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Find and connect with licensed mental health professionals. Book in-person or virtual sessions 
          with therapists specializing in anxiety, depression, stress, and more.
        </p>
        
        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-8">
            <TabsTrigger value="find" className="flex items-center gap-2">
              <UserSearch className="h-4 w-4" />
              <span>Find Therapists</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>My Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>My Sessions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="find">
            <TherapistDirectory />
          </TabsContent>
          
          <TabsContent value="appointments">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <CalendarClock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Appointments Yet</h3>
              <p className="text-muted-foreground max-w-md">
                Once you book an appointment with a therapist, it will appear here.
                Start by finding a therapist that's right for you.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Video className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Session History</h3>
              <p className="text-muted-foreground max-w-md">
                Your past and upcoming therapy sessions will be listed here.
                Schedule your first appointment to get started.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TherapistPage;
