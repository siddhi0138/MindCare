
import { useState, useRef, useContext } from 'react';
import { toast } from '@/components/ui/sonner';
import { firestore } from '@/configs/firebase'; // Assuming you have your Firebase config in this path
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Send, Mic, Image, RefreshCcw, Smile, PlusCircle, RotateCw, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/AuthContext';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {  id: string;  content: string;  sender: 'user' | 'bot';  timestamp: Date;  suggested?: boolean;
}

// AI suggestions based on different emotional states
const SUGGESTIONS = {
  anxiety: [
    "Could you recommend some breathing exercises I can do right now?",
    "What are some grounding techniques for anxiety?",
    "How can I stop overthinking everything?"
  ],
  depression: [
    "I'm having trouble finding motivation today. Any tips?",
    "What are small ways to improve my mood when I'm feeling down?",
    "How do I deal with persistent negative thoughts?"
  ],
  stress: [
    "What are quick stress-relief techniques I can use at work?",
    "I'm feeling overwhelmed with everything. How can I prioritize?",
    "How does stress affect my physical health?"
  ],
  sleep: [
    "I'm having trouble falling asleep. Any suggestions?",
    "What's a good bedtime routine for better sleep?",
    "How can I quiet my mind at night?"
  ]
};

interface ToastProps {
  description: string;
  variant: "default" | "destructive" | "outline" | "secondary";
}

// AI responses with helpful resources and techniques
const AI_RESPONSES = [
  {
    trigger: "breathing",
    response: `Let's try a simple breathing exercise together:

1. Breathe in through your nose for 4 counts
2. Hold for 2 counts
3. Exhale slowly through your mouth for 6 counts
4. Repeat 5 times

This 4-2-6 pattern helps activate your parasympathetic nervous system, which reduces anxiety. Would you like me to suggest more breathing techniques?`
  },
  {
    trigger: "sleep",
    response: `Sleep difficulties are common with anxiety. Here are some evidence-based techniques that might help:

• Maintain a consistent sleep schedule (even on weekends)
• Avoid screens 1-2 hours before bedtime
• Try progressive muscle relaxation as you lie down
• Keep your bedroom cool (around 65°F/18°C)
• Consider a white noise machine to mask disruptive sounds

Would you like to explore any of these techniques in more detail?`
  },
  {
    trigger: "overwhelm",
    response: `When you're feeling overwhelmed, it can help to break things down:

1. Take a few deep breaths first
2. Write down everything that's on your mind
3. Identify just ONE small task you can complete
4. Focus only on that task until it's done
5. Take a short break and acknowledge your progress

Remember, even small steps forward are still progress. What's one small thing you could do right now?`
  }
];

// Helper function to find matching AI response
const findResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  for (const item of AI_RESPONSES) {
    if (lowerMessage.includes(item.trigger)) {
      return item.response;
    }
  }
  
  return null;
};

const ChatInterface = () => {
  const { currentUser } = useContext(AuthContext) || {};

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI wellness companion. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTIONS.anxiety);
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ["😀", "😂", "😍", "🤔", "😊", "😎", "😢", "😠", "😴", "😋"];

  const handleEmojiClick = (emoji: string) => {
    setInput((prevInput) => prevInput + emoji);
    setShowEmojis(false);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const handleVoiceInput = () => {
    // TODO: Check for user permission before starting
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-us';

      recognition.onresult = (event: any) => { // Using any for now, needs proper typing
        const transcript = event.results[0][0].transcript;
        setInput((prevInput) => prevInput + transcript);
      };

      recognition.onerror = (event: any) => { // Keep 'any' for SpeechRecognitionErrorEvent
        console.error("Speech recognition error:", event.error);
        const toastProps: ToastProps = {
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive"
        }
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);    
    setInput(''); // Clear the input field
    setIsTyping(true);    

    // Find if there's a specific response for this message
    const specificResponse = findResponse(input);
    
    // Simulate AI response with intelligent response selection
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: specificResponse || generateResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      
      // Update suggestions based on conversation context
      updateSuggestions(input);
    }, 1500);
  };
  
  // Generate contextual response based on user input
  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("anxious") || input.includes("anxiety") || input.includes("nervous") || input.includes("worry")) {
      return "I understand anxiety can be really challenging. Many people find that combining breathing exercises with grounding techniques helps in the moment. Would you like to try a quick breathing exercise or learn about the 5-4-3-2-1 grounding technique?";
    } 
    else if (input.includes("depress") || input.includes("sad") || input.includes("hopeless") || input.includes("unmotivated")) {
      return "I'm sorry you're feeling this way. Depression can make everyday activities feel much harder. Small steps are important - even getting out of bed or taking a shower is an achievement. Have you been able to talk to a mental health professional about how you're feeling?";
    }
    else if (input.includes("stress") || input.includes("overwhelm") || input.includes("too much")) {
      return "Being overwhelmed by stress is a common experience. Sometimes taking a step back to identify what's in your control can help. Would you like to try a quick prioritization exercise or a brief mindfulness moment?";
    }
    else if (input.includes("thank")) {
      return "You're very welcome. I'm here to support you whenever you need it. Is there anything else on your mind you'd like to discuss?";
    }
    else if (input.includes("meditation") || input.includes("mindful")) {
      return "Meditation can be a powerful tool for mental wellbeing. We have several guided meditations in our meditation section ranging from 2-30 minutes. Would you prefer a quick mindfulness exercise now, or shall I point you to our full meditation library?";
    }
    else {
      return "Thank you for sharing that with me. How are you feeling about it now? Is there a specific aspect of your wellbeing you'd like to focus on today?";
    }
  };
  
  // Update suggestion prompts based on conversation context
  const updateSuggestions = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("anxious") || input.includes("anxiety") || input.includes("panic")) {
      setSuggestions(SUGGESTIONS.anxiety);
    } 
    else if (input.includes("depress") || input.includes("sad") || input.includes("hopeless")) {
      setSuggestions(SUGGESTIONS.depression);
    }
    else if (input.includes("stress") || input.includes("overwhelm") || input.includes("busy")) {
      setSuggestions(SUGGESTIONS.stress);
    }
    else if (input.includes("sleep") || input.includes("insomnia") || input.includes("tired")) {
      setSuggestions(SUGGESTIONS.sleep);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    
    // Add as a message directly to improve UX flow
    const userMessage: Message = {
      id: Date.now().toString(),
      content: suggestion,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: findResponse(suggestion) || generateResponse(suggestion),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

    const saveChatHistory = async (messages: Message[]) => {
        if (!currentUser?.id) {
            console.error("User ID not found. Cannot save chat history.");
            // Handle the case where the user ID is not available, e.g., display an error message
            return;
        }
        try {
            const chatHistoryCollection = collection(firestore, `users/${currentUser.id}/chatHistory`);
            await addDoc(chatHistoryCollection, {
                messages,
                timestamp: new Date(),

                // Add other metadata if needed, e.g., userId: currentUser.id
            });
            console.log('Chat history saved successfully!');
        } catch (error) {
            console.error('Error saving chat history:', error);
            // Handle error appropriately, e.g., display an error message to the user
        }
    };

  const handleStartNewChat = () => {
    toast.info("Starting a new conversation", {
      description: "Your previous conversation has been saved to your history."
    });

    saveChatHistory(messages); // Call the save function here

    setMessages([
      {
        id: '1',
        content: "Hi there! I'm your AI wellness companion. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
    setSuggestions(SUGGESTIONS.anxiety);
  };


  const handleAttachDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setInput((prevInput) => prevInput + ` Attached file: ${file.name}`);
  };

  return (
    <Card className="border-primary/10 h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            AI Wellness Assistant
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={handleStartNewChat}
          >
            <RotateCw size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Suggestion chips */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm" 
              className="rounded-full text-xs"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
      
      <CardFooter className="border-t p-4">
        <div className="flex items-end gap-2 w-full">
          <div className="flex-grow relative">
            <Textarea
              placeholder="Type your message or attach a file..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-12 min-h-[60px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="absolute right-3 bottom-2 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelected}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleAttachDocument}>
                <Paperclip size={16} />
              </Button>
              {showEmojis && (
                <div className="absolute bottom-12 right-0 bg-white border rounded-md shadow-md p-2 flex flex-wrap w-40">
                  {emojis.map((emoji, index) => (
                    <span key={index} className="text-2xl p-1 cursor-pointer hover:bg-gray-100 rounded-md" onClick={() => handleEmojiClick(emoji)}>{emoji}</span>
                  ))}
                </div>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toggleEmojis}>
                <Smile size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleVoiceInput}>
                <Mic size={20} />
              </Button>
          </div>
          </div>
          <Button size="icon" className="h-[60px] w-10 rounded-full" onClick={handleSend}>
            <Send size={20} />
          </Button>
        </div>
       </CardFooter>
     </Card>
   );
 };

 export default ChatInterface;