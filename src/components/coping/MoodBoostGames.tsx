
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Heart, Sparkles } from "lucide-react";
import MemoryGame from "./games/MemoryGame";
import GratitudeGame from "./games/GratitudeGame";
import PositiveGame from "./games/PositiveGame";

type GameType = "memory" | "gratitude" | "positive";

const MoodBoostGames = () => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  return (
    <div className="space-y-6">
      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="border-primary/10 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer" 
            onClick={() => setActiveGame("memory")}
          >
            <CardHeader>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-4 mb-2 w-12 h-12 flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Memory Match</CardTitle>
              <CardDescription>Boost focus by matching pairs of cards</CardDescription>
            </CardHeader>
          </Card>
          
          <Card 
            className="border-primary/10 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer" 
            onClick={() => setActiveGame("gratitude")}
          >
            <CardHeader>
              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-4 mb-2 w-12 h-12 flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Gratitude Practice</CardTitle>
              <CardDescription>Express gratitude to boost your mood</CardDescription>
            </CardHeader>
          </Card>
          
          <Card 
            className="border-primary/10 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer" 
            onClick={() => setActiveGame("positive")}
          >
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-4 mb-2 w-12 h-12 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Positive Reframing</CardTitle>
              <CardDescription>Transform negative thoughts into positive ones</CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : activeGame === "memory" ? (
        <MemoryGame onBack={() => setActiveGame(null)} />
      ) : activeGame === "gratitude" ? (
        <GratitudeGame onBack={() => setActiveGame(null)} />
      ) : activeGame === "positive" ? (
        <PositiveGame onBack={() => setActiveGame(null)} />
      ) : null}
    </div>
  );
};

export default MoodBoostGames;
