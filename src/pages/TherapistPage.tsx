
import MainLayout from "@/components/layout/MainLayout";
import TherapistDirectory from "@/components/therapist/TherapistDirectory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSearch, CalendarClock, Video } from "lucide-react";

const TherapistPage = () => {
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
        
        <Tabs defaultValue="find" className="w-full">
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
            <TherapistDirectory />
          </TabsContent>
          
          <TabsContent value="appointments">
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 shadow-sm">
              <CalendarClock className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-3">No Current Appointments</h3>
              <p className="text-muted-foreground max-w-md">
                Schedule your first appointment with one of our qualified therapists to get started.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 shadow-sm">
              <Video className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-3">No Past Sessions</h3>
              <p className="text-muted-foreground max-w-md">
                Your therapy session history will be displayed here once you complete your first session.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TherapistPage;
