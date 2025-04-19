
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatRooms from '@/components/community/ChatRooms';
import SupportGroups from '@/components/community/SupportGroups';
import EventsWorkshops from '@/components/community/EventsWorkshops';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MessageCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CommunityHub = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat-rooms");
  
  const handleJoinGroup = (groupName: string) => {
    if (isAuthenticated) {
      toast.success(`Joined ${groupName}`, {
        description: "You'll receive notifications for this group."
      });
    } else {
      toast.error("Authentication required", {
        description: "Please login to join community groups."
      });
    }
  };
  
  const handleRSVP = (eventName: string) => {
    if (isAuthenticated) {
      toast.success(`RSVP confirmed for ${eventName}`, {
        description: "You'll receive a reminder before the event."
      });
    } else {
      toast.error("Authentication required", {
        description: "Please login to RSVP for events."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Community Support</h1>
        <p className="text-muted-foreground">
          Connect with others on similar journeys and share experiences in a safe, supportive environment.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="chat-rooms" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Chat Rooms</span>
          </TabsTrigger>
          <TabsTrigger value="support-groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Support Groups</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat-rooms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatRooms onJoinRoom={handleJoinGroup} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="support-groups" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <SupportGroups onJoinGroup={handleJoinGroup} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events & Workshops</CardTitle>
            </CardHeader>
            <CardContent>
              <EventsWorkshops onRSVP={handleRSVP} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {!isAuthenticated && (
        <Card className="bg-muted/50 border-none">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">Create an account to fully participate</h3>
                <p className="text-sm text-muted-foreground">Join groups, RSVP to events, and connect with the community</p>
              </div>
              <Button onClick={() => window.location.href = '/signup'}>
                Sign up now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityHub;
