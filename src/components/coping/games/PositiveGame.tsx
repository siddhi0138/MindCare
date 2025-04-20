
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const negativeThoughts = [
  "I'm not good enough",
  "I always make mistakes",
  "Nothing ever works out for me",
  "I'll never be able to do this",
  "Everyone else is better than me",
  "I'm a failure",
  "Things will never get better",
  "I can't handle this",
];

const PositiveGame = ({ onBack }: { onBack: () => void }) => {
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [currentThought, setCurrentThought] = useState("");
  const [currentNegative, setCurrentNegative] = useState(negativeThoughts[0]);
  const [score, setScore] = useState(0);

  const getNewNegativeThought = () => {
    const newThought = negativeThoughts[Math.floor(Math.random() * negativeThoughts.length)];
    setCurrentNegative(newThought);
    setCurrentThought("");
  };

  const handleSubmit = () => {
    if (currentThought.trim().length < 5) {
      toast.error("Please write a longer positive reframe");
      return;
    }

    setThoughts([...thoughts, currentThought]);
    setScore(score + 1);
    
    toast.success("Great reframing! 🌟", {
      description: "You're getting better at positive thinking!"
    });
    
    getNewNegativeThought();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Positive Reframing</CardTitle>
            <div className="text-sm text-muted-foreground">Score: {score}</div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>Back to Games</Button>
        </div>
        <CardDescription>Transform negative thoughts into positive, balanced ones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-destructive/5 p-6 rounded-lg text-center">
          <p className="text-lg font-medium text-destructive">"{currentNegative}"</p>
          <p className="text-sm text-muted-foreground mt-2">How could you reframe this thought?</p>
        </div>
        
        <textarea
          className="w-full h-32 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Write a more balanced, positive perspective..."
          value={currentThought}
          onChange={(e) => setCurrentThought(e.target.value)}
        />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={getNewNegativeThought}>Skip & Next</Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Submit Reframe
          </Button>
        </div>

        {thoughts.length > 0 && (
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="font-medium mb-2">Your Recent Reframes:</p>
            <ul className="space-y-2">
              {thoughts.slice(-3).map((thought, index) => (
                <li key={index} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span>{thought}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PositiveGame;
