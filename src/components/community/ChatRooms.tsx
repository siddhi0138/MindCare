import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, MessageCircle, Users, Shield, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ChatRoomsProps } from "./ChatRooms.d";

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
  username: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "m1",
    username: "Moderator_Sam",
    content: "Welcome to our Anxiety Support chat room! Please remember to follow our community guidelines and be respectful to all members.",
    timestamp: "10:32 AM",
    isCurrentUser: false
  },
  {
    id: "m2",
    username: "AnxietyWarrior",
    content: "Hi everyone, I've been trying the breathing techniques we discussed last week and they've been really helping with my panic attacks.",
    timestamp: "10:45 AM",
    isCurrentUser: false
  },
  {
    id: "m3",
    username: "JessT",
    content: "That's great to hear! Which technique has been working best for you?",
    timestamp: "10:47 AM",
    isCurrentUser: false
  },
  {
    id: "m4",
    username: "AnxietyWarrior",
    content: "The 4-7-8 breathing has been a game changer for me, especially at night when my mind starts racing.",
    timestamp: "10:49 AM",
    isCurrentUser: false
  },
  {
    id: "m5",
    username: "NewToThis",
    content: "I'm new here. Been struggling with social anxiety for years and finally seeking support. Any tips for first-time therapy sessions?",
    timestamp: "10:52 AM",
    isCurrentUser: false
  },
  {
    id: "m6",
    username: "TherapistAna",
    content: "Welcome! It's normal to feel nervous about your first therapy session. I recommend writing down some key points you want to discuss beforehand so you don't forget anything important.",
    timestamp: "10:55 AM",
    isCurrentUser: false
  },
  {
    id: "m7",
    username: "You",
    content: "Hi everyone, I'm also dealing with anxiety. Recently started meditation and it's helping a bit.",
    timestamp: "Just now",
    isCurrentUser: true
  }
];

const ChatRooms = ({ onJoinRoom }: ChatRoomsProps) => {
  const [rooms] = useState<ChatRoom[]>(CHATROOMS_DATA);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const handleJoinChat = (room: ChatRoom) => {
    setSelectedRoom(room);
    setChatOpen(true);
    if (onJoinRoom) {
      onJoinRoom(room.name);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `new-${Date.now()}`,
      username: "You",
      content: newMessage,
      timestamp: "Just now",
      isCurrentUser: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate a response after a delay
    setTimeout(() => {
      const response: Message = {
        id: `resp-${Date.now()}`,
        username: "SupportBot",
        content: "Thanks for sharing! Remember that everyone's journey is different, and it's great that you're finding techniques that work for you.",
        timestamp: "Just now",
        isCurrentUser: false
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
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
                {room.ageRestricted && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Age Restricted
                  </Badge>
                )}
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
                <span>Join Chat</span>
                <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
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
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-xl p-3 ${
                      msg.isCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {!msg.isCurrentUser && (
                      <p className="text-xs font-medium mb-1">
                        {msg.username === "Moderator_Sam" || msg.username === "SupportBot" ? (
                          <span className="flex items-center gap-1">
                            {msg.username}
                            <Shield size={12} className="text-blue-500" />
                          </span>
                        ) : msg.username}
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-end gap-2">
                <textarea 
                  className="flex-grow resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Type your message..."
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send. Use Shift+Enter for a new line.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setChatOpen(false)}>Close Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatRooms;
