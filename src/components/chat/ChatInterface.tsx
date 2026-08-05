import { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../ui/sonner';
import { firestore, saveUserActivity, saveEmotionLog, saveJournalEntry, getMoodEntries, deleteChatHistory } from '../../configs/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Send, Mic, Smile, RotateCw, Paperclip, AlertTriangle, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import ClearHistoryButton from '../common/ClearHistoryButton';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggested?: boolean;
  crisis?: boolean;
  sources?: string[];
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ToolAction {
  name: string;
  args: Record<string, any>;
}

const TOOL_LABELS: Record<string, string> = {
  save_journal_entry: 'Saving to your journal',
  get_recent_mood_summary: 'Checking your recent mood check-ins',
  recommend_meditation: 'Finding a meditation for you',
  request_therapist_referral: 'Looking up therapist specialists',
};

interface StreamCallbacks {
  onMeta: (meta: { crisis: boolean; sources: string[] }) => void;
  onChunk: (text: string) => void;
  onToolCall?: (call: ToolAction) => void;
  onActions?: (actions: ToolAction[]) => void;
}

interface MoodContext {
  avg_mood: number | null;
  recent_moods: number[];
}

// Streams the FastAPI/Gemini backend response as NDJSON events (meta -> [tool_call|chunk]* -> [actions] -> done)
const streamAIResponse = async (
  message: string,
  priorMessages: Message[],
  moodContext: MoodContext,
  callbacks: StreamCallbacks
): Promise<void> => {
  const history = priorMessages
    .filter((m) => m.content?.trim())
    .slice(-10)
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.content,
    }));

  const res = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, mood_context: moodContext }),
  });

  if (!res.ok || !res.body) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || `Request failed with status ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line);
      if (event.type === 'meta') callbacks.onMeta({ crisis: event.crisis, sources: event.sources });
      else if (event.type === 'chunk') callbacks.onChunk(event.text);
      else if (event.type === 'tool_call') callbacks.onToolCall?.({ name: event.name, args: event.args });
      else if (event.type === 'actions') callbacks.onActions?.(event.actions);
      else if (event.type === 'error') throw new Error(event.detail);
    }
  }
};

// Executes an action tool the AI decided to call, using the authenticated client SDK
const executeToolAction = async (action: ToolAction, navigate: (path: string) => void) => {
  if (action.name === 'save_journal_entry') {
    const result = await saveJournalEntry({
      mood: action.args.mood,
      entryText: action.args.entry_text,
    });
    if (result.success) {
      toast.success('Journal entry saved', { description: 'The AI assistant saved this to your journal.' });
    }
  } else if (action.name === 'request_therapist_referral') {
    const specialty = action.args.specialty as string | undefined;
    toast.info('Opening therapist directory', {
      description: specialty ? `Filtered for ${specialty}` : undefined,
    });
    navigate(specialty ? `/therapists?specialty=${encodeURIComponent(specialty)}` : '/therapists');
  }
};

// Uploads a PDF to the backend so it's chunked, embedded, and added to the RAG knowledge base
const uploadKnowledgeBasePdf = async (file: File): Promise<{ chunksAdded: number }> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload-pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || `Upload failed with status ${res.status}`);
  }

  const data = await res.json();
  return { chunksAdded: data.chunks_added as number };
};

// Best-effort background emotion classification for analytics — never blocks the chat UI
const logUserEmotion = async (message: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze-emotion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return;
    const data = await res.json();
    await saveEmotionLog({ emotion: data.emotion, confidence: data.confidence });
  } catch (error) {
    console.error('Error logging emotion:', error);
  }
};

const LOCAL_CHAT_PREFIX = 'mindcare-chat-';

// Caches the active conversation in localStorage so a refresh renders instantly, before the Firestore round-trip resolves
const saveLocalChat = (userId: string, chatId: string, messages: Message[]) => {
  try {
    localStorage.setItem(LOCAL_CHAT_PREFIX + userId, JSON.stringify({ chatId, messages }));
  } catch (error) {
    console.error('Error caching chat locally:', error);
  }
};

const loadLocalChat = (userId: string): { chatId: string; messages: Message[] } | null => {
  try {
    const raw = localStorage.getItem(LOCAL_CHAT_PREFIX + userId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      chatId: parsed.chatId,
      messages: parsed.messages.map((m: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    };
  } catch (error) {
    console.error('Error reading cached chat:', error);
    return null;
  }
};

// Loads the most recent conversation document (one Firestore doc = one full conversation)
const loadChatHistory = async (userId: string): Promise<{ chatId: string; messages: Message[] } | null> => {
  try {
    const chatHistoryCollection = collection(firestore, `users/${userId}/chatHistory`);
    const q = query(chatHistoryCollection, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data() as {
      messages?: Array<{
        id: string;
        content: string;
        sender: 'user' | 'bot';
        timestamp: Timestamp;
        crisis?: boolean;
        sources?: string[];
      }>;
    };
    const messages: Message[] = (data.messages || []).map((m) => ({
      id: m.id,
      content: m.content,
      sender: m.sender,
      timestamp: m.timestamp.toDate(),
      crisis: m.crisis,
      sources: m.sources,
    }));
    return { chatId: docSnap.id, messages };
  } catch (error) {
    console.error('Error loading chat history:', error);
    return null;
  }
};

// Upserts the full message list for one conversation — always overwrites the same doc instead of appending a new one
const persistChatHistory = async (userId: string, chatId: string, messages: Message[]) => {
  try {
    await setDoc(doc(firestore, `users/${userId}/chatHistory`, chatId), {
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        timestamp: Timestamp.fromDate(m.timestamp),
        crisis: m.crisis ?? false,
        sources: m.sources ?? [],
      })),
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

const ChatInterface = () => {
  const authContext = useContext(AuthContext) as any;
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
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
  const [chatId, setChatId] = useState<string>(() => uuidv4());
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [moodContext, setMoodContext] = useState<MoodContext>({ avg_mood: null, recent_moods: [] });
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Hydrates from localStorage first (instant, no network wait), then reconciles with Firestore (source of truth)
  useEffect(() => {
    const userId = authContext.currentUser?.id;
    if (!userId) return;

    const cached = loadLocalChat(userId);
    if (cached && cached.messages.length > 0) {
      setChatId(cached.chatId);
      setMessages(cached.messages);
    }

    loadChatHistory(userId).then((remote) => {
      if (remote && remote.messages.length > 0) {
        setChatId(remote.chatId);
        setMessages(remote.messages);
        saveLocalChat(userId, remote.chatId, remote.messages);
      }
    });
  }, [authContext.currentUser?.id]);

  useEffect(() => {
    if (!authContext.currentUser?.id) return;
    getMoodEntries(authContext.currentUser.id).then((entries) => {
      const moods = entries.map((e) => e.mood);
      setMoodContext({
        avg_mood: moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : null,
        recent_moods: moods.slice(-10),
      });
    });
  }, [authContext.currentUser?.id]);



  const emojis = ["😀", "😂", "😍", "🤔", "😊", "😎", "😢", "😠", "😴", "😋"];

  const handleEmojiClick = (emoji: string) => {
    setInput((prevInput) => prevInput + emoji);
    setShowEmojis(false);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const handleVoiceInput = () => {
    
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-us';

      recognition.onresult = (event: any) => { 
        const transcript = event.results[0][0].transcript;
        setInput((prevInput) => prevInput + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast.error('Voice input failed', { description: `Speech recognition error: ${event.error}` });
      };

      recognition.start();
    } else {
      toast.error('Not supported', { description: 'Speech recognition is not supported in this browser.' });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    const priorMessages = messages;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    if (authContext.currentUser?.id) {
      saveUserActivity(
        {
          userId: authContext.currentUser.id,
          timestamp: new Date().toISOString(),
          activityType: 'send_message',
          activityName: 'Send Message',
          pageName: 'ChatPage',

        });
    }

    const botMessageId = uuidv4();
    let accumulated = '';
    let botCrisis = false;
    let botSources: string[] = [];
    let placeholderAdded = false;

    try {
      await streamAIResponse(userMessage.content, priorMessages, moodContext, {
        onMeta: ({ crisis, sources }) => {
          botCrisis = crisis;
          botSources = sources;
        },
        onToolCall: (call) => setActiveTool(call.name),
        onChunk: (text) => {
          accumulated += text;
          setActiveTool(null);
          if (!placeholderAdded) {
            placeholderAdded = true;
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              { id: botMessageId, content: accumulated, sender: 'bot', timestamp: new Date(), crisis: botCrisis, sources: botSources },
            ]);
          } else {
            setMessages((prev) => prev.map((m) => (m.id === botMessageId ? { ...m, content: accumulated } : m)));
          }
        },
        onActions: (actions) => {
          actions.forEach((action) => executeToolAction(action, navigate));
        },
      });

      if (authContext.currentUser?.id) {
        const botMessage: Message = {
          id: botMessageId,
          content: accumulated,
          sender: 'bot',
          timestamp: new Date(),
          crisis: botCrisis,
          sources: botSources,
        };
        const finalMessages = [...priorMessages, userMessage, botMessage];
        const userId = authContext.currentUser.id;
        saveLocalChat(userId, chatId, finalMessages);
        persistChatHistory(userId, chatId, finalMessages);
      }

      if (!botCrisis) {
        updateSuggestions(userMessage.content);
        if (authContext.currentUser?.id) logUserEmotion(userMessage.content);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Connection issue', {
        description: "Couldn't reach the AI assistant. Please try again in a moment.",
      });
    } finally {
      setIsTyping(false);
      setActiveTool(null);
    }
  };


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

  const handleSuggestionClick = async (suggestion: string) => {
    setInput(suggestion);

    if (authContext.currentUser?.id) {
      saveUserActivity(
        {
          userId: authContext.currentUser.id,
          timestamp: new Date().toISOString(),
          activityType: 'click_suggestion',
          activityName: 'Click Suggestion',
          pageName: 'ChatPage',
        });
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: suggestion,
      sender: 'user',
      timestamp: new Date(),
    };

    const priorMessages = messages;
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInput('');

    const botMessageId = uuidv4();
    let accumulated = '';
    let botCrisis = false;
    let botSources: string[] = [];
    let placeholderAdded = false;

    try {
      await streamAIResponse(suggestion, priorMessages, moodContext, {
        onMeta: ({ crisis, sources }) => {
          botCrisis = crisis;
          botSources = sources;
        },
        onToolCall: (call) => setActiveTool(call.name),
        onChunk: (text) => {
          accumulated += text;
          setActiveTool(null);
          if (!placeholderAdded) {
            placeholderAdded = true;
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              { id: botMessageId, content: accumulated, sender: 'bot', timestamp: new Date(), crisis: botCrisis, sources: botSources },
            ]);
          } else {
            setMessages((prev) => prev.map((m) => (m.id === botMessageId ? { ...m, content: accumulated } : m)));
          }
        },
        onActions: (actions) => {
          actions.forEach((action) => executeToolAction(action, navigate));
        },
      });

      if (authContext.currentUser?.id) {
        const botMessage: Message = {
          id: botMessageId,
          content: accumulated,
          sender: 'bot',
          timestamp: new Date(),
          crisis: botCrisis,
          sources: botSources,
        };
        const finalMessages = [...priorMessages, userMessage, botMessage];
        const userId = authContext.currentUser.id;
        saveLocalChat(userId, chatId, finalMessages);
        persistChatHistory(userId, chatId, finalMessages);
        if (!botCrisis) logUserEmotion(suggestion);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Connection issue', {
        description: "Couldn't reach the AI assistant. Please try again in a moment.",
      });
    } finally {
      setIsTyping(false);
      setActiveTool(null);
    }
  };

  // Starts a fresh conversation. The previous one is already persisted (saved after each exchange), so this
  // just points the UI at a brand-new chatId — nothing gets deleted.
  const handleStartNewChat = () => {
    const userId = authContext.currentUser?.id;

    toast.info("Starting a new conversation", {
      description: "Your previous conversation has been saved to your history."
    });

    if (userId) {
      saveUserActivity({
        userId,
        timestamp: new Date().toISOString(),
        activityType: 'start_new_chat',
        activityName: 'Start New Chat',
        pageName: 'ChatPage',
      });
    }

    const newChatId = uuidv4();
    const welcomeMessages: Message[] = [
      {
        id: uuidv4(),
        content: "Hi there! I'm your AI wellness companion. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ];

    setChatId(newChatId);
    setMessages(welcomeMessages);
    setSuggestions(SUGGESTIONS.anxiety);
    if (userId) saveLocalChat(userId, newChatId, welcomeMessages);
  };

  const handleHistoryCleared = () => {
    const userId = authContext.currentUser?.id;
    const newChatId = uuidv4();
    const welcomeMessages: Message[] = [
      {
        id: uuidv4(),
        content: "Hi there! I'm your AI wellness companion. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ];

    setChatId(newChatId);
    setMessages(welcomeMessages);
    setSuggestions(SUGGESTIONS.anxiety);
    if (userId) {
      localStorage.removeItem(LOCAL_CHAT_PREFIX + userId);
    }
  };

  const handleAttachDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Unsupported file', {
        description: 'Only PDF files can be added to the knowledge base right now.',
      });
      return;
    }

    setIsUploadingDoc(true);
    try {
      const { chunksAdded } = await uploadKnowledgeBasePdf(file);
      toast.success('Document added', {
        description: `${file.name} is now part of the AI's knowledge base (${chunksAdded} section${chunksAdded === 1 ? '' : 's'} indexed).`,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Upload failed', {
        description: "Couldn't process that PDF. Please try again.",
      });
    } finally {
      setIsUploadingDoc(false);
    }
  };

  return (
    <Card className="border-primary/10 h-[calc(100vh-260px)] min-h-[420px] sm:h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            AI Wellness Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            {authContext.currentUser?.id && (
              <ClearHistoryButton
                itemLabel="chat history"
                pageName="ChatPage"
                onConfirm={() => deleteChatHistory(authContext.currentUser.id)}
                onCleared={handleHistoryCleared}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleStartNewChat}
              title="Start a new conversation"
            >
              <RotateCw size={16} />
            </Button>
          </div>
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
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.crisis
                ? 'bg-destructive/10 border border-destructive text-foreground'
                : message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
                }`}
            >
              {message.crisis && (
                <div className="flex items-center gap-1.5 text-destructive font-medium text-xs mb-1.5">
                  <AlertTriangle size={14} />
                  Crisis support resources
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <p className="text-xs mt-1.5 opacity-60">
                  Based on: {message.sources.join(', ')}
                </p>
              )}
              <p className="text-xs text-right mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2">
              {activeTool ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wrench size={14} className="animate-pulse" />
                  {TOOL_LABELS[activeTool] || `Using ${activeTool}`}...
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-300"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Suggestion chips */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
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
                accept=".pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelected}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleAttachDocument}
                disabled={isUploadingDoc}
                title="Add a PDF to the AI's knowledge base"
              >
                <Paperclip size={16} className={isUploadingDoc ? 'animate-pulse' : ''} />
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