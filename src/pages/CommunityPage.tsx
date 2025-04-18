
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupportGroups from "@/components/community/SupportGroups";
import EventsWorkshops from "@/components/community/EventsWorkshops";
import ChatRooms from "@/components/community/ChatRooms";
import { Users, Calendar, MessageCircle } from "lucide-react";

const CommunityPage = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Community & Support</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Connect with others on similar mental health journeys, join support groups, 
          attend events, and participate in moderated chat rooms for guidance and encouragement.
        </p>
        
        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-8">
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Support Groups</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat Rooms</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups">
            <SupportGroups />
          </TabsContent>
          
          <TabsContent value="events">
            <EventsWorkshops />
          </TabsContent>
          
          <TabsContent value="chats">
            <ChatRooms />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
