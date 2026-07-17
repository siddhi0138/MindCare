
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, MessageCircle, Users, Shield, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ChatRoomsProps } from "./ChatRooms.d";
import { useAuth } from "@/contexts/AuthContext";
import { sendRoomMessage, subscribeToRoomMessages, joinChatRoom, getUserChatRoomMemberships, saveUserActivity } from "@/configs/firebase";
import { Timestamp } from "firebase/firestore";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  category: string;
  activeUsers: number;
  totalMessages: number;
  ageRestricted: boolean;
  moderated: boolean;
  lastActive: string;
}

const CHATROOMS_DATA: ChatRoom[] = [
  {
    id: "1",
    name: "Anxiety Support",
    description: "Real-time discussion about anxiety management techniques and support.",
    category: "Anxiety",
    activeUsers: 24,
    totalMessages: 1267,
    ageRestricted: false,
    moderated: true,
    lastActive: "Just now"
  },
  {
    id: "2",
    name: "Depression Recovery",
    description: "A supportive space for those dealing with depression to connect and share.",
    category: "Depression",
    activeUsers: 18,
    totalMessages: 2145,
    ageRestricted: false,
    moderated: true,
    lastActive: "2 minutes ago"
  },
  {
    id: "3",
    name: "Young Adults (18-25)",
    description: "Mental health discussions for young adults navigating life transitions.",
    category: "Age Group",
    activeUsers: 36,
    totalMessages: 4328,
    ageRestricted: true,
    moderated: true,
    lastActive: "Just now"
  },
  {
    id: "4",
    name: "Mindfulness Practice",
    description: "Share mindfulness techniques and experiences with others on the journey.",
    category: "Mindfulness",
    activeUsers: 12,
    totalMessages: 856,
    ageRestricted: false,
    moderated: true,
    lastActive: "5 minutes ago"
  },
  {
    id: "5",
    name: "LGBTQ+ Mental Health",
    description: "Safe space for LGBTQ+ individuals to discuss mental health challenges and support.",
    category: "Identity",
    activeUsers: 29,
    totalMessages: 1952,
    ageRestricted: false,
    moderated: true,
    lastActive: "1 minute ago"
  }
];

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Timestamp;
}

const formatTime = (timestamp: Timestamp) =>
  timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatRooms = ({ onJoinRoom }: ChatRoomsProps) => {
  const { currentUser } = useAuth();
  const [rooms] = useState<ChatRoom[]>(CHATROOMS_DATA);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [joinedRoomIds, setJoinedRoomIds] = useState<string[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (currentUser) {
      getUserChatRoomMemberships(currentUser.id).then(setJoinedRoomIds);
    } else {
      setJoinedRoomIds([]);
    }
  }, [currentUser]);

  useEffect(() => {
    return () => unsubscribeRef.current?.();
  }, []);

  const handleJoinChat = (room: ChatRoom) => {
    if (!currentUser) {
      toast.error("Login required", { description: "Please log in to join community chat rooms." });
      return;
    }

    unsubscribeRef.current?.();
    setSelectedRoom(room);
    setMessages([]);
    setChatOpen(true);
    unsubscribeRef.current = subscribeToRoomMessages(room.id, (roomMessages) => {
      setMessages(roomMessages as unknown as Message[]);
    });

    if (!joinedRoomIds.includes(room.id)) {
      joinChatRoom(currentUser.id, room.id, room.name).then(() => {
        setJoinedRoomIds((prev) => [...prev, room.id]);
      });
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'join_room',
        activityName: `Joined ${room.name}`,
        pageName: 'CommunityPage',
      });
    }

    if (onJoinRoom) {
      onJoinRoom(room.name);
    }
  };

  const handleCloseChat = () => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setChatOpen(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !currentUser) return;

    setIsSending(true);
    const displayName = `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'You';
    await sendRoomMessage(selectedRoom.id, displayName, newMessage);
    setNewMessage("");
    setIsSending(false);
    saveUserActivity({
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      activityType: 'send_room_message',
      activityName: `Sent a message in ${selectedRoom.name}`,
      pageName: 'CommunityPage',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Chat Rooms</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield size={16} />
          <span>All chats are moderated for safety</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="border-primary/10 overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{room.name}</CardTitle>
                <div className="flex flex-col items-end gap-1">
                  {room.ageRestricted && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Age Restricted
                    </Badge>
                  )}
                  {joinedRoomIds.includes(room.id) && (
                    <Badge variant="secondary">Joined</Badge>
                  )}
                </div>
              </div>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{room.activeUsers} active now</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{room.lastActive}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle size={16} />
                <span>{room.totalMessages} total messages</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full flex items-center gap-2"
                onClick={() => handleJoinChat(room)}
              >
                <span>{joinedRoomIds.includes(room.id) ? 'Reopen Chat' : 'Join Chat'}</span>
                <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={chatOpen} onOpenChange={(open) => (open ? setChatOpen(true) : handleCloseChat())}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRoom?.name}
              <Badge className="ml-2" variant="outline">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                Live
              </Badge>
            </DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              <span>{selectedRoom?.description}</span>
              <Badge variant="secondary" className="ml-2">
                <Users size={12} className="mr-1" />
                {selectedRoom?.activeUsers}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-[50vh]">
            <div className="bg-muted/30 p-2 rounded flex items-center gap-2 text-sm mb-4">
              <AlertCircle size={16} className="text-muted-foreground" />
              <span>Remember to follow our community guidelines and be respectful to all members.</span>
            </div>

            <div className="flex-grow overflow-y-auto mb-4 space-y-4" style={{ maxHeight: 'calc(50vh - 200px)' }}>
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No messages yet. Be the first to say hello!
                </p>
              ) : (
                messages.map((msg) => {
                  const isCurrentUser = msg.userId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {!isCurrentUser && (
                          <p className="text-xs font-medium mb-1">{msg.username}</p>
                        )}
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        <p className="text-xs text-right mt-1 opacity-70">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-end gap-2">
                <textarea
                  className="flex-grow resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Type your message..."
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isSending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>Send</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send. Use Shift+Enter for a new line.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseChat}>Close Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatRooms;
