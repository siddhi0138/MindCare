
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import confetti from "canvas-confetti";

const GratitudeGame = ({ onBack }: { onBack: () => void }) => {
  const [entry, setEntry] = useState("");
  const [streak, setStreak] = useState(0);
  const [prompt, setPrompt] = useState("");

  const gratitudePrompts = [
    "What's one thing that made you smile today?",
    "Who is someone you're grateful for right now?",
    "What's something beautiful you noticed recently?",
    "What's a small victory you've had lately?",
    "What's something you're looking forward to?",
    "What's a simple pleasure that brings you joy?",
    "What's something you appreciate about yourself?",
    "What's a challenge you've overcome recently?"
  ];

  const getNewPrompt = () => {
    const newPrompt = gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)];
    setPrompt(newPrompt);
    setEntry("");
  };

  useState(() => {
    getNewPrompt();
  });

  const handleSubmit = () => {
    if (entry.trim().length < 3) {
      toast.error("Please write a longer response");
      return;
    }

    const newStreak = streak + 1;
    setStreak(newStreak);
    
    if (newStreak % 3 === 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    toast.success("Gratitude recorded! 🌟", {
      description: "Keep going! You're building a positive mindset."
    });
    
    getNewPrompt();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Gratitude Practice</CardTitle>
            <div className="text-sm text-muted-foreground">Streak: {streak}</div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>Back to Games</Button>
        </div>
        <CardDescription>Express gratitude to boost your mood and wellbeing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 p-6 rounded-lg text-center">
          <p className="text-lg font-medium">{prompt}</p>
        </div>
        
        <textarea
          className="w-full h-32 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={getNewPrompt}>New Prompt</Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Heart className="w-4 h-4" />
            Save & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GratitudeGame;
