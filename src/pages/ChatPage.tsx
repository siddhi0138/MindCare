import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import ChatInterface from "@/components/chat/ChatInterface";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ChatPage = () => {
  const { recordActivity } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    const recordVisit = async () => {
      if (currentUser) {
         try {
          await recordActivity("visit-chat-page", "Visit Chat Page", "ChatPage");
        } catch (error) {
          console.error("Failed to record visit:", error);
        }
      }
    };

    recordVisit();
  }, [currentUser, recordActivity]);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Wellness Assistant</h1>
        <p className="text-muted-foreground mb-8">
          Chat with our AI companion for emotional support, mental health resources, and guided exercises. 
          We're here to listen 24/7.
        </p>
        
        <ChatInterface />
        
        <div className="mt-6 text-sm text-muted-foreground text-center">
          <p>
            This AI assistant is not a replacement for professional mental health care. 
            If you're experiencing a crisis, please use the SOS button or call a crisis helpline.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;